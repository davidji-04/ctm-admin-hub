import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locality } from '@/types/locality';

// Corrigir os ícones default do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocalityMapProps {
  localities: Locality[];
  selectedLocalityId?: string | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  onLocalitySelect?: (id: string | null) => void;
  clickable?: boolean;
  height?: string;
  gpxUrl?: string; // Prop que vem do teu Editor
}

export const LocalityMap = ({
  localities,
  selectedLocalityId,
  onLocationSelect,
  onLocalitySelect,
  clickable = false,
  height = 'h-full min-h-[400px]',
  gpxUrl,
}: LocalityMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // SOLUÇÃO 1: Usar useState para o mapa em vez de useRef. Assim o React sabe quando o mapa está pronto!
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const gpxPolylineRef = useRef<L.Polyline | null>(null);

  // 1. Iniciar o mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance) return;

    const map = L.map(mapContainerRef.current).setView([39.5, -8.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    if (clickable && onLocationSelect) {
      map.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    setMapInstance(map); // Avisa o React que o mapa já existe

    return () => {
      map.remove();
    };
  }, [clickable, onLocationSelect]);

  // 2. Carregar a Linha do GPX MANUALMENTE
  useEffect(() => {
    if (!mapInstance || !gpxUrl) return;

    // Limpar linha antiga do GPX se existir
    if (gpxPolylineRef.current) {
      gpxPolylineRef.current.remove();
      gpxPolylineRef.current = null;
    }

    fetch(gpxUrl)
      .then(res => res.text())
      .then(gpxText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, "text/xml");

        // SOLUÇÃO 2: Procurar as tags <trkpt> ignorando o Namespace (xmlns) que estava a bloquear a leitura
        let trackPoints = xmlDoc.getElementsByTagName("trkpt");
        if (trackPoints.length === 0) {
          trackPoints = xmlDoc.getElementsByTagNameNS("*", "trkpt");
        }

        console.log(`SUCESSO: Foram encontrados ${trackPoints.length} pontos de GPS para desenhar a linha!`);

        if (trackPoints.length > 0) {
          // Extraímos a Latitude e Longitude de cada ponto da linha
          const coordinates: [number, number][] = Array.from(trackPoints).map(pt => [
            parseFloat(pt.getAttribute("lat") || "0"),
            parseFloat(pt.getAttribute("lon") || "0")
          ]);

          // Desenhamos a linha usando o código nativo do Leaflet
          gpxPolylineRef.current = L.polyline(coordinates, {
            color: '#ef4444', // Cor Vermelha
            weight: 5,        // Espessura
            opacity: 0.8,
          }).addTo(mapInstance);

          // Mandamos o mapa focar-se e fazer zoom na linha do percurso
          mapInstance.fitBounds(gpxPolylineRef.current.getBounds(), { padding: [50, 50] });
        } else {
          console.warn("Aviso: O ficheiro GPX foi lido, mas não tem pontos de traçado (trkpt).");
        }
      })
      .catch(err => console.error("Erro ao desenhar a linha do GPX:", err));

  }, [gpxUrl, mapInstance]); // Só corre quando o gpxUrl muda ou o mapa acaba de carregar

  // 3. Adicionar as Localidades como marcadores (Waypoints)
  useEffect(() => {
    if (!mapInstance) return;

    // Limpar marcadores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Limpar linha tracejada de fallback
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (localities.length === 0) return;

    const bounds = L.latLngBounds([]);
    localities.forEach((locality) => {
      const marker = L.marker([locality.latitude, locality.longitude], {
        icon: L.icon({
          iconUrl: selectedLocalityId === locality.id
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
      }).addTo(mapInstance);

      marker.bindPopup(`
        <div class="font-semibold">${locality.nome}</div>
        <div class="text-sm">
          ${locality.distancia_localidade_anterior > 0 ? `Distância: ${locality.distancia_localidade_anterior.toFixed(2)} km<br/>` : ''}
          ${locality.elevacao_altimetria ? `Elevação: ${locality.elevacao_altimetria}m` : ''}
        </div>
      `);

      if (onLocalitySelect) {
        marker.on('click', () => onLocalitySelect(locality.id));
      }

      markersRef.current.push(marker);
      bounds.extend([locality.latitude, locality.longitude]);
    });

    // Faz o fitBounds pelos marcadores apenas se não existir a linha vermelha principal
    if (localities.length > 0 && !gpxUrl) {
      mapInstance.fitBounds(bounds, { padding: [50, 50] });

      const coordinates: [number, number][] = localities.map((l) => [l.latitude, l.longitude]);
      polylineRef.current = L.polyline(coordinates, {
        color: '#2d5016',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstance);
    }
  }, [localities, selectedLocalityId, gpxUrl, onLocalitySelect, mapInstance]);

  return <div ref={mapContainerRef} className={`w-full ${height} rounded-lg border`} style={{ zIndex: 0 }} />;
};
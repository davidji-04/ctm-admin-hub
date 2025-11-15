import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locality } from '@/types/locality';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocalityMapProps {
  localities: Locality[];
  selectedLocalityId?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  clickable?: boolean;
  height?: string;
}

export const LocalityMap = ({
  localities,
  selectedLocalityId,
  onLocationSelect,
  clickable = false,
  height = 'h-96',
}: LocalityMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([39.5, -8.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    // Add click handler if clickable
    if (clickable && onLocationSelect) {
      map.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [clickable, onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers and polyline
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (localities.length === 0) return;

    // Add markers
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
          shadowSize: [41, 41],
        }),
      }).addTo(map);

      marker.bindPopup(`
        <div class="font-semibold">${locality.nome}</div>
        <div class="text-sm">
          ${locality.distancia_localidade_anterior > 0 ? `Distance: ${locality.distancia_localidade_anterior} km<br/>` : ''}
          ${locality.elevacao_altimetria ? `Elevation: ${locality.elevacao_altimetria}m` : ''}
        </div>
      `);

      markersRef.current.push(marker);
      bounds.extend([locality.latitude, locality.longitude]);
    });

    // Add polyline connecting localities
    if (localities.length > 1) {
      const coordinates: [number, number][] = localities.map((l) => [l.latitude, l.longitude]);
      polylineRef.current = L.polyline(coordinates, {
        color: '#2d5016',
        weight: 3,
        opacity: 0.7,
      }).addTo(map);
    }

    // Fit bounds
    if (localities.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [localities, selectedLocalityId]);

  return <div ref={mapContainerRef} className={`w-full ${height} rounded-lg border`} />;
};

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Route {
  id: number;
  title: string;
  country: string;
  status: string;
  category: string;
  distance: string;
  localities: number;
  modality: string;
  startCoordinates?: [number, number];
}

interface RoutesMapProps {
  routes: Route[];
  onRouteClick?: (routeId: number) => void;
  height?: string;
}

const RoutesMap = ({ routes, onRouteClick, height = "500px" }: RoutesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<{
    terrain: L.TileLayer;
    satellite: L.TileLayer;
    hybrid: L.LayerGroup;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current).setView([39.5, -8.0], 7);

    // Define tile layers
    const terrainLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "&copy; Esri",
        maxZoom: 19,
      }
    );

    const labelsLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "&copy; Esri",
        maxZoom: 19,
      }
    );

    const hybridLayer = L.layerGroup([satelliteLayer, labelsLayer]);

    // Add default terrain layer
    terrainLayer.addTo(map);

    // Store layers
    layersRef.current = {
      terrain: terrainLayer,
      satellite: satelliteLayer,
      hybrid: hybridLayer,
    };

    // Add layer control
    L.control
      .layers(
        {
          Terrain: terrainLayer,
          Satellite: satelliteLayer,
          Hybrid: hybridLayer,
        },
        {},
        { position: "topright" }
      )
      .addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when routes change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for routes with coordinates
    const validRoutes = routes.filter((route) => route.startCoordinates);

    if (validRoutes.length === 0) {
      mapInstance.current.setView([39.5, -8.0], 7);
      return;
    }

    const bounds = L.latLngBounds([]);

    validRoutes.forEach((route) => {
      if (!route.startCoordinates) return;

      const [lat, lng] = route.startCoordinates;

      // Create custom icon based on status
      const iconColor =
        route.status === "active" ? "#10b981" : route.status === "draft" ? "#f59e0b" : "#6b7280";

      const customIcon = L.divIcon({
        html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${route.title}</h3>
          <p style="margin: 2px 0;"><strong>Country:</strong> ${route.country}</p>
          <p style="margin: 2px 0;"><strong>Distance:</strong> ${route.distance}</p>
          <p style="margin: 2px 0;"><strong>Modality:</strong> ${route.modality}</p>
          <p style="margin: 2px 0;"><strong>Status:</strong> ${route.status}</p>
          <p style="margin: 2px 0;"><strong>Category:</strong> ${route.category}</p>
        </div>
      `);

      if (onRouteClick) {
        marker.on("click", () => onRouteClick(route.id));
      }

      marker.addTo(mapInstance.current!);
      markersRef.current.push(marker);
      bounds.extend([lat, lng]);
    });

    // Fit bounds to show all markers
    if (validRoutes.length > 0) {
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, onRouteClick]);

  return (
    <div
      ref={mapContainer}
      style={{ height, width: "100%" }}
      className="rounded-lg border border-border shadow-sm"
    />
  );
};

export default RoutesMap;

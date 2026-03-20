import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const makeCircleIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

const startIcon = makeCircleIcon("#22c55e");
const endIcon = makeCircleIcon("#ef4444");

/** Fits map to bounds after layout is fully painted. */
const FitBounds = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    // Double rAF ensures the browser has painted the container before Leaflet
    // reads its dimensions. Without this, invalidateSize sees 0×0.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        map.invalidateSize();
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);
  return null;
};

interface GpxMapProps {
  gpxUrl: string;
  /** Height in px. Must be a number — "100%" does NOT work with Leaflet. */
  height?: number;
}

export const GpxMap = ({ gpxUrl, height = 450 }: GpxMapProps) => {
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gpxUrl) return;
    setLoading(true);
    fetch(gpxUrl)
      .then((r) => r.text())
      .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        for (const tag of ["trkpt", "rtept", "wpt"]) {
          const nodes = Array.from(doc.querySelectorAll(tag));
          if (nodes.length > 0) {
            setPositions(
              nodes.map((n) => [
                parseFloat(n.getAttribute("lat") ?? "0"),
                parseFloat(n.getAttribute("lon") ?? "0"),
              ])
            );
            break;
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gpxUrl]);

  // ─── CRITICAL: these three style rules together fix BOTH problems ──────────
  //
  //   position: relative + zIndex: 0
  //     → creates a new CSS stacking context, so Leaflet's internal z-indexes
  //       (leaflet-tile-pane = 200, leaflet-overlay-pane = 400, controls = 1000)
  //       are compared ONLY against siblings inside this element, never against
  //       Dialogs / Modals / Dropdowns rendered elsewhere in the page.
  //
  //   isolation: isolate
  //     → belt-and-suspenders: forces a stacking context even when zIndex alone
  //       might not (e.g. inside flex/grid containers without explicit z-index).
  //
  //   height in px (not %)
  //     → Leaflet calls container.offsetHeight at mount time. If the height is
  //       inherited via "height: 100%" from an ancestor Tailwind class, offsetHeight
  //       is often still 0 at that moment → map renders as a 0px-tall strip and
  //       fitBounds has nothing to work with. Explicit pixels eliminate this race.
  // ──────────────────────────────────────────────────────────────────────────

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 0,
    isolation: "isolate",
    height,               // ← explicit px, not "100%"
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,.08)",
    background: "#f1f5f9",
  };

  return (
    <div style={wrapperStyle}>
      {loading && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.7)", backdropFilter: "blur(4px)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#64748b" }}>
            <svg style={{ animation: "spin 1s linear infinite", width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity=".75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Loading route…</span>
          </div>
        </div>
      )}

      {/* MapContainer height MUST match the wrapper height in px — never "100%" */}
      <MapContainer
        center={[39.5, -8.0]}
        zoom={6}
        style={{ height, width: "100%" }}
        attributionControl={false}
      >
        {/* CARTO Positron — clean white tiles, route stands out clearly */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {positions.length > 1 && (
          <>
            <Polyline
              positions={positions}
              pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round" }}
            />
            <Marker position={positions[0]} icon={startIcon} />
            <Marker position={positions[positions.length - 1]} icon={endIcon} />
            <FitBounds points={positions} />
          </>
        )}
      </MapContainer>

      {positions.length > 1 && !loading && (
        <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 500, display: "flex", gap: 12, background: "rgba(255,255,255,.9)", backdropFilter: "blur(4px)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500, color: "#475569", pointerEvents: "none", boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Start
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} /> End
          </span>
        </div>
      )}
    </div>
  );
};
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, Layers, MapPin, TriangleAlert } from "lucide-react";

export default function MapPanel({ cities }) {
  const hostRef = useRef(null), mapRef = useRef(null), markersRef = useRef(null), routeRef = useRef(null);
  const [tileStatus, setTileStatus] = useState("Memuat peta…");
  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    const map = L.map(hostRef.current, { scrollWheelZoom: false, zoomControl: true }).setView([-2, 118], 4);
    mapRef.current = map;
    const tiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19, attribution: '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
    });
    let errors = 0;
    tiles.on("load", () => setTileStatus("Peta siap"));
    tiles.on("tileerror", () => { errors += 1; if (errors >= 4) setTileStatus("Basemap gagal; marker dan navigasi tetap tersedia."); });
    tiles.addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    routeRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; markersRef.current = null; routeRef.current = null; };
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markersRef.current || !routeRef.current) return;
    markersRef.current.clearLayers(); routeRef.current.clearLayers();
    const locations = cities.filter((city) => Number.isFinite(city.lat) && Number.isFinite(city.lng));
    const bounds = [];
    locations.forEach((city, index) => {
      const point = [city.lat, city.lng]; bounds.push(point);
      L.circleMarker(point, { radius: 9, color: "#fff", weight: 3, fillColor: index === 0 ? "#2a64ed" : "#16a081", fillOpacity: 1 })
        .bindPopup('<strong>' + escapeHtml(city.name) + '</strong><br/><span>' + escapeHtml(city.region || "") + '</span><br/><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(city.name) + '">Buka Google Maps ↗</a>').addTo(markersRef.current);
      L.marker(point, { icon: L.divIcon({ className: "map-city-label", html: '<span>' + escapeHtml(city.name) + '</span>', iconSize: [140, 24], iconAnchor: [-5, 28] }) }).addTo(markersRef.current);
    });
    if (bounds.length > 1) {
      L.polyline(bounds, { color: "#3166e8", weight: 3, opacity: .78, dashArray: "7 8" }).addTo(routeRef.current);
      map.fitBounds(L.latLngBounds(bounds).pad(.2), { maxZoom: 7 });
    } else if (bounds.length === 1) map.setView(bounds[0], 10);
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [cities]);
  return <section className="surface map-card">
    <div className="section-heading map-heading"><div><span className="eyebrow">Peta perjalanan</span><h2>Kota tujuan & rute antarkota</h2><p>Garis putus-putus menunjukkan urutan kota secara skematis, bukan jalur rel aktual.</p></div>
      <span className={"map-status " + (tileStatus.startsWith("Basemap") ? "warning" : "")}>{tileStatus.startsWith("Basemap") ? <TriangleAlert size={14}/> : <Layers size={14}/>} {tileStatus}</span></div>
    <div ref={hostRef} className="leaflet-map" aria-label="Peta kota tujuan"/>
    <div className="map-footer"><span><MapPin size={14}/> {cities.length} kota dipilih</span><a href={"https://www.google.com/maps/dir/" + cities.map((c) => encodeURIComponent(c.name)).join("/")} target="_blank" rel="noreferrer">Cek urutan di Google Maps <ExternalLink size={13}/></a></div>
  </section>;
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

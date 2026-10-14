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
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      subdomains: ["a", "b", "c"], maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors · Tiles courtesy of <a href="https://www.openstreetmap.fr/" target="_blank" rel="noreferrer">OpenStreetMap France</a>'
    });
    let errors = 0;
    tiles.on("load", () => setTileStatus("Peta siap"));
    tiles.on("tileerror", () => { errors += 1; if (errors >= 4) setTileStatus("Basemap gagal; marker dan navigasi tetap tersedia."); });
    tiles.addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    routeRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; markersRef.current = null; routeRef.current = null; };
  }, []);
  const [geocoded, setGeocoded] = useState({});
  useEffect(() => {
    let cancelled = false;
    const missing = cities.filter((city) => !(Number.isFinite(city.lat) && Number.isFinite(city.lng)) && !geocoded[city.name]);
    if (missing.length) {
      (async () => {
        for (const city of missing) {
          if (cancelled) return;
          try {
            const query = [city.name, city.region, "Japan"].filter(Boolean).join(", ");
            const response = await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + encodeURIComponent(query), { headers: { Accept: "application/json" } });
            if (!response.ok) continue;
            const results = await response.json();
            if (!cancelled && results[0]) setGeocoded((prev) => ({ ...prev, [city.name]: { lat: Number(results[0].lat), lng: Number(results[0].lon) } }));
          } catch (_) { /* Coordinates can be supplied manually if geocoding is unavailable. */ }
          await new Promise((resolve) => window.setTimeout(resolve, 1100));
        }
      })();
    }
    return () => { cancelled = true; };
  }, [cities, geocoded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markersRef.current || !routeRef.current) return;
    markersRef.current.clearLayers(); routeRef.current.clearLayers();
    const locations = cities.map((city) => {
      const found = Number.isFinite(city.lat) && Number.isFinite(city.lng) ? city : { ...city, ...(geocoded[city.name] || {}) };
      return found;
    }).filter((city) => Number.isFinite(city.lat) && Number.isFinite(city.lng));
    const bounds = [];
    locations.forEach((city, index) => {
      const point = [city.lat, city.lng]; bounds.push(point);
      L.marker(point, { icon: L.divIcon({
        className: "map-city-number",
        html: '<span>' + (index + 1) + '</span>',
        iconSize: [29, 29], iconAnchor: [14, 14]
      }) }).bindPopup('<strong>' + escapeHtml(city.name) + '</strong><br/><span>' + escapeHtml(city.region || "") + '</span><br/><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(city.name) + '">Buka Google Maps ↗</a>').addTo(markersRef.current);
    });
    if (bounds.length > 1) {
      L.polyline(bounds, { color: "#3166e8", weight: 3, opacity: .78, dashArray: "7 8" }).addTo(routeRef.current);
      map.fitBounds(L.latLngBounds(bounds).pad(.2), { maxZoom: 7 });
    } else if (bounds.length === 1) map.setView(bounds[0], 10);
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [cities, geocoded]);
  return <section className="surface map-card">
    <div className="section-heading map-heading"><div><span className="eyebrow">Peta perjalanan</span><h2>Kota tujuan & rute antarkota</h2><p>Garis putus-putus menunjukkan urutan kota secara skematis, bukan jalur rel aktual.</p></div>
      <span className={"map-status " + (tileStatus.startsWith("Basemap") ? "warning" : "")}>{tileStatus.startsWith("Basemap") ? <TriangleAlert size={14}/> : <Layers size={14}/>} {tileStatus}</span></div>
    <div ref={hostRef} className="leaflet-map" aria-label="Peta kota tujuan"/>
    <div className="map-footer"><span><MapPin size={14}/> {cities.length} kota dipilih</span><a href={"https://www.google.com/maps/dir/" + cities.map((c) => encodeURIComponent(c.name)).join("/")} target="_blank" rel="noreferrer">Cek urutan di Google Maps <ExternalLink size={13}/></a></div>
    <div className="map-route-order" aria-label="Urutan kota pada peta">{cities.map((city, index) => <span className="map-route-chip" key={city.name}><b>{index + 1}</b>{city.name}</span>)}</div>
  </section>;
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

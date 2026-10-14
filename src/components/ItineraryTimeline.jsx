import { useState } from "react";
import { CalendarPlus, Clock3, MapPin, Pencil, Plus, Route, Ticket, Trash2, Train, ExternalLink, Hotel } from "lucide-react";
import { formatRupiah, makeId } from "../data";

const TYPES = [
  ["airport", "Bandara"], ["station", "Stasiun kereta"], ["subway", "Subway / MRT"],
  ["hotel", "Hotel / penginapan"], ["destination", "Destinasi"], ["restaurant", "Kuliner"],
  ["bus", "Bus / terminal"], ["walking", "Jalan kaki"], ["other", "Titik perjalanan"]
];
const MODES = ["Kereta antarkota", "Kereta lokal", "Shinkansen", "Subway / MRT", "Bus antarkota", "Bus lokal", "Jalan kaki", "Taksi / ride-hailing", "Ferry", "Pesawat", "Lainnya"];
const blankRoute = (from, to) => ({ mode: "Pilih transportasi", from, to, durationMin: 0, costGroup: 0, guidance: "Verifikasi stasiun, arah, jadwal, dan tarif sebelum berangkat." });
const newStop = (city) => ({ id: makeId("stop"), name: "Destinasi baru", city, type: "destination", time: "12:00", ticketPerPerson: 0, notes: "Isi detail destinasi ini.", routeToNext: null });

export default function ItineraryTimeline({ days, setDays, participants }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const safeIndex = Math.min(activeIndex, Math.max(0, days.length - 1));
  if (!days.length) return <div className="empty-state">Belum ada hari perjalanan. Tambahkan hari untuk mulai menyusun itinerary.</div>;
  const day = days[safeIndex];

  const updateDay = (dayId, transform) => setDays((current) => current.map((d) => d.id === dayId ? transform(d) : d));
  const updateStop = (dayId, stopId, transform) => updateDay(dayId, (d) => ({ ...d, points: d.points.map((p) => p.id === stopId ? transform(p) : p) }));

  const addDay = () => {
    const last = days[days.length - 1];
    setDays((current) => [...current, { id: makeId("day"), title: "Hari baru", city: last?.city || "", dayTrip: false, base: last?.base || "", points: [] }]);
    setActiveIndex(days.length);
  };

  const addStop = () => {
    const stop = newStop(day.city || "");
    updateDay(day.id, (d) => {
      const points = [...d.points];
      const returnIndex = points.findIndex((p) => p.type === "hotel" && /kembali|return/i.test(p.name));
      const insertAt = returnIndex >= 0 ? returnIndex : points.length;
      if (insertAt > 0) points[insertAt - 1] = { ...points[insertAt - 1], routeToNext: blankRoute(points[insertAt - 1].name, stop.name) };
      stop.routeToNext = insertAt < points.length ? blankRoute(stop.name, points[insertAt].name) : null;
      points.splice(insertAt, 0, stop);
      return { ...d, points };
    });
  };

  const addReturn = () => {
    const base = day.base || "Hotel / titik awal";
    const last = day.points[day.points.length - 1];
    if (last?.type === "hotel" && /kembali ke|return to/i.test(last.name)) {
      setNotice("Rute kembali sudah ada di akhir hari ini.");
      return;
    }
    const stop = { ...newStop(base), name: "Kembali ke penginapan: " + base, city: base, type: "hotel", time: "19:00", notes: "Perjalanan pulang ke kota basis/penginapan pada hari yang sama.", routeToNext: null };
    updateDay(day.id, (d) => {
      const points = d.points.slice();
      if (points.length) points[points.length - 1] = { ...points[points.length - 1], routeToNext: blankRoute(points[points.length - 1].name, stop.name) };
      points.push(stop);
      return { ...d, points };
    });
  };

  const removeStop = (stopId) => {
    updateDay(day.id, (d) => {
      const index = d.points.findIndex((p) => p.id === stopId);
      const points = d.points.filter((p) => p.id !== stopId);
      if (index > 0 && index < d.points.length - 1) points[index - 1] = { ...points[index - 1], routeToNext: blankRoute(points[index - 1].name, points[index].name) };
      else if (index > 0) points[index - 1] = { ...points[index - 1], routeToNext: null };
      return { ...d, points };
    });
    setNotice("");
  };

  const routeTotal = day.points.reduce((sum, point, index) => index < day.points.length - 1 ? sum + (Number(point.routeToNext?.costGroup) || 0) : sum, 0);
  const ticketTotal = day.points.reduce((sum, point) => sum + (Number(point.ticketPerPerson) || 0), 0);

  return <div className="itinerary-panel">
    <div className="itinerary-topline">
      <div><span className="eyebrow">Itinerary per hari</span><h2>Rute Harian: Bandara, Subway, Stasiun, Hotel & Destinasi</h2><p>Edit setiap titik dan segmen transportasi. Ongkos dan durasi bisa disesuaikan.</p></div>
      <div className="button-row">
        <button className="button secondary" onClick={addReturn}><Hotel size={15}/> Rute kembali ke hotel</button>
        <button className="button primary" onClick={addStop}><Plus size={16}/> Tambah titik / rute</button>
      </div>
    </div>

    <div className="day-tabs">
      {days.map((d, index) => <button key={d.id} className={"day-tab " + (index === safeIndex ? "active" : "")} onClick={() => setActiveIndex(index)}>
        <strong>Hari {index + 1}</strong><span>{d.city || "Lokasi belum diisi"} · {d.points.length} titik</span>
      </button>)}
      <button className="day-tab add-day" onClick={addDay}><CalendarPlus size={15}/> Tambah hari</button>
    </div>

    <div className="day-summary">
      <div><strong>Hari {safeIndex + 1} — {day.city || "Rencana fleksibel"}</strong><p>{day.dayTrip ? "Day trip: pulang-pergi dari " + (day.base || "kota basis belum ditentukan") : day.base ? "Basis perjalanan: " + day.base : "Atur titik awal dan lokasi akhir hari"} · {day.points.length} titik</p></div>
      <div className="day-totals"><span><Train size={14}/> Rute / grup: {formatRupiah(routeTotal)}</span><span><Ticket size={14}/> Tiket / orang: {formatRupiah(ticketTotal)}</span><span>Total estimasi grup: {formatRupiah(routeTotal + ticketTotal * participants)}</span></div>
    </div>

    {notice && <div className="inline-notice" role="status">{notice} <button onClick={() => setNotice("")}>OK</button></div>}
    {!day.points.length ? <div className="empty-state">Belum ada titik untuk hari ini. Tekan “Tambah titik / rute” untuk mulai.</div> :
      <div className="timeline">{day.points.map((point, index) => <div key={point.id} className="timeline-entry">
        <div className="timeline-number">{index + 1}</div>
        <div className="stop-card">
          <div className="stop-meta">
            <span className={"stop-type " + point.type}>{TYPES.find((item) => item[0] === point.type)?.[1] || "Titik perjalanan"}</span>
            <span><Clock3 size={13}/> {point.time || "Waktu belum diisi"}</span>
            <span><Ticket size={13}/> {formatRupiah(point.ticketPerPerson)} / orang</span>
            <div className="stop-actions">
              <details className="popover-editor"><summary><Pencil size={13}/> Edit</summary>
                <form className="editor-form" onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const oldName = point.name;
                  const name = String(form.get("name") || "").trim() || "Titik perjalanan";
                  updateDay(day.id, (current) => ({ ...current, points: current.points.map((p) => {
                    if (p.id === point.id) return { ...p, name, city: String(form.get("city") || "").trim(), type: String(form.get("type") || "destination"), time: String(form.get("time") || "09:00"), ticketPerPerson: Math.max(0, Number(form.get("ticket")) || 0), notes: String(form.get("notes") || "").trim() };
                    if (p.routeToNext) return { ...p, routeToNext: { ...p.routeToNext, from: p.routeToNext.from === oldName ? name : p.routeToNext.from, to: p.routeToNext.to === oldName ? name : p.routeToNext.to } };
                    return p;
                  }) }));
                  event.currentTarget.closest("details").open = false;
                }}>
                  <label>Nama titik<input name="name" defaultValue={point.name} required/></label>
                  <label>Kota / area<input name="city" defaultValue={point.city}/></label>
                  <label>Jenis titik<select name="type" defaultValue={point.type}>{TYPES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                  <label>Jam rencana<input name="time" type="time" defaultValue={point.time || "09:00"}/></label>
                  <label>Tiket per orang (Rp)<input name="ticket" type="number" min="0" step="1000" defaultValue={point.ticketPerPerson || 0}/></label>
                  <label className="full">Catatan<textarea name="notes" rows="2" defaultValue={point.notes || ""}/></label>
                  <button className="button primary full" type="submit">Simpan titik</button>
                </form>
              </details>
              <button className="icon-button danger" title="Hapus titik" onClick={() => removeStop(point.id)}><Trash2 size={14}/></button>
            </div>
          </div>
          <h3>{point.name}</h3><p className="stop-notes"><MapPin size={13}/> {point.notes || "Belum ada catatan."}</p>
        </div>
        {index < day.points.length - 1 && <>
          <div className="route-card">
            <div className="route-head"><span className="route-mode"><Route size={13}/> {point.routeToNext?.mode || "Transportasi belum diatur"}</span><strong><Clock3 size={14}/> {point.routeToNext?.durationMin ? "~" + point.routeToNext.durationMin + " menit" : "Durasi belum diisi"} · {formatRupiah(point.routeToNext?.costGroup)} / grup</strong></div>
            <div className="route-points"><div><small>🟢 NAIK DARI MANA</small><b>{point.routeToNext?.from || point.name}</b></div><div><small>🔴 TURUN DI MANA</small><b>{point.routeToNext?.to || day.points[index + 1].name}</b></div></div>
            <div className="route-bottom"><p>{point.routeToNext?.guidance || "Periksa rute aktual, stasiun, dan titik naik/turun."}</p><a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(point.routeToNext?.from || point.name) + "&destination=" + encodeURIComponent(point.routeToNext?.to || day.points[index + 1].name) + "&travelmode=transit"}>Cek Google Maps <ExternalLink size={13}/></a></div>
            <details className="route-editor"><summary>✎ Edit segmen transportasi</summary>
              <form className="editor-form" onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                updateStop(day.id, point.id, (current) => ({ ...current, routeToNext: {
                  mode: String(form.get("mode") || "Lainnya"), from: String(form.get("from") || "").trim(), to: String(form.get("to") || "").trim(),
                  durationMin: Math.max(0, Number(form.get("duration")) || 0), costGroup: Math.max(0, Number(form.get("cost")) || 0), guidance: String(form.get("guidance") || "").trim()
                } }));
                event.currentTarget.closest("details").open = false;
              }}>
                <label>Naik apa?<select name="mode" defaultValue={point.routeToNext?.mode || "Pilih transportasi"}><option>Pilih transportasi</option>{MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
                <label>Durasi (menit)<input name="duration" type="number" min="0" defaultValue={point.routeToNext?.durationMin || 0}/></label>
                <label>Naik dari / stasiun asal<input name="from" defaultValue={point.routeToNext?.from || point.name} required/></label>
                <label>Turun di / stasiun tujuan<input name="to" defaultValue={point.routeToNext?.to || day.points[index + 1].name} required/></label>
                <label>Ongkos total grup (Rp)<input name="cost" type="number" min="0" defaultValue={point.routeToNext?.costGroup || 0}/></label>
                <label className="full">Panduan / transit<textarea name="guidance" rows="2" defaultValue={point.routeToNext?.guidance || ""}/></label>
                <button className="button primary full" type="submit">Simpan rute</button>
              </form>
            </details>
          </div>
        </>}
      </div>)}</div>}
    <div className="timeline-footnote">Peta menampilkan urutan antarkota secara skematis. Periksa setiap segmen di Google Maps untuk memastikan jalur, durasi, dan tarif aktual.</div>
  </div>;
}

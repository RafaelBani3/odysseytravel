import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Banknote, CalendarDays, Check, ChevronRight, CircleHelp, Compass, Download, Globe2, Hotel, MapPinned, Plus, RotateCcw, Search, Sparkles, Wallet, X } from "lucide-react";
import { CITY_OPTIONS, COUNTRY_OPTIONS, DEFAULT_PLAN, formatRupiah, makeId } from "./data";
import ItineraryTimeline from "./components/ItineraryTimeline";
import MapPanel from "./components/MapPanel";

const clone = (v) => JSON.parse(JSON.stringify(v));
const emptyDay = (city) => ({ id: makeId("day"), title: "Hari baru", city: city || "", base: "", dayTrip: false, points: [] });
const initialState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("odyssey-react-plan-v1") || "null");
    if (saved) return { ...clone(DEFAULT_PLAN), ...saved, budget: { ...clone(DEFAULT_PLAN.budget), budgetCapPerPerson: 27000000, ...(saved.budget || {}) }, customCities: saved.customCities || {} };
  } catch (_) {}
  return { ...clone(DEFAULT_PLAN), budget: { ...clone(DEFAULT_PLAN.budget), budgetCapPerPerson: 27000000 }, customCities: {} };
};
function monthsUntil(value) {
  if (!value) return 0;
  const target = new Date(value + "T12:00:00"), now = new Date();
  if (Number.isNaN(target.getTime()) || target <= now) return 0;
  let n = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth();
  if (target.getDate() > now.getDate()) n++;
  return Math.max(0, n);
}
function Field({ label, value, onChange, type = "number", min, max, step, hint }) {
  return <label className="field-control"><span>{label}</span><input type={type} value={value ?? ""} min={min} max={max} step={step} onChange={(e) => onChange(type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value)}/>{hint && <small>{hint}</small>}</label>;
}
function getTotals(plan, cities) {
  const people = Math.max(1, Number(plan.participants) || 1), days = Math.max(1, Number(plan.daysCount) || 1), b = plan.budget;
  const hotels = cities.reduce((sum, c) => { const v = plan.citySettings[c.name] || {}; return sum + (v.mode === "stay" ? Math.max(0, Number(v.nights) || 0) * Math.max(0, Number(v.hotelPerNight) || 0) : 0); }, 0);
  const route = plan.itinerary.reduce((sum, d) => sum + d.points.reduce((s, p) => s + (Number(p.routeToNext?.costGroup) || 0), 0), 0);
  const tickets = plan.itinerary.reduce((sum, d) => sum + d.points.reduce((s, p) => s + (Number(p.ticketPerPerson) || 0), 0), 0) * people;
  const flights = (Number(b.flightPerPerson) || 0) * people, food = (Number(b.foodPerPersonPerDay) || 0) * people * days;
  const local = (Number(b.localTransportPerPersonPerDay) || 0) * people * days;
  const extras = (Number(b.intercityTransportGroup) || 0) + (Number(b.otherGroup) || 0);
  const base = flights + food + local + hotels + route + tickets + extras;
  const buffer = base * Math.max(0, Number(b.contingencyPercent) || 0) / 100, total = base + buffer;
  return { people, days, hotels, route, tickets, flights, food, local, extras, buffer, total, perPerson: total / people };
}
export default function App() {
  const [plan, setPlan] = useState(initialState);
  const [view, setView] = useState("overview");
  const [query, setQuery] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [toast, setToast] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => { try { localStorage.setItem("odyssey-react-plan-v1", JSON.stringify(plan)); } catch (_) {} }, [plan]);
  const cityOptions = useMemo(() => [...(CITY_OPTIONS[plan.country] || []), ...((plan.customCities || {})[plan.country] || [])], [plan.country, plan.customCities]);
  const selectedCities = useMemo(() => plan.selectedCities.map((name) => cityOptions.find((c) => c.name === name) || { name, region: "", lat: null, lng: null, blurb: "Destinasi manual." }), [plan.selectedCities, cityOptions]);
  const totals = getTotals(plan, selectedCities), people = totals.people, days = totals.days;
  const stay = selectedCities.reduce((r, c) => { const cfg = plan.citySettings[c.name] || {}; if (cfg.mode === "stay") { r.nights += Math.max(0, Number(cfg.nights) || 0); r.count++; } else if (cfg.mode === "daytrip") r.dayTrips++; else r.pending++; return r; }, { nights: 0, count: 0, dayTrips: 0, pending: 0 });
  const months = monthsUntil(plan.startDate), futureSavings = (Number(plan.budget.currentSavings) || 0) + (Number(plan.budget.monthlySavings) || 0) * months;
  const gap = Math.max(0, totals.total - (Number(plan.budget.currentSavings) || 0)), monthlyNeeded = months ? gap / months : gap;
  const savingsPercent = totals.total ? Math.min(100, futureSavings / totals.total * 100) : 0, cap = Number(plan.budget.budgetCapPerPerson) || 27000000;
  const setTop = (key, value) => setPlan((p) => ({ ...p, [key]: value }));
  const setBudget = (key, value) => setPlan((p) => ({ ...p, budget: { ...p.budget, [key]: value } }));
  const setSetting = (city, patch) => setPlan((p) => ({ ...p, citySettings: { ...p.citySettings, [city]: { mode: "undecided", nights: 0, baseCity: "", hotelPerNight: 0, ...(p.citySettings[city] || {}), ...patch } } }));
  const changeCountry = (country) => setPlan((p) => ({ ...p, country, selectedCities: [], citySettings: {}, itinerary: [emptyDay("")] }));
  const toggleCity = (city) => setPlan((p) => {
    const picked = p.selectedCities.includes(city.name);
    return { ...p, selectedCities: picked ? p.selectedCities.filter((n) => n !== city.name) : [...p.selectedCities, city.name],
      citySettings: { ...p.citySettings, ...(!picked && !p.citySettings[city.name] ? { [city.name]: { mode: "undecided", nights: 0, baseCity: "", hotelPerNight: 0 } } : {}) } };
  });
  const addManualCity = (e) => {
    e.preventDefault(); const name = manualCity.trim(); if (!name) return;
    const city = { name, region: "Ditambahkan manual", lat: manualLat === "" ? null : Number(manualLat), lng: manualLng === "" ? null : Number(manualLng), blurb: "Destinasi kustom." };
    setPlan((p) => {
      const others = ((p.customCities || {})[p.country] || []).filter((c) => c.name.toLowerCase() !== name.toLowerCase());
      return { ...p, customCities: { ...(p.customCities || {}), [p.country]: [...others, city] }, selectedCities: p.selectedCities.includes(name) ? p.selectedCities : [...p.selectedCities, name],
        citySettings: { ...p.citySettings, [name]: p.citySettings[name] || { mode: "undecided", nights: 0, baseCity: "", hotelPerNight: 0 } } };
    });
    setManualCity(""); setManualLat(""); setManualLng(""); setToast("Kota ditambahkan.");
  };
  const generateDraft = () => {
    if (!selectedCities.length) { setView("destinations"); setToast("Pilih minimal satu kota lebih dulu."); return; }
    const bases = selectedCities.filter((c) => { const s = plan.citySettings[c.name] || {}; return s.mode === "stay" && Number(s.nights) > 0; });
    const fallbackBase = bases[0]?.name || selectedCities[0].name;
    const next = Array.from({ length: Math.max(1, Math.min(30, days)) }, (_, i) => {
      const city = selectedCities[Math.min(selectedCities.length - 1, Math.floor(i * selectedCities.length / Math.max(1, days)))];
      const cfg = plan.citySettings[city.name] || {}, dayTrip = cfg.mode === "daytrip", base = dayTrip ? (cfg.baseCity || fallbackBase) : (cfg.mode === "stay" ? city.name : fallbackBase);
      const points = [
        { id: makeId("point"), name: "Hotel / titik awal: " + base, city: base, type: "hotel", time: "08:00", ticketPerPerson: 0, notes: "Tentukan hotel atau stasiun asal.", routeToNext: { mode: "Pilih transportasi", from: base + " — penginapan", to: city.name + " — area utama", durationMin: 0, costGroup: 0, guidance: "Isi stasiun, line, durasi dan ongkos setelah rute dikonfirmasi." } },
        { id: makeId("point"), name: "Eksplor " + city.name, city: city.name, type: "destination", time: "10:00", ticketPerPerson: 0, notes: city.blurb || "Tambahkan atraksi spesifik dan tiket.", routeToNext: dayTrip ? { mode: "Pilih transportasi pulang", from: city.name + " — area utama", to: base + " — penginapan", durationMin: 0, costGroup: 0, guidance: "Day Trip: pastikan transportasi pulang di hari yang sama." } : null }
      ];
      if (dayTrip) points.push({ id: makeId("point"), name: "Kembali ke kota basis: " + base, city: base, type: "hotel", time: "19:00", ticketPerPerson: 0, notes: "Day Trip selesai; tidak menginap di kota tujuan." });
      return { id: makeId("day"), title: "Hari " + (i + 1), city: city.name, dayTrip, base, points };
    });
    setTop("itinerary", next); setView("itinerary"); setToast("Draft itinerary dibuat. Sesuaikan destinasi dan detail transit per titik.");
  };
  const exportPlan = () => {
    const blob = new Blob([JSON.stringify({ ...plan, budgetSummary: totals, monthsToDeparture: months, projectedSavings: futureSavings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = "odyssey-travel-plan.json"; a.click(); URL.revokeObjectURL(url); setToast("Rencana diekspor.");
  };
  const resetPlan = () => { setPlan({ ...clone(DEFAULT_PLAN), budget: { ...clone(DEFAULT_PLAN.budget), budgetCapPerPerson: 27000000 }, customCities: {} }); setView("overview"); setConfirmReset(false); setToast("Rencana contoh dipulihkan."); };
  const nav = [
    { id: "overview", title: "Overview", icon: Compass }, { id: "destinations", title: "Kota & penginapan", icon: Globe2 },
    { id: "itinerary", title: "Itinerary", icon: CalendarDays }, { id: "budget", title: "Budget", icon: Banknote }, { id: "savings", title: "Tabungan", icon: Wallet }
  ];
  const filteredCities = cityOptions.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || (c.region || "").toLowerCase().includes(query.toLowerCase()));
  const go = (id) => { setView(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">O</span><span>odyssey<span className="brand-light">travel</span><small>PLAN YOUR NEXT ESCAPE</small></span></div>
      <div className="nav-caption">TRIP WORKSPACE</div>
      <div className="current-trip"><span className="plane-bubble">✈</span><span><strong>{plan.tripName || "My trip"}</strong><small>{plan.country} · {days} hari</small></span><span className="live-dot"/></div>
      <nav className="side-nav">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => go(item.id)}><Icon size={18}/><span>{item.title}</span>{view === item.id && <ChevronRight size={15} className="chevron"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="side-tip"><Sparkles size={17}/><strong>Smart trip planning</strong><p>Destinasi, hotel, rute harian, dan budget dalam satu workspace.</p></div><button className="reset-link" onClick={() => setConfirmReset(true)}><RotateCcw size={15}/> Reset rencana</button><small className="saved-indicator"><span/> Disimpan otomatis di browser</small></div>
    </aside>
    <main className="main-area">
      <header className="top-header"><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{nav.find((n) => n.id === view)?.title}</strong></div><div className="header-actions"><span className="saved-pill"><Check size={13}/> Tersimpan</span><button className="button secondary small" onClick={exportPlan}><Download size={14}/> Export</button><span className="user-avatar">OT</span></div></header>
      {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")} aria-label="Tutup"><X size={15}/></button></div>}
      {view === "overview" && <div className="page-content">
        <section className="hero-panel"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={14}/> YOUR NEXT ADVENTURE STARTS HERE</span><h1>Plan less stress.<br/><span>Travel more.</span></h1><p>Satu tempat untuk menyusun destinasi, penginapan, rute, dan budget yang sesuai dengan gaya liburan lo.</p><div className="hero-actions"><button className="button primary" onClick={() => go("destinations")}>Atur perjalanan <ArrowRight/></button><button className="button ghost" onClick={() => go("itinerary")}>Lihat itinerary</button></div></div><div className="hero-art"><div className="sun"/><div className="peak peak-back"/><div className="peak peak-front"/><div className="curved-path"/><span className="stamp">GO<br/>EXPLORE</span><span className="art-caption">MAKE TIME FOR WONDER</span></div></section>
        <div className="section-title"><div><span className="eyebrow">YOUR TRIP AT A GLANCE</span><h2>Perjalanan dalam satu pandangan</h2></div><button className="text-link" onClick={() => go("budget")}>Lihat budget <ArrowRight size={14}/></button></div>
        <div className="metric-grid"><article className="metric"><span className="metric-icon blue"><CalendarDays/></span><small>Durasi perjalanan</small><strong>{days} <em>hari</em></strong><p>{Math.max(0, days - 1)} malam target</p></article><article className="metric"><span className="metric-icon mint"><MapPinned/></span><small>Kota dipilih</small><strong>{selectedCities.length} <em>kota</em></strong><p>{stay.dayTrips} Day Trip · {stay.count} kota menginap</p></article><article className="metric"><span className="metric-icon violet"><Wallet/></span><small>Estimasi total grup</small><strong>{formatRupiah(totals.total)}</strong><p>{formatRupiah(totals.perPerson)} per orang</p></article><article className="metric"><span className="metric-icon amber"><Banknote/></span><small>Proyeksi tabungan</small><strong>{formatRupiah(futureSavings)}</strong><p>{months} bulan sampai berangkat</p></article></div>
        <div className="overview-columns"><MapPanel cities={selectedCities}/><section className="surface budget-snapshot"><div className="section-heading"><div><span className="eyebrow">BUDGET CHECK</span><h2>Apakah dana cukup?</h2></div><span className={"status-pill " + (totals.perPerson <= cap ? "good" : "warn")}>{totals.perPerson <= cap ? "Dalam batas" : "Melewati batas"}</span></div><div className="snapshot-total"><span>Estimasi per orang</span><strong>{formatRupiah(totals.perPerson)}</strong><small>Target {formatRupiah(cap)} / orang</small></div><div className="progress-track"><span style={{ width: Math.min(100, totals.perPerson / Math.max(1, cap) * 100) + "%" }}/></div><div className="snapshot-list"><div><span>Peserta</span><strong>{people} orang</strong></div><div><span>Penginapan</span><strong>{formatRupiah(totals.hotels)}</strong></div><div><span>Transport itinerary</span><strong>{formatRupiah(totals.route)}</strong></div><div><span>Dana cadangan</span><strong>{formatRupiah(totals.buffer)}</strong></div></div><button className="button secondary full" onClick={() => go("budget")}>Rincian perhitungan <ArrowRight size={14}/></button></section></div>
        <section className="surface next-action"><span className="next-icon"><Compass size={21}/></span><div><h3>Lanjutkan dari kota tujuan</h3><p>Pilih kota, tentukan kota basis untuk Day Trip, lalu atur transportasi harian.</p></div><button className="button primary" onClick={() => go("destinations")}>Pilih kota <ArrowRight size={15}/></button></section>
      </div>}

      {view === "destinations" && <div className="page-content">
        <div className="page-heading"><div><span className="eyebrow">STEP 01 · DESTINATIONS & STAYS</span><h1>Tentukan rute, bukan kewajiban hotel.</h1><p>Pilih beberapa kota. Setiap kota bisa jadi tempat menginap, Day Trip, atau belum diputuskan.</p></div><span className="count-pill">{selectedCities.length} kota dipilih</span></div>
        <section className="surface form-surface"><div className="section-heading"><div><h2>Detail perjalanan</h2><p>Informasi dasar untuk semua perhitungan.</p></div></div><div className="form-grid four">
          <Field label="Nama perjalanan" type="text" value={plan.tripName} onChange={(v) => setTop("tripName", v)}/>
          <label className="field-control"><span>Negara tujuan</span><select value={plan.country} onChange={(e) => changeCountry(e.target.value)}>{COUNTRY_OPTIONS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <Field label="Tanggal berangkat" type="date" value={plan.startDate} onChange={(v) => setTop("startDate", v)}/>
          <Field label="Jumlah peserta" value={plan.participants} min={1} max={50} onChange={(v) => setTop("participants", Math.max(1, v))}/>
          <Field label="Durasi (hari)" value={plan.daysCount} min={1} max={30} onChange={(v) => setTop("daysCount", Math.max(1, Math.min(30, v)))}/>
        </div></section>
        <section className="surface form-surface"><div className="section-heading"><div><span className="eyebrow">PILIH DESTINASI</span><h2>Kota mana yang mau dikunjungi?</h2><p>Daftar kota populer bisa dipilih sekaligus; lokasi custom juga bisa ditambahkan.</p></div></div>
          <label className="search-box"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kota atau wilayah…"/>{query && <button onClick={() => setQuery("")} type="button"><X size={13}/></button>}</label>
          <div className="city-grid">{filteredCities.map((city) => { const picked = plan.selectedCities.includes(city.name); return <button type="button" key={city.name} className={"city-choice " + (picked ? "picked" : "")} onClick={() => toggleCity(city)}><span className="choice-check">{picked ? <Check size={14}/> : <Plus size={14}/>}</span><span><strong>{city.name}</strong><small>{city.region}</small><p>{city.blurb}</p></span></button>; })}</div>
          {!filteredCities.length && <div className="empty-state">Tidak ada kota yang cocok dengan pencarian.</div>}
          <form className="manual-city-form" onSubmit={addManualCity}><div><strong>＋ Tambah kota manual</strong><p>Koordinat opsional untuk marker peta.</p></div><div className="manual-inputs"><input required value={manualCity} onChange={(e) => setManualCity(e.target.value)} placeholder="Nama kota"/><input type="number" step="any" value={manualLat} onChange={(e) => setManualLat(e.target.value)} placeholder="Latitude (opsional)"/><input type="number" step="any" value={manualLng} onChange={(e) => setManualLng(e.target.value)} placeholder="Longitude (opsional)"/><button className="button primary" type="submit"><Plus size={15}/> Tambah</button></div></form>
        </section>
        <section className="surface form-surface"><div className="section-heading"><div><span className="eyebrow">STAY YOUR WAY</span><h2>Penginapan per kota</h2><p>Day Trip tidak menambah malam hotel. Pilih kota basis untuk rute pulang-pergi.</p></div></div>
          {!selectedCities.length ? <div className="empty-state">Pilih minimal satu kota di atas.</div> : <div className="lodging-grid">{selectedCities.map((city) => {
            const cfg = plan.citySettings[city.name] || { mode: "undecided", nights: 0, hotelPerNight: 0, baseCity: "" }, mode = cfg.mode || "undecided";
            const bases = selectedCities.filter((c) => c.name !== city.name && (plan.citySettings[c.name]?.mode === "stay" || mode !== "daytrip"));
            return <article className="lodging-card" key={city.name}><div className="lodging-card-heading"><span className="pin-box"><Hotel size={17}/></span><div><h3>{city.name}</h3><p>{city.region}</p></div><span className={"mode-tag " + mode}>{mode === "stay" ? "MENGINAP" : mode === "daytrip" ? "DAY TRIP" : "BELUM DIPILIH"}</span></div>
              <label className="field-control"><span>Rencana kunjungan</span><select value={mode} onChange={(e) => { const next = e.target.value; const base = selectedCities.find((c) => c.name !== city.name && plan.citySettings[c.name]?.mode === "stay")?.name || selectedCities.find((c) => c.name !== city.name)?.name || ""; setPlan((p) => ({ ...p, citySettings: { ...p.citySettings, [city.name]: { ...(p.citySettings[city.name] || {}), mode: next, nights: next === "stay" ? Math.max(1, Number(p.citySettings[city.name]?.nights) || 1) : 0, hotelPerNight: next === "stay" ? Math.max(1000000, Number(p.citySettings[city.name]?.hotelPerNight) || 0) : 0, baseCity: next === "daytrip" ? base : "" } } })); }}><option value="undecided">Belum ditentukan</option><option value="stay">Menginap di kota ini</option><option value="daytrip">Day Trip / pulang hari yang sama</option></select></label>
              {mode === "stay" && <div className="lodging-fields"><Field label="Jumlah malam" value={cfg.nights} min={0} max={30} onChange={(v) => setSetting(city.name, { nights: Math.max(0, v) })}/><Field label="Hotel / malam / grup (Rp)" value={cfg.hotelPerNight} min={0} step={50000} onChange={(v) => setSetting(city.name, { hotelPerNight: Math.max(0, v) })}/></div>}
              {mode === "daytrip" && <div className="daytrip-panel"><label className="field-control"><span>Kota basis untuk pulang-pergi</span><select value={cfg.baseCity || ""} onChange={(e) => setSetting(city.name, { baseCity: e.target.value })}><option value="">Pilih kota basis…</option>{bases.map((b) => <option value={b.name} key={b.name}>{b.name}</option>)}</select></label><p>↔ Pulang di hari yang sama · hotel kota ini Rp0</p></div>}
              <div className="lodging-cost"><span>{mode === "stay" ? "Biaya hotel teralokasi" : mode === "daytrip" ? "Biaya hotel kota ini" : "Biaya sementara"}</span><strong>{formatRupiah(mode === "stay" ? (Number(cfg.nights) || 0) * (Number(cfg.hotelPerNight) || 0) : 0)}</strong></div>
            </article>;
          })}</div>}
          <div className="stay-total-row"><div><strong>{stay.nights} malam menginap</strong><span>Target {Math.max(0, days - 1)} malam · {stay.dayTrips} Day Trip · {stay.pending} belum ditentukan</span></div><strong>{formatRupiah(totals.hotels)}</strong></div>
          {days - 1 !== stay.nights && <div className="inline-notice"><CircleHelp size={16}/>{days - 1 > stay.nights ? (days - 1 - stay.nights) + " malam belum dialokasikan. Day Trip tidak wajib menginap." : "Malam hotel melebihi durasi perjalanan; periksa alokasinya."}</div>}
          {selectedCities.some((city) => { const c = plan.citySettings[city.name]; return c?.mode === "daytrip" && (!c.baseCity || !selectedCities.some((b) => b.name === c.baseCity && plan.citySettings[b.name]?.mode === "stay")); }) && <div className="inline-notice warning"><CircleHelp size={16}/>Ada Day Trip tanpa kota basis berstatus Menginap. Tentukan kota basis supaya rute pulang-pergi jelas.</div>}
        </section>
        <div className="page-bottom"><span>{selectedCities.length} kota · {stay.dayTrips} Day Trip · {stay.count} kota menginap</span><button className="button primary" onClick={generateDraft}>Buat / perbarui itinerary <ArrowRight size={16}/></button></div>
      </div>}

      {view === "itinerary" && <div className="page-content"><div className="page-heading"><div><span className="eyebrow">STEP 02 · DAY-BY-DAY ROUTE</span><h1>Setiap perpindahan punya detail.</h1><p>Atur titik, moda transportasi, durasi, ongkos, dan cara kembali ke kota basis.</p></div><button className="button secondary" onClick={generateDraft}><RotateCcw size={15}/> Buat ulang dari kota</button></div><ItineraryTimeline days={plan.itinerary || []} setDays={(updater) => setPlan((p) => ({ ...p, itinerary: typeof updater === "function" ? updater(p.itinerary || []) : updater }))} participants={people}/><MapPanel cities={selectedCities}/></div>}

      {view === "budget" && <div className="page-content"><div className="page-heading"><div><span className="eyebrow">STEP 03 · TOTAL COST ESTIMATE</span><h1>Hitung biaya dari semua sisi.</h1><p>Biaya hotel, peserta, hari, tiket, dan ongkos rute diperbarui otomatis.</p></div><span className={"count-pill " + (totals.perPerson <= cap ? "" : "over")}>{totals.perPerson <= cap ? "Dalam batas budget" : "Budget terlampaui"}</span></div>
        <div className="budget-layout"><section className="surface form-surface"><div className="section-heading"><div><h2>Asumsi pengeluaran</h2><p>Semua nominal bisa diedit sesuai rencana.</p></div></div><div className="form-grid two">
          <Field label="Pesawat / orang (Rp)" value={plan.budget.flightPerPerson} min={0} step={100000} onChange={(v) => setBudget("flightPerPerson", v)}/><Field label="Makan / orang / hari (Rp)" value={plan.budget.foodPerPersonPerDay} min={0} step={25000} onChange={(v) => setBudget("foodPerPersonPerDay", v)}/><Field label="Transport lokal / orang / hari (Rp)" value={plan.budget.localTransportPerPersonPerDay} min={0} step={10000} onChange={(v) => setBudget("localTransportPerPersonPerDay", v)}/><Field label="Transport tambahan belum tercatat (grup, Rp)" value={plan.budget.intercityTransportGroup} min={0} step={100000} onChange={(v) => setBudget("intercityTransportGroup", v)} hint="Jangan hitung ulang ongkos yang sudah ada di timeline."/><Field label="Lain-lain / grup (Rp)" value={plan.budget.otherGroup} min={0} step={100000} onChange={(v) => setBudget("otherGroup", v)}/><Field label="Dana cadangan (%)" value={plan.budget.contingencyPercent} min={0} max={100} onChange={(v) => setBudget("contingencyPercent", v)}/><Field label="Batas budget / orang (Rp)" value={cap} min={0} step={500000} onChange={(v) => setBudget("budgetCapPerPerson", v)}/></div></section>
          <aside className="surface total-card"><span className="eyebrow">TOTAL PERKIRAAN GRUP</span><h2>{formatRupiah(totals.total)}</h2><p>{people} orang · {formatRupiah(totals.perPerson)} per orang</p><div className="total-divider"/>{[["Pesawat",totals.flights],["Makan",totals.food],["Transport lokal",totals.local],["Penginapan",totals.hotels],["Segmen rute itinerary",totals.route],["Tiket atraksi",totals.tickets],["Transport tambahan + lain-lain",totals.extras],["Dana cadangan",totals.buffer]].map(([label,value]) => <div key={label} className="cost-row"><span>{label}</span><strong>{formatRupiah(value)}</strong></div>)}<div className="total-status"><span>Budget per orang</span><strong>{totals.perPerson <= cap ? "✓ Dalam batas" : "Perlu disesuaikan"}</strong></div><div className="progress-track"><span style={{ width: Math.min(100, totals.perPerson / Math.max(1, cap) * 100) + "%" }}/></div></aside></div>
      </div>}

      {view === "savings" && <div className="page-content"><div className="page-heading"><div><span className="eyebrow">STEP 04 · SAVINGS GOAL</span><h1>Bikin target liburan terasa nyata.</h1><p>Proyeksi menggunakan tanggal berangkat, saldo saat ini, dan target setoran bulanan.</p></div></div>
        <section className="savings-banner"><div><span className="hero-kicker"><Wallet size={14}/> YOUR TRAVEL FUND</span><h2>Liburan terasa dekat<br/>saat targetnya jelas.</h2><p>Estimasi memakai total biaya grup dari budget dan itinerary.</p></div><div className="savings-target"><span>Target biaya trip</span><strong>{formatRupiah(totals.total)}</strong><small>{formatRupiah(totals.perPerson)} / orang</small></div></section>
        <div className="savings-layout"><section className="surface form-surface"><div className="section-heading"><div><h2>Rencana tabungan</h2><p>Atur saldo yang tersedia dan setoran rutin.</p></div></div><div className="form-grid two"><Field label="Tanggal berangkat" type="date" value={plan.startDate} onChange={(v) => setTop("startDate", v)}/><Field label="Saldo tabungan saat ini (Rp)" value={plan.budget.currentSavings} min={0} step={100000} onChange={(v) => setBudget("currentSavings", v)}/><Field label="Target menabung / bulan (Rp)" value={plan.budget.monthlySavings} min={0} step={100000} onChange={(v) => setBudget("monthlySavings", v)}/><div className="months-box"><CalendarDays size={18}/><div><span>Waktu tersisa</span><strong>{months} bulan</strong></div></div></div></section>
          <section className="surface form-surface savings-result"><span className="eyebrow">PROYEKSI DANA</span><div className="savings-main"><span>Saldo saat berangkat</span><strong>{formatRupiah(futureSavings)}</strong><small>Saldo sekarang + setoran {months} bulan</small></div><div className="progress-caption"><span>Target terkumpul</span><strong>{Math.round(savingsPercent)}%</strong></div><div className="progress-track"><span style={{ width: savingsPercent + "%" }}/></div><div className="snapshot-list"><div><span>Estimasi biaya</span><strong>{formatRupiah(totals.total)}</strong></div><div><span>Kekurangan dari saldo saat ini</span><strong>{formatRupiah(gap)}</strong></div><div><span>Setoran minimum / bulan</span><strong>{formatRupiah(monthlyNeeded)}</strong></div></div><div className={"savings-verdict " + (futureSavings >= totals.total ? "positive" : "negative")}><strong>{futureSavings >= totals.total ? "✓ Dana diproyeksikan cukup" : "Perlu tambah setoran atau kurangi budget"}</strong><p>{futureSavings >= totals.total ? "Dengan asumsi setoran konsisten, target bisa tercapai." : "Ubah setoran, tanggal perjalanan, atau biaya trip untuk mencari skenario realistis."}</p></div></section></div>
      </div>}
      <footer className="app-footer"><span>Odyssey Travel · React trip planner</span><span>Tarif, jadwal, dan rute perlu diverifikasi sebelum perjalanan.</span></footer>
    </main>
    {confirmReset && <div className="modal-backdrop" onClick={() => setConfirmReset(false)}><section className="confirm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><h2>Reset rencana perjalanan?</h2><p>Perubahan di browser ini akan diganti dengan contoh awal Jepang.</p><div className="modal-actions"><button className="button secondary" onClick={() => setConfirmReset(false)}>Batal</button><button className="button primary" onClick={resetPlan}>Reset rencana</button></div></section></div>}
  </div>;
}

export const COUNTRY_OPTIONS = [
  "Jepang", "Korea Selatan", "Thailand", "Singapura", "Malaysia",
  "Indonesia", "Italia", "Prancis", "Swiss", "Australia", "Vietnam", "Amerika Serikat"
];

export const CITY_OPTIONS = {
  "Jepang": [
    { name: "Tokyo", region: "Kanto", lat: 35.6812, lng: 139.7671, blurb: "Kuliner, belanja, budaya pop, dan transportasi umum." },
    { name: "Fuji / Kawaguchiko", region: "Yamanashi", lat: 35.517, lng: 138.75, blurb: "Danau dan pemandangan Gunung Fuji; cocok untuk day trip." },
    { name: "Osaka", region: "Kansai", lat: 34.7025, lng: 135.4959, blurb: "Street food, nightlife, dan base untuk eksplorasi Kansai." },
    { name: "Kyoto", region: "Kansai", lat: 35.0116, lng: 135.7681, blurb: "Kuil, distrik tradisional, dan jalanan bersejarah." },
    { name: "Nara", region: "Kansai", lat: 34.6851, lng: 135.8048, blurb: "Taman rusa dan kuil; mudah dibuat day trip." },
    { name: "Sapporo", region: "Hokkaido", lat: 43.0618, lng: 141.3545, blurb: "Makanan, musim dingin, dan alam Hokkaido." },
    { name: "Fukuoka", region: "Kyushu", lat: 33.5902, lng: 130.4017, blurb: "Ramen, waterfront, dan gerbang menuju Kyushu." },
    { name: "Hiroshima", region: "Chugoku", lat: 34.3853, lng: 132.4553, blurb: "Sejarah, taman memorial, dan akses ke Miyajima." }
  ],
  "Korea Selatan": [
    { name: "Seoul", region: "Seoul", lat: 37.5665, lng: 126.978, blurb: "K-pop, istana, belanja, dan metro." },
    { name: "Busan", region: "Busan", lat: 35.1796, lng: 129.0756, blurb: "Pantai, pasar seafood, dan pemandangan pesisir." },
    { name: "Jeju", region: "Jeju", lat: 33.4996, lng: 126.5312, blurb: "Pulau dengan jalur alam, pantai, dan lanskap vulkanik." },
    { name: "Gyeongju", region: "Gyeongsang", lat: 35.8562, lng: 129.2247, blurb: "Warisan sejarah kerajaan Silla." },
    { name: "Incheon", region: "Incheon", lat: 37.4563, lng: 126.7052, blurb: "Waterfront dan akses bandara." }
  ],
  "Thailand": [
    { name: "Bangkok", region: "Thailand Tengah", lat: 13.7563, lng: 100.5018, blurb: "Kuil, pasar, kuliner, dan transportasi kota." },
    { name: "Chiang Mai", region: "Thailand Utara", lat: 18.7883, lng: 98.9853, blurb: "Kota tua, kafe, dan wisata alam." },
    { name: "Phuket", region: "Thailand Selatan", lat: 7.8804, lng: 98.3923, blurb: "Pantai dan akses wisata pulau." },
    { name: "Krabi", region: "Thailand Selatan", lat: 8.0863, lng: 98.9063, blurb: "Karst, pantai, dan perjalanan perahu." },
    { name: "Ayutthaya", region: "Thailand Tengah", lat: 14.3532, lng: 100.5689, blurb: "Kuil dan reruntuhan kota bersejarah." }
  ],
  "Singapura": [
    { name: "Singapore", region: "Singapore", lat: 1.3521, lng: 103.8198, blurb: "Kota kompak, hawker food, taman, dan transportasi praktis." }
  ],
  "Malaysia": [
    { name: "Kuala Lumpur", region: "Kuala Lumpur", lat: 3.139, lng: 101.6869, blurb: "Landmark kota, belanja, dan kuliner." },
    { name: "Penang / George Town", region: "Penang", lat: 5.4141, lng: 100.3288, blurb: "Street food dan warisan budaya." },
    { name: "Langkawi", region: "Kedah", lat: 6.35, lng: 99.8, blurb: "Pantai, alam, dan island hopping." },
    { name: "Malacca", region: "Melaka", lat: 2.1896, lng: 102.2501, blurb: "Kota tua dan sejarah perdagangan." }
  ],
  "Indonesia": [
    { name: "Jakarta", region: "Jawa", lat: -6.2088, lng: 106.8456, blurb: "Museum, kuliner, dan pusat kota." },
    { name: "Bandung", region: "Jawa Barat", lat: -6.9175, lng: 107.6191, blurb: "Kafe, belanja, dan dataran tinggi." },
    { name: "Yogyakarta", region: "DI Yogyakarta", lat: -7.7956, lng: 110.3695, blurb: "Budaya, kuliner, dan akses candi." },
    { name: "Bali / Denpasar", region: "Bali", lat: -8.65, lng: 115.2167, blurb: "Pantai, budaya, dan wisata alam." },
    { name: "Labuan Bajo", region: "Nusa Tenggara Timur", lat: -8.4964, lng: 119.8877, blurb: "Gerbang menuju Taman Nasional Komodo." }
  ],
  "Italia": [
    { name: "Rome", region: "Lazio", lat: 41.9028, lng: 12.4964, blurb: "Arsitektur kuno, museum, dan kuliner." },
    { name: "Florence", region: "Tuscany", lat: 43.7696, lng: 11.2558, blurb: "Seni, arsitektur, dan pusat kota walkable." },
    { name: "Venice", region: "Veneto", lat: 45.4408, lng: 12.3155, blurb: "Kanal, pulau, dan kota bersejarah." },
    { name: "Milan", region: "Lombardy", lat: 45.4642, lng: 9.19, blurb: "Desain, fashion, dan koneksi kereta." },
    { name: "Naples", region: "Campania", lat: 40.8518, lng: 14.2681, blurb: "Kuliner dan akses situs arkeologi." }
  ],
  "Prancis": [
    { name: "Paris", region: "Île-de-France", lat: 48.8566, lng: 2.3522, blurb: "Museum, landmark, dan jaringan metro." },
    { name: "Lyon", region: "Auvergne-Rhône-Alpes", lat: 45.764, lng: 4.8357, blurb: "Kuliner dan kota tua." },
    { name: "Nice", region: "French Riviera", lat: 43.7102, lng: 7.262, blurb: "Pantai Mediterania dan akses pesisir." },
    { name: "Marseille", region: "Provence", lat: 43.2965, lng: 5.3698, blurb: "Pelabuhan, kuliner, dan pesisir." }
  ],
  "Swiss": [
    { name: "Zurich", region: "Zurich", lat: 47.3769, lng: 8.5417, blurb: "Kota tepi danau dan hub kereta." },
    { name: "Lucerne", region: "Central Switzerland", lat: 47.0502, lng: 8.3093, blurb: "Danau, jembatan bersejarah, dan pegunungan." },
    { name: "Interlaken", region: "Bernese Oberland", lat: 46.6863, lng: 7.8632, blurb: "Base untuk perjalanan alam dan pegunungan." },
    { name: "Zermatt", region: "Valais", lat: 46.0207, lng: 7.7491, blurb: "Desa pegunungan dan panorama Matterhorn." }
  ],
  "Australia": [
    { name: "Sydney", region: "New South Wales", lat: -33.8688, lng: 151.2093, blurb: "Harbour, pantai, dan landmark kota." },
    { name: "Melbourne", region: "Victoria", lat: -37.8136, lng: 144.9631, blurb: "Kafe, seni, dan event." },
    { name: "Brisbane", region: "Queensland", lat: -27.4698, lng: 153.0251, blurb: "Sungai, taman, dan akses Queensland." },
    { name: "Cairns", region: "Queensland", lat: -16.9186, lng: 145.7781, blurb: "Pintu masuk menuju Great Barrier Reef." }
  ],
  "Vietnam": [
    { name: "Hanoi", region: "Vietnam Utara", lat: 21.0278, lng: 105.8342, blurb: "Kota tua, sejarah, dan street food." },
    { name: "Da Nang", region: "Vietnam Tengah", lat: 16.0544, lng: 108.2022, blurb: "Pantai dan akses ke Hoi An." },
    { name: "Ho Chi Minh City", region: "Vietnam Selatan", lat: 10.8231, lng: 106.6297, blurb: "Kuliner, museum, dan kota metropolitan." },
    { name: "Hoi An", region: "Quang Nam", lat: 15.8801, lng: 108.338, blurb: "Kota tua dan lentera." }
  ],
  "Amerika Serikat": [
    { name: "New York", region: "New York", lat: 40.7128, lng: -74.006, blurb: "Museum, pertunjukan, dan landmark kota." },
    { name: "Los Angeles", region: "California", lat: 34.0522, lng: -118.2437, blurb: "Hiburan, pantai, dan area kota yang tersebar." },
    { name: "San Francisco", region: "California", lat: 37.7749, lng: -122.4194, blurb: "Waterfront, taman, dan transportasi kota." },
    { name: "Las Vegas", region: "Nevada", lat: 36.1699, lng: -115.1398, blurb: "Resort, hiburan, dan akses jalan darat." }
  ]
};

export const DEFAULT_PLAN = {
  country: "Jepang",
  tripName: "Japan Escape",
  startDate: "2027-04-12",
  participants: 4,
  daysCount: 9,
  selectedCities: ["Tokyo", "Fuji / Kawaguchiko", "Osaka", "Kyoto", "Nara"],
  citySettings: {
    "Tokyo": { mode: "stay", nights: 4, baseCity: "", hotelPerNight: 1200000 },
    "Fuji / Kawaguchiko": { mode: "daytrip", nights: 0, baseCity: "Tokyo", hotelPerNight: 0 },
    "Osaka": { mode: "stay", nights: 4, baseCity: "", hotelPerNight: 1100000 },
    "Kyoto": { mode: "daytrip", nights: 0, baseCity: "Osaka", hotelPerNight: 0 },
    "Nara": { mode: "daytrip", nights: 0, baseCity: "Osaka", hotelPerNight: 0 }
  },
  budget: {
    flightPerPerson: 6500000, foodPerPersonPerDay: 450000,
    localTransportPerPersonPerDay: 220000, intercityTransportGroup: 3500000,
    otherGroup: 1500000, contingencyPercent: 10,
    currentSavings: 7000000, monthlySavings: 1500000
  },
  itinerary: [
    { id: "day-1", title: "Tiba & check-in", city: "Tokyo", dayTrip: false, base: "Tokyo", points: [
      { id: "p-101", name: "Narita International Airport (NRT)", city: "Tokyo", type: "airport", time: "09:00", ticketPerPerson: 0, notes: "Sesuaikan terminal dan waktu kedatangan.", routeToNext: { mode: "Kereta bandara", from: "Narita Airport Terminal", to: "Tokyo / Shinjuku Station", durationMin: 75, costGroup: 13000, guidance: "Cek layanan yang cocok dengan jam kedatangan." } },
      { id: "p-102", name: "Hotel di Tokyo", city: "Tokyo", type: "hotel", time: "12:00", ticketPerPerson: 0, notes: "Drop bagasi atau check-in sesuai ketentuan hotel.", routeToNext: { mode: "Subway / MRT", from: "Stasiun terdekat hotel", to: "Asakusa Station", durationMin: 30, costGroup: 2400, guidance: "Cek pintu keluar stasiun yang paling dekat." } },
      { id: "p-103", name: "Asakusa & Senso-ji", city: "Tokyo", type: "destination", time: "14:00", ticketPerPerson: 0, notes: "Aktivitas santai untuk hari kedatangan." }
    ] },
    { id: "day-2", title: "Eksplor Tokyo", city: "Tokyo", dayTrip: false, base: "Tokyo", points: [
      { id: "p-201", name: "Shinjuku Station (East Exit)", city: "Tokyo", type: "station", time: "09:00", ticketPerPerson: 0, notes: "Titik mulai hari.", routeToNext: { mode: "Subway / MRT", from: "Shinjuku Station", to: "Shibuya Station", durationMin: 10, costGroup: 2000, guidance: "Pilih rute transit sesuai stasiun asal." } },
      { id: "p-202", name: "Shibuya Scramble Crossing", city: "Tokyo", type: "destination", time: "10:00", ticketPerPerson: 0, notes: "Area belanja dan landmark kota.", routeToNext: { mode: "Kereta lokal", from: "Shibuya Station", to: "Ueno Station", durationMin: 30, costGroup: 2400, guidance: "Cek jalur langsung dan arah kereta." } },
      { id: "p-203", name: "Ueno Park", city: "Tokyo", type: "destination", time: "13:00", ticketPerPerson: 0, notes: "Sisakan waktu santai dan makan.", routeToNext: { mode: "Subway / MRT", from: "Ueno Station", to: "Hotel di Tokyo", durationMin: 25, costGroup: 2000, guidance: "Kembali ke area penginapan sebelum malam." } },
      { id: "p-204", name: "Kembali ke hotel Tokyo", city: "Tokyo", type: "hotel", time: "18:00", ticketPerPerson: 0, notes: "Istirahat dan persiapan hari berikutnya." }
    ] },
    { id: "day-3", title: "Tokyo & hiburan", city: "Tokyo", dayTrip: false, base: "Tokyo", points: [
      { id: "p-301", name: "Tokyo Station", city: "Tokyo", type: "station", time: "08:30", ticketPerPerson: 0, notes: "Berangkat lebih awal.", routeToNext: { mode: "Kereta lokal", from: "Tokyo Station", to: "Maihama Station", durationMin: 20, costGroup: 2200, guidance: "Cek layanan JR yang berhenti di Maihama." } },
      { id: "p-302", name: "Tokyo DisneySea", city: "Tokyo", type: "destination", time: "10:00", ticketPerPerson: 1100000, notes: "Harga tiket contoh; cek tarif resmi sesuai tanggal.", routeToNext: { mode: "Kereta lokal", from: "Maihama Station", to: "Hotel di Tokyo", durationMin: 30, costGroup: 2200, guidance: "Waktu pulang bergantung jam tutup dan antrean." } },
      { id: "p-303", name: "Hotel di Tokyo", city: "Tokyo", type: "hotel", time: "19:00", ticketPerPerson: 0, notes: "Kembali dan istirahat." }
    ] },
    { id: "day-4", title: "Day trip ke Fuji", city: "Fuji / Kawaguchiko", dayTrip: true, base: "Tokyo", points: [
      { id: "p-401", name: "Hotel di Tokyo", city: "Tokyo", type: "hotel", time: "07:00", ticketPerPerson: 0, notes: "Mulai day trip; tidak menginap di Fuji.", routeToNext: { mode: "Bus antarkota", from: "Shinjuku Expressway Bus Terminal", to: "Kawaguchiko Station", durationMin: 110, costGroup: 16000, guidance: "Cek jadwal dan tarif operator sesuai tanggal." } },
      { id: "p-402", name: "Kawaguchiko Station", city: "Fuji / Kawaguchiko", type: "station", time: "09:00", ticketPerPerson: 0, notes: "Mulai eksplor sekitar Danau Kawaguchi.", routeToNext: { mode: "Bus lokal", from: "Kawaguchiko Station", to: "Lake Kawaguchi", durationMin: 20, costGroup: 3000, guidance: "Pilih halte terdekat dengan area danau yang dituju." } },
      { id: "p-403", name: "Lake Kawaguchi", city: "Fuji / Kawaguchiko", type: "destination", time: "10:00", ticketPerPerson: 0, notes: "Visibilitas Gunung Fuji bergantung cuaca.", routeToNext: { mode: "Bus antarkota", from: "Kawaguchiko Station", to: "Shinjuku Expressway Bus Terminal", durationMin: 120, costGroup: 16000, guidance: "Pulang ke Tokyo pada hari yang sama; cek bus terakhir." } },
      { id: "p-404", name: "Kembali ke Tokyo", city: "Tokyo", type: "hotel", time: "18:00", ticketPerPerson: 0, notes: "Day trip selesai, tidak perlu booking hotel Fuji." }
    ] },
    { id: "day-5", title: "Tokyo → Osaka", city: "Osaka", dayTrip: false, base: "Osaka", points: [
      { id: "p-501", name: "Tokyo Station", city: "Tokyo", type: "station", time: "08:30", ticketPerPerson: 0, notes: "Berangkat dengan waktu cadangan.", routeToNext: { mode: "Shinkansen", from: "Tokyo Station", to: "Shin-Osaka Station", durationMin: 150, costGroup: 60000, guidance: "Verifikasi layanan, kursi, dan harga di operator resmi." } },
      { id: "p-502", name: "Shin-Osaka Station", city: "Osaka", type: "station", time: "11:30", ticketPerPerson: 0, notes: "Ikuti penunjuk subway/JR ke area hotel.", routeToNext: { mode: "Subway / MRT", from: "Shin-Osaka Station", to: "Hotel di Osaka / Namba", durationMin: 25, costGroup: 3000, guidance: "Rute akhir bergantung lokasi hotel." } },
      { id: "p-503", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "13:00", ticketPerPerson: 0, notes: "Drop bagasi dan check-in sesuai waktu hotel." }
    ] },
    { id: "day-6", title: "Osaka city day", city: "Osaka", dayTrip: false, base: "Osaka", points: [
      { id: "p-601", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "09:00", ticketPerPerson: 0, notes: "Mulai hari dari penginapan.", routeToNext: { mode: "Subway / MRT", from: "Namba Station", to: "Osaka Castle Park", durationMin: 25, costGroup: 3000, guidance: "Cek gerbang dan stasiun terdekat." } },
      { id: "p-602", name: "Osaka Castle Park", city: "Osaka", type: "destination", time: "10:00", ticketPerPerson: 800, notes: "Harga tiket merupakan estimasi/placeholder.", routeToNext: { mode: "Subway / MRT", from: "Tanimachi 4-chome Station", to: "Namba Station", durationMin: 20, costGroup: 3000, guidance: "Cek navigasi transit aktual." } },
      { id: "p-603", name: "Dotonbori", city: "Osaka", type: "destination", time: "15:00", ticketPerPerson: 0, notes: "Kuliner dan jalan-jalan malam.", routeToNext: { mode: "Jalan kaki", from: "Dotonbori", to: "Hotel di Osaka", durationMin: 15, costGroup: 0, guidance: "Sesuaikan dengan area hotel." } },
      { id: "p-604", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "20:00", ticketPerPerson: 0, notes: "Istirahat." }
    ] },
    { id: "day-7", title: "Day trip ke Kyoto", city: "Kyoto", dayTrip: true, base: "Osaka", points: [
      { id: "p-701", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "08:00", ticketPerPerson: 0, notes: "Berangkat dan kembali pada hari yang sama.", routeToNext: { mode: "Kereta lokal", from: "Osaka / Osaka-Umeda Station", to: "Kyoto Station", durationMin: 35, costGroup: 5000, guidance: "Pilih layanan sesuai lokasi hotel." } },
      { id: "p-702", name: "Kyoto Station", city: "Kyoto", type: "station", time: "09:00", ticketPerPerson: 0, notes: "Titik transfer lokal.", routeToNext: { mode: "Kereta lokal", from: "Kyoto Station", to: "Inari Station", durationMin: 10, costGroup: 2000, guidance: "Verifikasi akses stasiun dan shrine." } },
      { id: "p-703", name: "Fushimi Inari Taisha", city: "Kyoto", type: "destination", time: "10:00", ticketPerPerson: 0, notes: "Sisakan waktu untuk berjalan menanjak.", routeToNext: { mode: "Kereta lokal", from: "Inari Station", to: "Osaka Station", durationMin: 50, costGroup: 5000, guidance: "Perjalanan pulang ke Osaka pada hari yang sama." } },
      { id: "p-704", name: "Kembali ke hotel Osaka", city: "Osaka", type: "hotel", time: "18:00", ticketPerPerson: 0, notes: "Tidak perlu menginap di Kyoto untuk day trip ini." }
    ] },
    { id: "day-8", title: "Day trip ke Nara", city: "Nara", dayTrip: true, base: "Osaka", points: [
      { id: "p-801", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "08:00", ticketPerPerson: 0, notes: "Pilih day trip Nara atau tetap di Osaka.", routeToNext: { mode: "Kereta lokal", from: "Osaka-Namba Station", to: "Kintetsu-Nara Station", durationMin: 45, costGroup: 5000, guidance: "Cek operator dan stasiun yang praktis dari hotel." } },
      { id: "p-802", name: "Nara Park", city: "Nara", type: "destination", time: "10:00", ticketPerPerson: 0, notes: "Ikuti panduan lokal untuk berinteraksi dengan rusa.", routeToNext: { mode: "Kereta lokal", from: "Kintetsu-Nara Station", to: "Osaka-Namba Station", durationMin: 45, costGroup: 5000, guidance: "Kembali ke Osaka hari ini; cek kereta terakhir." } },
      { id: "p-803", name: "Kembali ke hotel Osaka", city: "Osaka", type: "hotel", time: "18:00", ticketPerPerson: 0, notes: "Day trip selesai." }
    ] },
    { id: "day-9", title: "Pulang dari Jepang", city: "Osaka", dayTrip: false, base: "Osaka", points: [
      { id: "p-901", name: "Hotel di Osaka", city: "Osaka", type: "hotel", time: "08:00", ticketPerPerson: 0, notes: "Check-out dan ambil seluruh bagasi.", routeToNext: { mode: "Kereta bandara", from: "Namba / airport-access station", to: "Kansai International Airport (KIX)", durationMin: 45, costGroup: 6000, guidance: "Pilih layanan sesuai lokasi hotel dan jadwal pesawat." } },
      { id: "p-902", name: "Kansai International Airport (KIX)", city: "Osaka", type: "airport", time: "10:00", ticketPerPerson: 0, notes: "Sisakan buffer untuk check-in internasional." }
    ] }
  ]
};

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Number(value) || 0).replace(/\u00a0/g, " ");
}
export function makeId(prefix = "item") {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

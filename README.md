# Yanti Store

> **⚠️ Status: Beta** — Aplikasi ini masih dalam tahap pengembangan aktif. Beberapa fitur masih belum tersedia (lihat roadmap di bawah).

Yanti Store adalah aplikasi toko online fashion muslim dan kosmetik untuk menunjang kebutuhan belanja online masyarakat desa Sidorejo Lampung Timur.

---

## ✨ Fitur yang Sudah Ada

### Frontend
- 🏠 **Homepage** — Featured section Fashion & Kosmetik
- 👗 **Halaman Shop** — Tab Fashion / Kosmetik / Semua dengan filter & sort
- 🔍 **Filter & Sort** — Filter kategori, brand, dan urutkan harga/nama
- 🛍️ **Keranjang Belanja** — Tambah, kurangi, pilih & hapus item
- ❤️ **Wishlist** — Simpan produk favorit (tersimpan di localStorage)
- 📦 **Detail Produk** — Stok, pilih warna & ukuran
- 📲 **Order via WhatsApp** — Pesan langsung dikirim ke WA pemilik toko
- 📱 **Mobile Friendly** — Bottom navigation, bottom sheet modals
- 🔔 **Toast Notification** — Feedback aksi pengguna
- ⬆️ **Back to Top** — Tombol kembali ke atas

### Backend (Go)
- `GET  /api/v1/products` — Ambil semua produk
- `GET  /api/v1/products/:id` — Ambil produk by ID
- `POST /api/v1/orders` — Simpan pesanan
- `GET  /api/v1/orders/:id` — Ambil pesanan by ID

---

## ⚠️ Keterbatasan Beta

Fitur-fitur berikut **belum tersedia** dan sedang dalam roadmap pengembangan:

| Fitur | Status |
|---|---|
| 🗄️ Database (PostgreSQL/MySQL) | ❌ Belum — data masih in-memory (hilang saat server restart) |
| 👤 Admin Panel | ❌ Belum — tambah/edit/hapus produk harus lewat kode |
| 📊 Statistik & Dashboard | ❌ Belum |
| 🔐 Autentikasi Admin | ❌ Belum |
| 🖼️ Upload Foto Produk | ❌ Belum — masih pakai emoji |
| 💳 Payment Gateway | ❌ Belum — order via WhatsApp saja |
| 📦 Manajemen Stok | ❌ Belum — stok hardcoded |
| 🔔 Notifikasi Order | ❌ Belum |
| 📍 Tracking Pengiriman | ❌ Belum |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, Tailwind CSS (CDN), Vanilla JavaScript ES6+ |
| Backend | Go (Golang) |
| Arsitektur | Layered Architecture (Config → Models → Repository → Service → UI) |
| Database | In-memory (sementara) |
| Order | WhatsApp API (deep-link) |

---

## 📁 Struktur Project

```
yanti-store/
├── backend/                          ← Go REST API
│   ├── cmd/server/main.go            ← Entry point
│   ├── internal/
│   │   ├── config/config.go          ← Konfigurasi app
│   │   ├── domain/product.go         ← Struct domain (Product, Order)
│   │   ├── handler/                  ← HTTP handlers
│   │   │   ├── product_handler.go
│   │   │   ├── order_handler.go
│   │   │   └── response.go
│   │   ├── repository/               ← Data access layer
│   │   │   ├── product_repo.go       ← In-memory product store
│   │   │   └── order_repo.go         ← In-memory order store
│   │   └── service/                  ← Business logic
│   │       ├── product_service.go
│   │       └── order_service.go
│   └── go.mod
│
└── frontend/                         ← Vanilla JS SPA
    ├── index.html                    ← Homepage
    ├── shop.html                     ← Halaman semua produk
    ├── assets/css/style.css          ← Global stylesheet
    └── src/
        ├── config/app.config.js      ← Konfigurasi (API URL, WA number)
        ├── constants/app.constants.js← Enum kategori, brand, ukuran
        ├── models/models.js          ← Factory functions domain
        ├── repositories/             ← Data access (mock / API)
        ├── services/                 ← Business logic
        │   ├── product.service.js
        │   ├── cart.service.js
        │   ├── order.service.js
        │   ├── wishlist.service.js
        │   └── confirm.service.js
        ├── utils/ui.utils.js         ← Helper DOM & formatter
        ├── ui/
        │   ├── components/           ← Pure HTML template builders
        │   └── views/                ← View logic per region
        ├── app.js                    ← Entry point homepage
        └── shop.js                   ← Entry point shop page
```

---

## 🗺️ Roadmap

### v0.2 — Database Integration
- [ ] Koneksi PostgreSQL dengan `pgx`
- [ ] Migration schema produk & order
- [ ] Repository layer untuk DB

### v0.3 — Admin Panel
- [ ] Halaman admin (tambah/edit/hapus produk)
- [ ] Upload foto produk
- [ ] JWT Authentication untuk admin

### v0.4 — Enhanced Features
- [ ] Dashboard statistik penjualan
- [ ] Manajemen stok real-time
- [ ] Notifikasi order (email/WA Business API)
- [ ] Filter harga (range slider)

### v0.5 — Production Ready
- [ ] Payment Gateway (Midtrans / QRIS)
- [ ] Tracking pengiriman
- [ ] PWA (Progressive Web App)
- [ ] SEO optimization

---

## 🤝 Kontribusi

Project ini masih beta. Jika menemukan bug atau punya saran fitur, silakan buat [Issue](https://github.com/Satrioz/yanti-store/issues) atau [Pull Request](https://github.com/Satrioz/yanti-store/pulls).

---

---

*Dibuat dengan ❤️ untuk Yanti Store, Lampung*

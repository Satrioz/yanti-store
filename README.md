# 🕌 Yanti Store

> **⚠️ Status: Beta** — Aplikasi ini masih dalam tahap pengembangan aktif. Beberapa fitur belum tersedia (lihat roadmap di bawah).

Yanti Store adalah aplikasi toko online fashion muslim dan kosmetik halal milik **Yanti Store, Lampung**. Menampilkan koleksi **Rabbani**, **Nibras**, dan **Wardah** dengan sistem pemesanan langsung via WhatsApp.

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

## 🚀 Cara Menjalankan

### Prerequisites
- [Go](https://golang.org/dl/) versi 1.21+
- Browser modern
- Ekstensi [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code)

### 1. Clone repository

```bash
git clone https://github.com/Satrioz/yanti-store.git
cd yanti-store
```

### 2. Jalankan Backend

```bash
cd backend
go run cmd/server/main.go
```

Server berjalan di `http://localhost:8080`

### 3. Jalankan Frontend

Buka VS Code → klik kanan `frontend/index.html` → **Open with Live Server**

Frontend berjalan di `http://127.0.0.1:5500`

### 4. Verifikasi

Buka browser dan akses `http://127.0.0.1:5500` — produk fashion dan kosmetik harus tampil.

---

## ⚙️ Konfigurasi

### Ganti Nomor WhatsApp Toko
Buka `frontend/src/config/app.config.js`:
```js
const AppConfig = Object.freeze({
  STORE_WA: '6281234567890',  // ← ganti dengan nomor WA aktif
  // ...
});
```

### Switch Mock Data ↔ Go Backend
```js
const AppConfig = Object.freeze({
  USE_MOCK_DATA: false,  // true = pakai mock, false = pakai Go API
  API_BASE_URL:  'http://localhost:8080/api/v1',
  // ...
});
```

### Tambah Produk Baru
Buka `backend/internal/repository/product_repo.go` dan tambahkan di `seedProducts()`:
```go
{
  ID: 33, Type: "fashion", Category: "wanita", Brand: "rabbani",
  Price: 150000, Stock: 10, Emoji: "👗", Badge: "Baru",
  Name: "Nama Produk Baru", Desc: "Deskripsi produk...",
},
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

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

*Dibuat dengan ❤️ untuk Yanti Store, Lampung*

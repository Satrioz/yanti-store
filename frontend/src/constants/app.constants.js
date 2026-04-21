// ── Kategori & Brand (semua produk) ──────────────────────────────────────────

const CATEGORIES = Object.freeze([
  { id: "semua", label: "🌟 Semua" },
  { id: "wanita", label: "🧕 Wanita" },
  { id: "pria", label: "👘 Pria" },
  { id: "anak", label: "👦 Anak-anak" },
  { id: "promo", label: "🔥 Promo" },
]);

const BRANDS = Object.freeze([
  { id: "semua", label: "🌟 Semua Brand", color: null },
  { id: "rabbani", label: "Rabbani", color: "#1a5276" },
  { id: "nibras", label: "Nibras", color: "#6c3483" },
  { id: "wardah", label: "Wardah", color: "#1a7a4a" },
  { id: "lainnya", label: "Lainnya", color: "#7a5c7e" },
]);

// ── Kategori per tipe ─────────────────────────────────────────────────────────

const FASHION_CATEGORIES = Object.freeze([
  { id: "semua", label: "🌟 Semua" },
  { id: "wanita", label: "🧕 Wanita" },
  { id: "pria", label: "👘 Pria" },
  { id: "anak", label: "👦 Anak-anak" },
  { id: "promo", label: "🔥 Promo" },
]);

const BEAUTY_CATEGORIES = Object.freeze([
  { id: "semua", label: "🌟 Semua" },
  { id: "makeup", label: "💄 Makeup" },
  { id: "skincare", label: "🧴 Skincare" },
  { id: "perawatan", label: "✨ Perawatan" },
  { id: "promo", label: "🔥 Promo" },
]);

// ── Brand per tipe ────────────────────────────────────────────────────────────

const FASHION_BRANDS = Object.freeze([
  { id: "semua", label: "🌟 Semua Brand", color: null },
  { id: "rabbani", label: "Rabbani", color: "#1a5276" },
  { id: "nibras", label: "Nibras", color: "#6c3483" },
  { id: "lainnya", label: "Lainnya", color: "#7a5c7e" },
]);

const BEAUTY_BRANDS = Object.freeze([
  { id: "semua", label: "🌟 Semua Brand", color: null },
  { id: "wardah", label: "Wardah", color: "#1a7a4a" },
  { id: "lainnya", label: "Lainnya", color: "#7a5c7e" },
]);

// ── Sort ──────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = Object.freeze([
  { id: "default", label: "Urutan Default" },
  { id: "price-asc", label: "Harga: Rendah → Tinggi" },
  { id: "price-desc", label: "Harga: Tinggi → Rendah" },
  { id: "name-asc", label: "Nama: A → Z" },
  { id: "name-desc", label: "Nama: Z → A" },
]);

// ── Varian produk ─────────────────────────────────────────────────────────────

const COLOR_OPTIONS = Object.freeze([
  "Hitam",
  "Putih",
  "Navy",
  "Abu-abu",
  "Coklat",
  "Hijau Sage",
  "Dusty Pink",
  "Maroon",
  "Biru Muda",
  "Cream",
]);

const BEAUTY_COLOR_OPTIONS = Object.freeze([
  "Natural",
  "Nude",
  "Pink",
  "Coral",
  "Red",
  "Berry",
  "Peach",
  "Brown",
  "Rose Gold",
  "Mauve",
]);

const SIZE_OPTIONS = Object.freeze({
  clothing: ["S", "M", "L", "XL", "XXL", "XXXL"],
  children: ["2-3 Th", "4-5 Th", "6-7 Th", "8-9 Th", "10-11 Th", "12-13 Th"],
  headwear: ["Free Size"],
  sarong: ["120x220", "130x230", "140x240"],
});

const HEADWEAR_EMOJIS = Object.freeze(["🎩", "🧣"]);
const SARONG_EMOJIS = Object.freeze(["🧦"]);

// ── Default filter state ──────────────────────────────────────────────────────

const DEFAULT_FILTER = Object.freeze({
  category: "semua",
  brand: "semua",
  type: "semua",
  sort: "default",
  query: "",
});

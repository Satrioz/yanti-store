package repository

import (
	"fmt"
    "github.com/Satrioz/yanti-store/internal/domain"
)

type ProductRepository interface {
	FindAll() ([]domain.Product, error)
	FindByID(id int) (*domain.Product, error)
}

type inMemoryProductRepo struct {
	products []domain.Product
}

func NewProductRepository() ProductRepository {
	return &inMemoryProductRepo{products: seedProducts()}
}

func (r *inMemoryProductRepo) FindAll() ([]domain.Product, error) {
	return r.products, nil
}

func (r *inMemoryProductRepo) FindByID(id int) (*domain.Product, error) {
	for _, p := range r.products {
		if p.ID == id {
			return &p, nil
		}
	}
	return nil, fmt.Errorf("product with id %d not found", id)
}

func seedProducts() []domain.Product {
	return []domain.Product{
		// ── FASHION · RABBANI ────────────────────────────────────────────
		{ID: 1,  Type: "fashion", Category: "wanita", Brand: "rabbani", Price: 285000, Stock: 15, Emoji: "👗", Badge: "Terlaris", Name: "Gamis Rabbani Syar'i Premium",    Desc: "Koleksi signature Rabbani, bahan jersey premium anti-kusut. Tersedia warna cerah dan netral."},
		{ID: 2,  Type: "fashion", Category: "wanita", Brand: "rabbani", Price: 89000,  Stock: 32, Emoji: "🧣", Badge: "Baru",     Name: "Hijab Rabbani Instant Bergo",     Desc: "Bergo instan praktis, bahan kaos lembut nyaman seharian. Tidak geser, tidak licin."},
		{ID: 3,  Type: "fashion", Category: "pria",   Brand: "rabbani", Price: 215000, Stock: 8,  Emoji: "👔", Badge: "Terlaris", Name: "Koko Rabbani Executive",          Desc: "Koko eksklusif bordir halus di bagian dada dan manset. Tampil rapi & elegan."},
		{ID: 4,  Type: "fashion", Category: "anak",   Brand: "rabbani", Price: 165000, Stock: 20, Emoji: "🧒", Badge: "Baru",     Name: "Setelan Rabbani Anak Laki",       Desc: "Setelan koko + celana anak premium. Bahan katun halus ramah kulit anak."},
		{ID: 5,  Type: "fashion", Category: "wanita", Brand: "rabbani", Price: 195000, Stock: 5,  Emoji: "👚", Badge: "Promo",    Name: "Tunik Rabbani Casual",            Desc: "Diskon 25%! Tunik kasual bahan spandek premium. Potongan A-line nyaman."},
		{ID: 6,  Type: "fashion", Category: "wanita", Brand: "rabbani", Price: 320000, Stock: 12, Emoji: "🕌", Badge: "",         Name: "Mukena Rabbani Set Eksklusif",    Desc: "Mukena premium + tas cantik. Motif bordir mewah di bagian kerudung."},
		{ID: 7,  Type: "fashion", Category: "pria",   Brand: "rabbani", Price: 175000, Stock: 18, Emoji: "👖", Badge: "",         Name: "Celana Rabbani Chino Muslim",     Desc: "Chino kasual pria muslim, bahan katun twill adem & nyaman."},
		{ID: 8,  Type: "fashion", Category: "anak",   Brand: "rabbani", Price: 185000, Stock: 3,  Emoji: "👧", Badge: "Promo",    Name: "Gamis Anak Rabbani Bordir",       Desc: "Diskon 20%! Gamis anak motif bordir bunga cantik."},
		// ── FASHION · NIBRAS ─────────────────────────────────────────────
		{ID: 9,  Type: "fashion", Category: "wanita", Brand: "nibras",  Price: 265000, Stock: 10, Emoji: "🌸", Badge: "Terlaris", Name: "Gamis Nibras Syar'i Fesyen",     Desc: "Desain modern syar'i khas Nibras. Bahan wolfis halus anti-kusut dan adem."},
		{ID: 10, Type: "fashion", Category: "wanita", Brand: "nibras",  Price: 95000,  Stock: 45, Emoji: "🧣", Badge: "Baru",     Name: "Hijab Nibras Segi Empat Motif",  Desc: "Motif eksklusif koleksi terbaru Nibras. Bahan voal premium yang jatuh indah."},
		{ID: 11, Type: "fashion", Category: "pria",   Brand: "nibras",  Price: 235000, Stock: 7,  Emoji: "🥻", Badge: "",         Name: "Koko Nibras Premium Bordir",     Desc: "Bordir detail halus pada bagian dada dan lengan. Material katun premium."},
		{ID: 12, Type: "fashion", Category: "anak",   Brand: "nibras",  Price: 155000, Stock: 22, Emoji: "✨", Badge: "Baru",     Name: "Gamis Nibras Anak Perempuan",    Desc: "Gamis anak lucu motif bintang khas Nibras. Bahan katun adem tidak panas."},
		{ID: 13, Type: "fashion", Category: "wanita", Brand: "nibras",  Price: 310000, Stock: 4,  Emoji: "🩱", Badge: "Promo",    Name: "Abaya Nibras Modern Polos",      Desc: "Diskon 30%! Abaya modern premium bahan crepe yang jatuh elegan."},
		{ID: 14, Type: "fashion", Category: "anak",   Brand: "nibras",  Price: 175000, Stock: 16, Emoji: "🎩", Badge: "",         Name: "Set Nibras Anak Koko + Peci",    Desc: "Paket komplit koko anak + peci matching eksklusif Nibras."},
		{ID: 15, Type: "fashion", Category: "wanita", Brand: "nibras",  Price: 145000, Stock: 9,  Emoji: "👘", Badge: "",         Name: "Rok Nibras Lipit Motif Batik",   Desc: "Rok lipit batik modern khas Nibras. Motif batik kontemporer yang elegan."},
		{ID: 16, Type: "fashion", Category: "pria",   Brand: "nibras",  Price: 145000, Stock: 30, Emoji: "🧦", Badge: "Terlaris", Name: "Sarung Nibras Tenun Premium",    Desc: "Sarung tenun berkualitas tinggi. Motif klasik pilihan warna tidak mudah pudar."},
		// ── FASHION · LAINNYA ────────────────────────────────────────────
		{ID: 17, Type: "fashion", Category: "wanita", Brand: "lainnya", Price: 185000, Stock: 25, Emoji: "👗", Badge: "",         Name: "Gamis Syari Bordir Polos",       Desc: "Gamis syar'i berkualitas dengan bordir minimalis elegan. Bahan premium adem."},
		{ID: 18, Type: "fashion", Category: "wanita", Brand: "lainnya", Price: 65000,  Stock: 60, Emoji: "🧣", Badge: "",         Name: "Hijab Segi Empat Voal Polos",    Desc: "Anti kusut, mudah dibentuk, 30+ pilihan warna. Bahan voal lembut."},
		{ID: 19, Type: "fashion", Category: "pria",   Brand: "lainnya", Price: 140000, Stock: 14, Emoji: "👔", Badge: "Promo",    Name: "Kemeja Koko Lengan Panjang",     Desc: "Diskon 15%! Bahan katun lembut berkualitas. Cocok harian maupun semi-formal."},
		{ID: 20, Type: "fashion", Category: "anak",   Brand: "lainnya", Price: 120000, Stock: 2,  Emoji: "🎀", Badge: "Promo",    Name: "Dress Anak Muslim Lebaran",      Desc: "Diskon 20%! Edisi spesial Lebaran, warna cerah dan motif lucu."},
		// ── BEAUTY · WARDAH ──────────────────────────────────────────────
		{ID: 21, Type: "beauty",  Category: "makeup",    Brand: "wardah", Price: 65000,  Stock: 50, Emoji: "💄", Badge: "Terlaris", Name: "Wardah Lip Cream Matte",             Desc: "Lip cream dengan formula matte tahan lama. Tersedia 20+ pilihan warna cantik."},
		{ID: 22, Type: "beauty",  Category: "skincare",  Brand: "wardah", Price: 89000,  Stock: 35, Emoji: "🧴", Badge: "Baru",     Name: "Wardah Lightening Serum",            Desc: "Serum pencerah wajah dengan Vitamin C dan niacinamide. Kulit cerah dalam 2 minggu."},
		{ID: 23, Type: "beauty",  Category: "makeup",    Brand: "wardah", Price: 75000,  Stock: 28, Emoji: "✨", Badge: "",         Name: "Wardah BB Cream SPF 30",             Desc: "BB cream dengan perlindungan SPF 30. Menutupi noda sekaligus melindungi dari UV."},
		{ID: 24, Type: "beauty",  Category: "skincare",  Brand: "wardah", Price: 45000,  Stock: 42, Emoji: "🌸", Badge: "Promo",    Name: "Wardah Face Wash Acne",              Desc: "Diskon 20%! Sabun cuci muka khusus kulit berjerawat dengan Tea Tree Oil."},
		{ID: 25, Type: "beauty",  Category: "makeup",    Brand: "wardah", Price: 95000,  Stock: 20, Emoji: "💋", Badge: "Baru",     Name: "Wardah Exclusive Matte Lip",         Desc: "Lipstik matte premium dengan formula lembut, tahan hingga 8 jam."},
		{ID: 26, Type: "beauty",  Category: "skincare",  Brand: "wardah", Price: 79000,  Stock: 38, Emoji: "💧", Badge: "Terlaris", Name: "Wardah Perfect Bright Moisturizer",  Desc: "Pelembab wajah SPF 28 dengan White Tea Extract. Kulit lembab dan cerah."},
		{ID: 27, Type: "beauty",  Category: "makeup",    Brand: "wardah", Price: 129000, Stock: 15, Emoji: "👁️", Badge: "",         Name: "Wardah Eyeshadow Palette",           Desc: "Palet eyeshadow 9 warna, pigmented dan mudah diblending."},
		{ID: 28, Type: "beauty",  Category: "perawatan", Brand: "wardah", Price: 55000,  Stock: 25, Emoji: "💆", Badge: "Promo",    Name: "Wardah Hair Vitamin Serum",          Desc: "Diskon 15%! Serum vitamin rambut, rambut lebih lembut dan berkilau."},
		{ID: 29, Type: "beauty",  Category: "skincare",  Brand: "wardah", Price: 85000,  Stock: 45, Emoji: "☀️", Badge: "Terlaris", Name: "Wardah Sunscreen SPF 50",            Desc: "Sunscreen SPF 50+ PA++++. Formula ringan, tidak lengket."},
		{ID: 30, Type: "beauty",  Category: "perawatan", Brand: "wardah", Price: 49000,  Stock: 55, Emoji: "🌟", Badge: "",         Name: "Wardah Body Lotion White Secret",    Desc: "Body lotion pencerah dan pelembab kulit tubuh. Wangi tahan lama."},
		{ID: 31, Type: "beauty",  Category: "makeup",    Brand: "wardah", Price: 69000,  Stock: 18, Emoji: "🌺", Badge: "Baru",     Name: "Wardah Blush On Natural",            Desc: "Blush on warna natural memberikan efek pipi merona segar."},
		{ID: 32, Type: "beauty",  Category: "perawatan", Brand: "wardah", Price: 59000,  Stock: 40, Emoji: "💦", Badge: "Promo",    Name: "Wardah Micellar Water",              Desc: "Diskon 10%! Micellar water pembersih makeup efektif tanpa dibilas."},
	}
}
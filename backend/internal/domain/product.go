package domain

// Product represents a single item in the store.
type Product struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"` // wanita | pria | anak | makeup | skincare | perawatan
	Brand    string `json:"brand"`    // rabbani | nibras | wardah | lainnya
	Type     string `json:"type"`     // fashion | beauty
	Price    int    `json:"price"`
	Emoji    string `json:"emoji"`
	Badge    string `json:"badge"`    // Terlaris | Baru | Promo | ""
	Desc     string `json:"desc"`
	Stock    int    `json:"stock"`
}

// Order represents a customer order.
type Order struct {
	ID            int         `json:"id"`
	Items         []OrderItem `json:"items"`
	Total         int         `json:"total"`
	CustomerName  string      `json:"customer_name"`
	CustomerPhone string      `json:"customer_phone"`
	Address       string      `json:"address"`
	Note          string      `json:"note"`
	Status        string      `json:"status"`
}

// OrderItem is one line inside an Order.
type OrderItem struct {
	ProductID int    `json:"product_id"`
	Name      string `json:"name"`
	Emoji     string `json:"emoji"`
	Price     int    `json:"price"`
	Color     string `json:"color"`
	Size      string `json:"size"`
	Qty       int    `json:"qty"`
	Subtotal  int    `json:"subtotal"`
}
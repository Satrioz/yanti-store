package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/Satrioz/yanti-store/internal/config"
    "github.com/Satrioz/yanti-store/internal/handler"
    "github.com/Satrioz/yanti-store/internal/repository"
    "github.com/Satrioz/yanti-store/internal/service"
)

func main() {
	// Load config
	cfg := config.Load()

	// Wire up layers: repository → service → handler
	productRepo    := repository.NewProductRepository()
	productService := service.NewProductService(productRepo)
	productHandler := handler.NewProductHandler(productService)

	orderRepo    := repository.NewOrderRepository()
	orderService := service.NewOrderService(orderRepo, productRepo)
	orderHandler := handler.NewOrderHandler(orderService)

	// Router — compatible with Go 1.21 and below
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/products",  productHandler.Route)
	mux.HandleFunc("/api/v1/products/", productHandler.RouteWithID)
	mux.HandleFunc("/api/v1/orders",    orderHandler.Route)
	mux.HandleFunc("/api/v1/orders/",   orderHandler.RouteWithID)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🕌 Yanti Store API running on http://localhost%s", addr)
	log.Fatal(http.ListenAndServe(addr, withCORS(mux)))
}

// withCORS allows the frontend (localhost:5500) to call the API
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
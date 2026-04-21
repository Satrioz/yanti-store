package handler

import (
    "net/http"
    "strconv"
    "strings"
    "github.com/Satrioz/yanti-store/internal/service"
)

// ProductHandler handles HTTP requests for products.
type ProductHandler struct {
	service service.ProductService
}

// NewProductHandler creates a ProductHandler wired to the given service.
func NewProductHandler(svc service.ProductService) *ProductHandler {
	return &ProductHandler{service: svc}
}

// Route handles /api/v1/products (no ID)
func (h *ProductHandler) Route(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetAll(w, r)
	default:
		respondError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// RouteWithID handles /api/v1/products/{id}
func (h *ProductHandler) RouteWithID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetByID(w, r)
	default:
		respondError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// GetAll handles GET /api/v1/products
func (h *ProductHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	products, err := h.service.GetAll()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to fetch products")
		return
	}
	respondJSON(w, http.StatusOK, products)
}

// GetByID handles GET /api/v1/products/{id}
func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL: /api/v1/products/1 → "1"
	parts := strings.Split(strings.TrimSuffix(r.URL.Path, "/"), "/")
	if len(parts) == 0 {
		respondError(w, http.StatusBadRequest, "missing product id")
		return
	}

	id, err := strconv.Atoi(parts[len(parts)-1])
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid product id")
		return
	}

	product, err := h.service.GetByID(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "product not found")
		return
	}
	respondJSON(w, http.StatusOK, product)
}
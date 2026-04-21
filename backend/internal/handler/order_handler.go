package handler

import (
    "encoding/json"
    "net/http"
    "strconv"
    "strings"
    "github.com/Satrioz/yanti-store/internal/service"
)

// OrderHandler handles HTTP requests for orders.
type OrderHandler struct {
	service service.OrderService
}

// NewOrderHandler creates an OrderHandler wired to the given service.
func NewOrderHandler(svc service.OrderService) *OrderHandler {
	return &OrderHandler{service: svc}
}

// Route handles /api/v1/orders (no ID)
func (h *OrderHandler) Route(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.Create(w, r)
	default:
		respondError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// RouteWithID handles /api/v1/orders/{id}
func (h *OrderHandler) RouteWithID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetByID(w, r)
	default:
		respondError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// Create handles POST /api/v1/orders
func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req service.CreateOrderRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	order, err := h.service.Create(req)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, order)
}

// GetByID handles GET /api/v1/orders/{id}
func (h *OrderHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimSuffix(r.URL.Path, "/"), "/")
	if len(parts) == 0 {
		respondError(w, http.StatusBadRequest, "missing order id")
		return
	}

	id, err := strconv.Atoi(parts[len(parts)-1])
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid order id")
		return
	}

	order, err := h.service.GetByID(id)
	if err != nil {
		respondError(w, http.StatusNotFound, "order not found")
		return
	}

	respondJSON(w, http.StatusOK, order)
}
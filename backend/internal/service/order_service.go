package service

import (
    "fmt"
    "github.com/Satrioz/yanti-store/internal/domain"
    "github.com/Satrioz/yanti-store/internal/repository"
)
// CreateOrderRequest is the input DTO from the HTTP handler.
type CreateOrderRequest struct {
	Items         []OrderItemRequest `json:"items"`
	CustomerName  string             `json:"customer_name"`
	CustomerPhone string             `json:"customer_phone"`
	Address       string             `json:"address"`
	Note          string             `json:"note"`
}

// OrderItemRequest is one line item inside CreateOrderRequest.
type OrderItemRequest struct {
	ProductID int    `json:"product_id"`
	Color     string `json:"color"`
	Size      string `json:"size"`
	Qty       int    `json:"qty"`
}

// OrderService defines the business logic contract for orders.
type OrderService interface {
	Create(req CreateOrderRequest) (*domain.Order, error)
	GetByID(id int) (*domain.Order, error)
}

// orderService is the concrete implementation.
type orderService struct {
	orderRepo   repository.OrderRepository
	productRepo repository.ProductRepository
}

// NewOrderService creates an OrderService wired to both repositories.
func NewOrderService(
	orderRepo repository.OrderRepository,
	productRepo repository.ProductRepository,
) OrderService {
	return &orderService{
		orderRepo:   orderRepo,
		productRepo: productRepo,
	}
}

func (s *orderService) Create(req CreateOrderRequest) (*domain.Order, error) {
	// ── Validate request ──────────────────────────────────────────────
	if err := s.validateRequest(req); err != nil {
		return nil, err
	}

	// ── Build order items + calculate total ───────────────────────────
	var items []domain.OrderItem
	total := 0

	for _, item := range req.Items {
		product, err := s.productRepo.FindByID(item.ProductID)
		if err != nil {
			return nil, fmt.Errorf("order service - Create: product %d not found", item.ProductID)
		}

		subtotal := product.Price * item.Qty
		total   += subtotal

		items = append(items, domain.OrderItem{
			ProductID: product.ID,
			Name:      product.Name,
			Emoji:     product.Emoji,
			Price:     product.Price,
			Color:     item.Color,
			Size:      item.Size,
			Qty:       item.Qty,
			Subtotal:  subtotal,
		})
	}

	// ── Persist ───────────────────────────────────────────────────────
	order := &domain.Order{
		Items:         items,
		Total:         total,
		CustomerName:  req.CustomerName,
		CustomerPhone: req.CustomerPhone,
		Address:       req.Address,
		Note:          req.Note,
	}

	saved, err := s.orderRepo.Save(order)
	if err != nil {
		return nil, fmt.Errorf("order service - Create: %w", err)
	}

	return saved, nil
}

func (s *orderService) GetByID(id int) (*domain.Order, error) {
	if id <= 0 {
		return nil, fmt.Errorf("order service - GetByID: invalid id %d", id)
	}
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("order service - GetByID: %w", err)
	}
	return order, nil
}

// validateRequest checks required fields before processing.
func (s *orderService) validateRequest(req CreateOrderRequest) error {
	if req.CustomerName == "" {
		return fmt.Errorf("customer name is required")
	}
	if req.CustomerPhone == "" {
		return fmt.Errorf("customer phone is required")
	}
	if req.Address == "" {
		return fmt.Errorf("address is required")
	}
	if len(req.Items) == 0 {
		return fmt.Errorf("order must have at least one item")
	}
	for _, item := range req.Items {
		if item.Qty <= 0 {
			return fmt.Errorf("item quantity must be greater than 0")
		}
	}
	return nil
}
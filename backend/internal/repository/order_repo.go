package repository

import (
	"fmt"
	"sync"
	"github.com/Satrioz/yanti-store/internal/domain"
)

// OrderRepository defines the contract for order data access.
type OrderRepository interface {
	Save(order *domain.Order) (*domain.Order, error)
	FindByID(id int) (*domain.Order, error)
}

// inMemoryOrderRepo stores orders in memory with thread-safe access.
type inMemoryOrderRepo struct {
	mu      sync.Mutex
	orders  map[int]*domain.Order
	counter int
}

// NewOrderRepository returns a fresh in-memory OrderRepository.
func NewOrderRepository() OrderRepository {
	return &inMemoryOrderRepo{
		orders: make(map[int]*domain.Order),
	}
}

func (r *inMemoryOrderRepo) Save(order *domain.Order) (*domain.Order, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.counter++
	order.ID     = r.counter
	order.Status = "pending"
	r.orders[order.ID] = order
	return order, nil
}

func (r *inMemoryOrderRepo) FindByID(id int) (*domain.Order, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	order, ok := r.orders[id]
	if !ok {
		return nil, fmt.Errorf("order with id %d not found", id)
	}
	return order, nil
}
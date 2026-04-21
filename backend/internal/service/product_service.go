package service

import (
    "fmt"
    "github.com/Satrioz/yanti-store/internal/domain"
    "github.com/Satrioz/yanti-store/internal/repository"
)

// ProductService defines the business logic contract for products.
type ProductService interface {
	GetAll() ([]domain.Product, error)
	GetByID(id int) (*domain.Product, error)
}

// productService is the concrete implementation.
type productService struct {
	repo repository.ProductRepository
}

// NewProductService creates a ProductService wired to the given repository.
func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetAll() ([]domain.Product, error) {
	products, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("product service - GetAll: %w", err)
	}
	return products, nil
}

func (s *productService) GetByID(id int) (*domain.Product, error) {
	if id <= 0 {
		return nil, fmt.Errorf("product service - GetByID: invalid id %d", id)
	}
	product, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("product service - GetByID: %w", err)
	}
	return product, nil
}
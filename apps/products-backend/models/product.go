package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `                  json:"name"`
	Brand       string `                  json:"brand"`
	Description string `                  json:"description"`

	ProductVariantGroups []ProductVariantGroup `json:"product_variant_groups,omitempty" gorm:"many2many:product_product_variant_groups;"`
	ProductItems         []ProductItem         `json:"product_item,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

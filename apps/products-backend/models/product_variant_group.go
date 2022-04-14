package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductVariantGroup struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `                  json:"name"`
	Description string `                  json:"description"`

	Products        []Product        `json:"products,omitempty"         gorm:"many2many:product_product_variant_groups;"`
	ProductVariants []ProductVariant `json:"product_variants,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

type ProductVariant struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `                  json:"name"`

	ProductVariantGroupID *uint                `json:"product_variant_group_id,omitempty"`
	ProductVariantGroup   *ProductVariantGroup `json:"product_variant_group,omitempty"`
	ProductItems          []ProductItem        `json:"product_items,omitempty"            gorm:"many2many:product_item_product_variants;"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

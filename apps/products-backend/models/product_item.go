package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductItem struct {
	ID          uint `gorm:"primaryKey" json:"id"`
	RetailPrice uint `                  json:"retail_price"`
	LengthCm    uint `                  json:"length_cm"`
	HeightCm    uint `                  json:"height_cm"`
	WidthCm     uint `                  json:"width_cm"`
	WeightKg    uint `                  json:"weight_kg"`
	IsActive    bool `                  json:"is_active"`

	ProductID       *uint            `json:"product_id,omitempty"`
	Product         *Product         `json:"product,omitempty"`
	ProductVariants []ProductVariant `json:"product_variants,omitempty" gorm:"many2many:product_item_product_variants;"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

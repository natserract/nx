package migrations

import (
	"github.com/withbioma/interview-backend/models"
	"gorm.io/gorm"
)

// InitMigrations initiate migration process.
func InitMigrations(db *gorm.DB) {
	db.AutoMigrate(
		models.Product{},
		models.ProductItem{},
		models.ProductVariantGroup{},
		models.ProductVariant{},
	)
}

package dal

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/withbioma/interview-backend/migrations"
	"github.com/withbioma/interview-backend/pkg/errs"
	"google.golang.org/grpc/codes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	singletonSyncOnce sync.Once
	instance          *BaseDAL
)

// BaseDAL encapsulates the basic operations of data access layers.
type BaseDAL struct {
	DB *gorm.DB
}

// GetInstance returns an instance of BaseDAL. If no instance is created yet then create one.
func GetInstance() *BaseDAL {
	singletonSyncOnce.Do(func() {
		db, err := provideDB()
		if err != nil {
			errs.SendToSentry(context.Background(), codes.Internal, err)
			log.Fatalf("provideDB: %s", err)
		}
		instance = &BaseDAL{DB: db}
	})
	return instance
}

// Get fetches the first record matching the UUID and the criteria set in configuration.
// @param result = *models
func (d *BaseDAL) Get(result interface{}, id uint, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.First(r, id).Error; err != nil {
		return err
	}
	return nil
}

// First fetches the first record matching the criteria set in configuration.
func (d *BaseDAL) First(result interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.First(r).Error; err != nil {
		return err
	}
	return nil
}

// Where fetches records matching the criteria set in configuration.
// @param result = *models
func (d *BaseDAL) Where(result interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Find(r).Error; err != nil {
		return err
	}
	return nil
}

// Create inserts a record to the database with the model passed in.
// @param result = *models
func (d *BaseDAL) Create(result interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Create(r).Error; err != nil {
		return err
	}
	return nil
}

// Update updates a record in the database with the model passed in.
// @param result = *models
func (d *BaseDAL) Update(result interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Save(r).Error; err != nil {
		return err
	}
	return nil
}

// UpdateFields updates a record in the database with specified fields to update.
// @param result = *models
// @param fields = map[string]interface{}
func (d *BaseDAL) UpdateFields(
	result interface{}, fields map[string]interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Model(r).Updates(fields).Error; err != nil {
		return err
	}
	return nil
}

// Remove deletes a record in the database with the model passed in.
// @param result = *models
func (d *BaseDAL) Remove(result interface{}, c *Configuration) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Delete(r).Error; err != nil {
		return err
	}
	return nil
}

// GetAssociation fetches the association of a particular model from the database.
// @param result = []models
// @param model = *models
func (d *BaseDAL) GetAssociation(
	result interface{},
	model interface{},
	associationName string,
	c *Configuration,
) error {
	r, err := SanitizePointer(result)
	if err != nil {
		return err
	}
	m, err := SanitizePointer(model)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Model(m).Association(associationName).Find(r); err != nil {
		return err
	}
	return nil
}

// AppendAssociation adds associations for a particular model to the database.
// @param model = *models
// @param associations = []models
func (d *BaseDAL) AppendAssociation(
	model interface{},
	associationName string,
	associations interface{},
	c *Configuration,
) error {
	r, err := SanitizePointer(model)
	if err != nil {
		return err
	}
	a, err := SanitizePointer(associations)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Model(r).Association(associationName).Append(a); err != nil {
		return err
	}
	return nil
}

// DeleteAssociation deletes associations for a particular model to the database.
// @param model = *models
// @param associations = []models
func (d *BaseDAL) DeleteAssociation(
	model interface{},
	associationName string,
	associations interface{},
	c *Configuration,
) error {
	m, err := SanitizePointer(model)
	if err != nil {
		return err
	}
	a, err := SanitizePointer(associations)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Model(m).Association(associationName).Delete(a); err != nil {
		return err
	}
	return nil
}

// CountAssociation fetches the association count of a particular model from the database.
// @param model = *models
func (d *BaseDAL) CountAssociation(
	model interface{},
	associationName string,
	c *Configuration,
) (int64, error) {
	m, err := SanitizePointer(model)
	if err != nil {
		return 0, err
	}

	db := ApplyConfiguration(d.DB, c)
	return db.Model(m).Association(associationName).Count(), nil
}

// ClearAssociation removes all reference between source and association.
// @param model = *models
func (d *BaseDAL) ClearAssociation(
	model interface{},
	associationName string,
	c *Configuration,
) error {
	m, err := SanitizePointer(model)
	if err != nil {
		return err
	}

	db := ApplyConfiguration(d.DB, c)
	if err := db.Model(m).Association(associationName).Clear(); err != nil {
		return err
	}
	return nil
}

func provideDB() (*gorm.DB, error) {
	dsn := "host=interview_backend_postgres port=5432 user=user password=password dbname=bioma sslmode=disable"
	cfg := &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: 100 * time.Millisecond,
				LogLevel:      logger.Info,
				Colorful:      true,
			},
		),
	}

	db, err := gorm.Open(postgres.Open(dsn), cfg)
	if err != nil {
		return nil, err
	}
	migrations.InitMigrations(db)
	fmt.Println("Successfully connected to database")

	return db, nil
}

package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/withbioma/interview-backend/controllers"
	"github.com/withbioma/interview-backend/models"
	"github.com/withbioma/interview-backend/pkg/dal"
)

type Router struct {
	ProductController             *controllers.ProductController
	ProductVariantGroupController *controllers.ProductVariantGroupController
}

func main() {
	productController := controllers.GetProductControllerInstance()
	productVariantGroupController := controllers.GetProductVariantGroupControllerInstance()

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"User-Agent",
			"Origin",
		},
		AllowCredentials: true,
	}))
	router.Use(middleware.Heartbeat("/"))
	router.Route("/api", func(r chi.Router) {
		r.Route("/products", func(r chi.Router) {
			r.Get("/", productController.GetAll)
			r.Post("/", productController.Create)
			r.Route("/{product_id}", func(r chi.Router) {
				r.Get("/", productController.Get)
				r.Patch("/", productController.Update)
				r.Delete("/", productController.Delete)
			})
		})

		r.Route("/product_variant_groups", func(r chi.Router) {
			r.Get("/", productVariantGroupController.GetAll)
			r.Post("/", productController.Create)
			r.Route("/{product_variant_group_id}", func(r chi.Router) {
				r.Delete("/", productController.Delete)
			})
		})
	})

	initSeed()

	fmt.Println("Now serving server at :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err, -1)
	}
}

func initSeed() {
	basedal := dal.GetInstance()

	var productVariantGroups []models.ProductVariantGroup
	if err := basedal.Where(
		&productVariantGroups,
		&dal.Configuration{PreloadObjs: []string{"ProductVariants"}}); err != nil {
		log.Fatal(err, -1)
	}

	if len(productVariantGroups) == 0 {
		productVariantGroup := &models.ProductVariantGroup{
			Name:        "Size",
			Description: "Item size",
			ProductVariants: []models.ProductVariant{
				{
					Name: "Small",
				},
				{
					Name: "Medium",
				},
				{
					Name: "Large",
				},
			},
		}
		if err := basedal.Create(productVariantGroup, nil); err != nil {
			log.Fatal(err, -1)
		}
		productVariantGroups = append(productVariantGroups, *productVariantGroup)
	}

	var products []models.Product
	if err := basedal.Where(&products, nil); err != nil {
		log.Fatal(err, -1)
	}

	if len(products) == 0 {
		product := &models.Product{
			Name:                 "Bike",
			Brand:                "Olympic",
			Description:          "Road Bike",
			ProductVariantGroups: []models.ProductVariantGroup{productVariantGroups[0]},
			ProductItems: []models.ProductItem{
				{
					RetailPrice:     1000,
					LengthCm:        10,
					HeightCm:        10,
					WidthCm:         10,
					WeightKg:        1,
					IsActive:        true,
					ProductVariants: productVariantGroups[0].ProductVariants,
				},
			},
		}
		if err := basedal.Create(product, nil); err != nil {
			log.Fatal(err, -1)
		}
	}
}

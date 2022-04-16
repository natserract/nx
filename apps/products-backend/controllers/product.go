package controllers

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/go-chi/chi"
	"github.com/go-playground/validator"
	"github.com/withbioma/interview-backend/models"
	"github.com/withbioma/interview-backend/pkg/dal"
	"github.com/withbioma/interview-backend/pkg/errs"
	"github.com/withbioma/interview-backend/pkg/strings"
	"gorm.io/gorm"
)

var (
	singletonSyncOnce sync.Once
	instance          *ProductController
)

type ProductController struct {
	BaseDAL *dal.BaseDAL
}

func GetProductControllerInstance() *ProductController {
	singletonSyncOnce.Do(func() {
		instance = &ProductController{BaseDAL: dal.GetInstance()}
	})
	return instance
}

func (c *ProductController) Create(w http.ResponseWriter, r *http.Request) {
	type createProductItemRequest struct {
		RetailPrice       uint   `json:"retail_price"`
		LengthCm          uint   `json:"length_cm"`
		HeightCm          uint   `json:"height_cm"`
		WidthCm           uint   `json:"width_cm"`
		WeightKg          uint   `json:"weight_kg"`
		IsActive          bool   `json:"is_active"`
		ProductVariantIDs []uint `json:"product_variant_ids" validate:"gt=0,dive,required"`
	}
	type createRequest struct {
		Name                   string                     `json:"name"                      validate:"required"`
		Brand                  string                     `json:"brand"                     validate:"required"`
		Description            string                     `json:"description"               validate:"required"`
		ProductVariantGroupIDs []uint                     `json:"product_variant_group_ids" validate:"gt=0,dive,required"`
		ProductItems           []createProductItemRequest `json:"product_items"             validate:"gt=0,dive,required"`
	}

	var req createRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}
	if err := validator.New().Struct(&req); err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	var productVariantGroups []models.ProductVariantGroup
	if err := c.BaseDAL.Where(&productVariantGroups, &dal.Configuration{
		WhereClauses: []dal.WhereClause{{
			Query: "id in ?",
			Args:  []interface{}{req.ProductVariantGroupIDs},
		}},
	}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	product := &models.Product{
		Name:        req.Name,
		Brand:       req.Brand,
		Description: req.Description,
	}
	if err := dal.BeginTransaction(c.BaseDAL.DB, func(tx *gorm.DB) error {
		cfg := &dal.Configuration{Transaction: tx}

		if err := c.BaseDAL.Create(product, cfg); err != nil {
			return err
		}

		var productItems []models.ProductItem
		for i := range req.ProductItems {
			var productVariants []models.ProductVariant
			if err := c.BaseDAL.Where(&productVariants, &dal.Configuration{
				Transaction: tx,
				WhereClauses: []dal.WhereClause{{
					Query: "id in ?",
					Args:  []interface{}{req.ProductItems[i].ProductVariantIDs},
				}},
			}); err != nil {
				return err
			}

			productItem := &models.ProductItem{
				RetailPrice:     req.ProductItems[i].RetailPrice,
				LengthCm:        req.ProductItems[i].LengthCm,
				HeightCm:        req.ProductItems[i].HeightCm,
				WidthCm:         req.ProductItems[i].WidthCm,
				WeightKg:        req.ProductItems[i].WeightKg,
				IsActive:        req.ProductItems[i].IsActive,
				ProductVariants: productVariants,
			}
			if err := c.BaseDAL.Create(productItem, cfg); err != nil {
				return err
			}

			productItems = append(productItems, *productItem)
		}

		product.ProductItems = productItems
		return nil
	}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	type createResponse struct {
		Product *models.Product `json:"product"`
	}
	json.NewEncoder(w).Encode(createResponse{Product: product})
}

func (c *ProductController) Update(w http.ResponseWriter, r *http.Request) {
	type updateProductItemRequest struct {
		ProductItemId     uint   `json:"product_item_id"`
		RetailPrice       uint   `json:"retail_price"`
		LengthCm          uint   `json:"length_cm"`
		HeightCm          uint   `json:"height_cm"`
		WidthCm           uint   `json:"width_cm"`
		WeightKg          uint   `json:"weight_kg"`
		IsActive          bool   `json:"is_active"`
		ProductVariantIDs []uint `json:"product_variant_ids" validate:"gt=0,dive,required"`
	}
	type updateRequest struct {
		Name                   string                     `json:"name"                      validate:"required"`
		Brand                  string                     `json:"brand"                     validate:"required"`
		Description            string                     `json:"description"               validate:"required"`
		ProductVariantGroupIDs []uint                     `json:"product_variant_group_ids" validate:"gt=0,dive,required"`
		ProductItems           []updateProductItemRequest `json:"product_items"             validate:"gt=0,dive,required"`
	}

	var req updateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}
	if err := validator.New().Struct(&req); err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	productIdRaw := chi.URLParam(r, "product_id")
	productId, err := strings.ParseUint(productIdRaw)
	if err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	var product models.Product
	if err := c.BaseDAL.Get(
		&product,
		productId,
		&dal.Configuration{
			PreloadObjs: []string{
				"ProductVariantGroups",
				"ProductItems.ProductVariants",
			},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	product.Name = req.Name
	product.Brand = req.Brand
	product.Description = req.Description

	if err := dal.BeginTransaction(c.BaseDAL.DB, func(tx *gorm.DB) error {
		cfg := &dal.Configuration{Transaction: tx}

		if err := c.BaseDAL.Update(product, cfg); err != nil {
			return err
		}

		for i := range req.ProductItems {
			if req.ProductItems[i].ProductItemId != 0 {
				var productItem models.ProductItem
				if err := c.BaseDAL.Get(
					&productItem,
					req.ProductItems[i].ProductItemId,
					&dal.Configuration{},
				); err != nil {
					errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
					return err
				}

				if err := c.BaseDAL.Remove(&productItem, nil); err != nil {
					errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
					return err
				}
			}
		}

		var productItems []models.ProductItem
		for i := range req.ProductItems {
			var productVariants []models.ProductVariant
			if err := c.BaseDAL.Where(&productVariants, &dal.Configuration{
				Transaction: tx,
				WhereClauses: []dal.WhereClause{{
					Query: "id in ?",
					Args:  []interface{}{req.ProductItems[i].ProductVariantIDs},
				}},
			}); err != nil {
				return err
			}

			productItem := &models.ProductItem{
				RetailPrice:     req.ProductItems[i].RetailPrice,
				LengthCm:        req.ProductItems[i].LengthCm,
				HeightCm:        req.ProductItems[i].HeightCm,
				WidthCm:         req.ProductItems[i].WidthCm,
				WeightKg:        req.ProductItems[i].WeightKg,
				IsActive:        req.ProductItems[i].IsActive,
				ProductVariants: productVariants,
			}
			if err := c.BaseDAL.Create(productItem, cfg); err != nil {
				return err
			}

			productItems = append(productItems, *productItem)
		}

		product.ProductItems = productItems
		return nil
	}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type updateResponse struct {
		Product *models.Product `json:"product"`
	}
	json.NewEncoder(w).Encode(updateResponse{Product: &product})
}

func (c *ProductController) GetAll(w http.ResponseWriter, r *http.Request) {
	var products []models.Product
	if err := c.BaseDAL.Where(
		&products,
		&dal.Configuration{
			PreloadObjs: []string{
				"ProductVariantGroups",
				"ProductItems.ProductVariants",
			},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type getAllResponse struct {
		Products []models.Product `json:"products"`
	}
	json.NewEncoder(w).Encode(getAllResponse{Products: products})
}

func (c *ProductController) Get(w http.ResponseWriter, r *http.Request) {
	productIdRaw := chi.URLParam(r, "product_id")
	productId, err := strings.ParseUint(productIdRaw)
	if err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	var product models.Product
	if err := c.BaseDAL.Get(
		&product,
		productId,
		&dal.Configuration{
			PreloadObjs: []string{
				"ProductVariantGroups",
				"ProductItems.ProductVariants",
			},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type getResponse struct {
		Product *models.Product `json:"product"`
	}
	json.NewEncoder(w).Encode(getResponse{Product: &product})
}

func (c *ProductController) Delete(w http.ResponseWriter, r *http.Request) {
	productIdRaw := chi.URLParam(r, "product_id")
	productId, err := strings.ParseUint(productIdRaw)
	if err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	var product models.Product
	if err := c.BaseDAL.Get(
		&product,
		productId,
		&dal.Configuration{
			PreloadObjs: []string{
				"ProductVariantGroups",
				"ProductItems.ProductVariants",
			},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	if err := c.BaseDAL.Remove(&product, nil); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type deleteResponse struct {
		Product *models.Product `json:"product"`
	}
	json.NewEncoder(w).Encode(deleteResponse{Product: &product})
}

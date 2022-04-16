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
)

var (
	productVariantGroupSyncOnce sync.Once
	productVariantInstance      *ProductVariantGroupController
)

type ProductVariantGroupController struct {
	BaseDAL *dal.BaseDAL
}

func GetProductVariantGroupControllerInstance() *ProductVariantGroupController {
	productVariantGroupSyncOnce.Do(func() {
		productVariantInstance = &ProductVariantGroupController{BaseDAL: dal.GetInstance()}
	})
	return productVariantInstance
}

func (c *ProductVariantGroupController) Create(w http.ResponseWriter, r *http.Request) {
	type createProductVariantRequest struct {
		Name        string `json:"name"        validate:"required"`
		Description string `json:"description" validate:"required"`
	}
	type createRequest struct {
		Name            string                        `json:"name"             validate:"required"`
		Description     string                        `json:"description"      validate:"required"`
		ProductVariants []createProductVariantRequest `json:"product_variants" validate:"gt=0,dive,required"`
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

	var productVariants []models.ProductVariant
	for i := range req.ProductVariants {
		productVariants = append(productVariants, models.ProductVariant{
			Name: req.ProductVariants[i].Name,
		})
	}

	productVariantGroup := &models.ProductVariantGroup{
		Name:            req.Name,
		Description:     req.Description,
		ProductVariants: productVariants,
	}
	if err := c.BaseDAL.Create(&productVariantGroup, nil); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	type createResponse struct {
		ProductVariantGroup *models.ProductVariantGroup `json:"product_variant_group"`
	}
	json.NewEncoder(w).Encode(createResponse{ProductVariantGroup: productVariantGroup})
}

func (c *ProductVariantGroupController) GetAll(w http.ResponseWriter, r *http.Request) {
	var productVariantGroups []models.ProductVariantGroup
	if err := c.BaseDAL.Where(
		&productVariantGroups,
		&dal.Configuration{
			PreloadObjs: []string{"ProductVariants"},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type getAllResponse struct {
		ProductVariantGroups []models.ProductVariantGroup `json:"product_variant_groups"`
	}
	json.NewEncoder(w).Encode(getAllResponse{ProductVariantGroups: productVariantGroups})
}

func (c *ProductVariantGroupController) Delete(w http.ResponseWriter, r *http.Request) {
	productVariantGroupVariantGroupIdRaw := chi.URLParam(r, "productVariantGroup_variant_group_id")
	productVariantGroupVariantGroupId, err := strings.ParseUint(
		productVariantGroupVariantGroupIdRaw,
	)
	if err != nil {
		errs.APIError(r.Context(), w, http.StatusBadRequest, err)
		return
	}

	var productVariantGroup models.ProductVariantGroup
	if err := c.BaseDAL.Get(
		&productVariantGroup,
		productVariantGroupVariantGroupId,
		&dal.Configuration{
			PreloadObjs: []string{"ProductVariantGroupVariants"},
		}); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	if err := c.BaseDAL.Remove(&productVariantGroup, nil); err != nil {
		errs.APIError(r.Context(), w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	type deleteResponse struct {
		ProductVariantGroup *models.ProductVariantGroup `json:"product_variant_group"`
	}
	json.NewEncoder(w).Encode(deleteResponse{ProductVariantGroup: &productVariantGroup})
}

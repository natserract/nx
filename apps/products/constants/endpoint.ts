
type inputArg = string | number;

export const BASE_URL = `${process.env.NX_APIBASE_URL}/api`

// Product endpoints
export const URL_PRODUCTS = `${BASE_URL}/products`
export const URL_PRODUCTS_VARIANT_GROUPS = `${BASE_URL}/product_variant_groups`
export const URL_PRODUCTS_ITEM = (productId: inputArg) => `${URL_PRODUCTS}/${productId}`

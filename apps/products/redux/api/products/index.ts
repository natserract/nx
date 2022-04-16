import { URL_PRODUCTS, URL_PRODUCTS_ITEM, URL_PRODUCTS_VARIANT_GROUPS } from '../../../constants/endpoint';
import { baseApi } from '../base'
import { ProductListsResponse, ProductsPayloadT, ProductViewResponse, VariantGroupPayloadT } from './types';

// | Define product endpoints and allow it to create the API slice
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // | Define crud actions
    getProducts: builder.query<ProductListsResponse, void>({
      // | If there query no argument, use `void`
      // https://github.com/reduxjs/redux-toolkit/issues/1676
      query: () => `${URL_PRODUCTS}`
    }),
    getProduct: builder.query<ProductViewResponse, string | number>({
      query: (productId: string | number) => `${URL_PRODUCTS_ITEM(productId)}`,
    }),
    addProduct: builder.mutation<string, { payload: ProductsPayloadT; productId: string | number }>({
      query: ({ productId, payload }) => ({
        // Input types
        body: {
          ...payload,
        },
        method: 'POST',
        url: `${URL_PRODUCTS}`,
      })
    }),
    updateProduct: builder.mutation<string, { payload: Partial<ProductsPayloadT>, productId: string | number }>({
      query: ({ productId, payload }) => ({
        body: {
          ...payload,
        },
        method: 'PATCH',
        url: `${URL_PRODUCTS_ITEM(productId)}`
      })
    }),
    addVariantGroups: builder.mutation<string, { payload: VariantGroupPayloadT }>({
      query: ({ payload }) => ({
        body: {
          ...payload,
        },
        method: 'POST',
        url: `${URL_PRODUCTS_VARIANT_GROUPS}`
      })
    })
  })
})

// Export hooks for usage in functional components, which are
// Auto-generated based on the defined endpoints
export const
  { useGetProductsQuery
    , useAddProductMutation
    , useLazyGetProductsQuery
    , useGetProductQuery
    , useLazyGetProductQuery
    , useAddVariantGroupsMutation
    , util: { getRunningOperationPromises: getRunningOperationPromisesProduct }
  } = productApi

export const productsApiReducer = productApi.reducer
export const productsApiReducerPath = productApi.reducerPath

// export endpoints for use in SSR
export const { getProducts } = productApi.endpoints;

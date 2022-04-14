import { baseApi } from '../base'

// | Define product endpoints and allow it to create the API slice
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // | Define crud actions
    // TODO: builder.query types (PostResponse)
    getProducts: builder.query<any, void>({
      // | If there query no argument, use `void`
      // https://github.com/reduxjs/redux-toolkit/issues/1676
      query: () => `/posts/`
    }),
    getProduct: builder.query({
      query: (id: number) => `/products/${id}`,
    }),
    // TODO: payload types
    addProducts: builder.mutation<string, { payload: any; id: string }>({
      query: ({ id, payload }) => ({
        // Input types
        body: {
          // user: userId,
          ...payload,
        },
        method: 'POST',
        url: '/add/products/',
      })
    })
  })
})

// Export hooks for usage in functional components, which are
// Auto-generated based on the defined endpoints
export const
  { useGetProductsQuery
    , useAddProductsMutation
    , useLazyGetProductsQuery
    , useGetProductQuery
    , useLazyGetProductQuery
  } = productApi

export const productsApiReducer = productApi.reducer
export const productsApiReducerPath = productApi.reducerPath

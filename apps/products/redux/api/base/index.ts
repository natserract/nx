import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper';

export const BASE_API_REDUCER_KEY = 'productApp';

// In this section, i'm little confused about `createApi` & `createAsyncThunk`
// But, after read the documentation https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query
// RTK query, give a solution for this problems (data fetching)
//
// In fact, `createApi` will completely cover our logic implemented above for the entire slice file
// including the thunk, slice definition, selectors, and our custom hook!
//
// Must read: https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
//
// | Define our base endpoints
export const baseApi = createApi({
  reducerPath: BASE_API_REDUCER_KEY,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NX_APIBASE_URL,
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  refetchOnMountOrArgChange: true,
  tagTypes: ['Products', 'ProductsVariants'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 30,
})


export const baseApiReducer = baseApi.reducer
export const baseApiReducerPath = baseApi.reducerPath

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const BASE_API_REDUCER_KEY = '@@AppReducer';

// In this section, i'm little confused about `createApi` & `createAsyncThunk`
// But, after read the documentation https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query
// RTK query, give a solution for this problems (data fetching)
//
// In fact, `createApi` will completely cover our logic implemented above for the entire slice file
// including the thunk, slice definition, selectors, and our custom hook!
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
  endpoints: (builder) => ({})
})


export const baseApiReducer = baseApi.reducer
export const baseApiReducerPath = baseApi.reducerPath

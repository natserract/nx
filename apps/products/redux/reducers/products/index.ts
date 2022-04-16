
// | Actually we don't need this module (not used)
// But just to know how rtk api works and what's API provided
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "../../api";

// TODO: update field types
export interface ProductsEntity {
  id: number;
}

export interface ProductsState extends EntityState<ProductsEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string;
}

// | Set of function for CRUD operations
export const productsAdapter = createEntityAdapter<ProductsEntity>();

export const initialProductsState: ProductsState =
  productsAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null
  })

export const PRODUCTS_REDUCER_KEY = 'products';

// createAsyncThunk() @see https://redux-toolkit.js.org/api/createAsyncThunk
// Generates promise lifecycle action types using this string as a prefix:
// => pending -> fulfilled -> rejected
export const fetchProducts = createAsyncThunk(
  'products/fetchStatus', // <- action type string
  async (_, thunkApi) => {
    return Promise.resolve([])
  }
)

export const productSlice = createSlice({
  name: PRODUCTS_REDUCER_KEY,
  initialState: initialProductsState,
  reducers: {
    add: productsAdapter.addOne,
  },
  // We need change loading/error state
  // So that's used extraReducers for approving this way
  extraReducers: (builder) => {
    builder
      // Add case, it's same like switch case -, (but in function pipeline)
      .addCase(fetchProducts.pending, (state: ProductsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchProducts.fulfilled, // <- fetch is successful
        (state: ProductsState, action: PayloadAction<ProductsEntity[]>) => {
          productsAdapter.setAll(state, action.payload)
        }
      )
      .addCase(fetchProducts.rejected, (state: ProductsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      })
  }
})

export const productsReducer = productSlice.reducer
export const productsReducerPath = productApi.reducerPath

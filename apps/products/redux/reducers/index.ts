import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { baseApiReducer, baseApiReducerPath } from "../api/base";
import { productsApiReducer, productsApiReducerPath } from "../api/products";

const reducers = {
  [baseApiReducerPath]: baseApiReducer,
  [productsApiReducerPath]: productsApiReducer,
}

export const rootReducer = combineReducers<typeof reducers>(reducers)

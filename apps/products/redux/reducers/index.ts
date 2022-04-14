import { combineReducers } from "@reduxjs/toolkit";
import { baseApiReducer, baseApiReducerPath } from "../api/base";
import { productsApiReducer, productsApiReducerPath } from "../api/products";

const reducers = {
  [baseApiReducerPath]: baseApiReducer,
  [productsApiReducerPath]: productsApiReducer
}

export type AppStateT = typeof reducers

export const rootReducer = combineReducers<AppStateT>(reducers)

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { rootReducer } from './reducers'
import { baseApi, productApi } from './api'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'

export const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat([
      baseApi.middleware,
      productApi.middleware,
    ])
  },
  devTools: process.env.NODE_ENV === 'development',
})

const makeStore = () => store;

export type AppState = ReturnType<typeof makeStore>

export const wrapper = createWrapper(makeStore, { debug: true })

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch)

/**
 * We're taking the store's dispatch function and we're asking TypeScript, "what is this thing?
 * We're exporting the type of that function as a thing we can use.
 */
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * There's nothing specific to Redux Toolkit about this. It's using TypeScript's inference to figure out as much as possible, so that we don't have to declare this ourselves. And so if we add more slice reducers to our store, that type updates automatically.
 */
export type RootState = ReturnType<typeof store.getState>

/**
 * A hook to access app state.
 *
 * Examples:
 * ```tsx
 * const products = useAppSelector((state) => state.products.products)
 * ```
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

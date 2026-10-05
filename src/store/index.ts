import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { bolisApi } from './bolisApi';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        [bolisApi.reducerPath]: bolisApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(bolisApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import orderReducer from '../features/order/orderSlice';
import selectedOrderReducer from '../features/selectedOrder/selectedOrderSlice';
 const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        selectedOrder: selectedOrderReducer
    },
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(authApi.middleware),
})

export default store;
import { createSlice } from "@reduxjs/toolkit"
import { createProduct, deleteProduct, getAllProducts, searchProductByName, updateProduct } from "./productAction"

const initialState= {
    allProducts: null,
    searchProduct: "",
    resultProduct: null,
    loading: false,
    error: null,
    messageCRUD: null,
}

const productSlice =  createSlice({
    name: "product",
    initialState,
    reducers: {
        setSearchProduct: (state, action)=> {
            state.searchProduct = action.payload;
        },
        resetSearchProduct: (state) => {
            state.resultProduct = []
        },
        setMessage: (state)=> {
            state.messageCRUD = null
        }
    },
    extraReducers(builer) {
        builer
        //Tao san pham
        .addCase(createProduct.pending, (state) => {
            
        })
        .addCase(createProduct.rejected, (state) => {
            
        })
        .addCase(createProduct.fulfilled, (state) => {
            
        })
        //Sửa sản phẩm
        .addCase(updateProduct.pending, (state) => {
            
        })
        .addCase(updateProduct.rejected, (state) => {
            
        })
        .addCase(updateProduct.fulfilled, (state) => {
            
        })
        // Xóa sản phẩm
        .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteProduct.rejected, (state) => {
            
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.messageCRUD = action.payload.message;
        })
        // Lấy tất cả sản phẩm
        .addCase(getAllProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllProducts.rejected, (state, action) => {
            state.error = action;
            state.loading = false;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
            state.allProducts = action.payload.data;
            state.loading = false;
        })
        // //Tìm kiếm sản phẩm
        // .addCase(searchProductByName.pending, (state) => {
        //     state.loading = true;
        // })
        // .addCase(searchProductByName.rejected, (state, action) => {
        //     state.error = action;
        //     state.loading = false;
        // })
        // .addCase(searchProductByName.fulfilled, (state, action) => {
        //     // state.resultProduct = state.action;
        //     state.loading = false;
        // })
        //
    }
})

export const { setSearchProduct, setMessage} = productSlice.actions

export default productSlice.reducer;
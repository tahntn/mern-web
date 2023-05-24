import { createSlice } from "@reduxjs/toolkit"
import { createProduct, deleteProduct, getAllProducts, searchProductByName, updateProduct } from "./productAction"

const initialState= {
    allProducts: null,
    searchProduct: "",
    resultProduct: null,
    loading: false,
    error: null,
    messageCRUD: null,
    
    search: "",
    filterProduct: null,
    arrivalsProduct: null,
    isLoading: false,

}

const productSlice =  createSlice({
    name: "product",
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload
        },
        setSearchProduct: (state, action)=> {
            state.searchProduct = action.payload;
        },
        resetSearchProduct: (state) => {
            state.resultProduct = []
        },
        setMessage: (state, action)=> {
            state.messageCRUD = null
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        },
        setFilterProduct: (state, action) => {
            state.filterProduct = action.payload;
        },
        setArrivalsProduct: (state, action) => {
            state.arrivalsProduct = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
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
        //     state.error = action;fil
        //     state.loading = false;
        // })
        // .addCase(searchProductByName.fulfilled, (state, action) => {
        //     // state.resultProduct = state.action;
        //     state.loading = false;
        // })
        //
    }
})

export const { setSearchProduct, setMessage,    searchProduct, setAllProducts, setFilterProduct, setIsLoading} = productSlice.actions

export default productSlice.reducer;
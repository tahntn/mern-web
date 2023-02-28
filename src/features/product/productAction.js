import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;


export const createProduct = createAsyncThunk("product/create-product", async (data) => {
    const res = await axios.post(`${BASE_URL}/product/create-product`, data);
    return res.data;
});

export const updateProduct = createAsyncThunk("product/update-product", async ({id, data, accessToken }) => {
    const res = await axios.put(`${BASE_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
});

export const deleteProduct = createAsyncThunk("product/delete-product", async ({id}) => {
    const res = await axios.delete(`${BASE_URL}/product/delete-product/${id}`)
    return res.data
});


export const getAllProducts = createAsyncThunk("product/get-alls-product-no-pag", async () => {
    const res = await axios.get(`${BASE_URL}/product/get-alls-product-no-pag`);

    return res.data;
});

export const searchProductByName = createAsyncThunk("product/get-alls-product", async (searchNameProduct) => {
    const res = await axios.get(`${BASE_URL}/product/get-alls-product?filter=name&filter=${searchNameProduct}`);
    return res.data;
});

export const getProductById = createAsyncThunk("product/delete-product", async ({id, accessToken }) => {
    const res = await axios.get(`${BASE_URL}/product/update-product/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
});


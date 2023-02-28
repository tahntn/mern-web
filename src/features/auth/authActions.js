import axios from "axios";
import { createAsyncThunk } from '@reduxjs/toolkit'

export const axiosJWT = axios.create();

const BASE_URL = process.env.REACT_APP_API_URL;
// console.log();

export const userLogin = createAsyncThunk("/user/login", async (data) => {
 
    const res = await axios.post(`${BASE_URL}/user/login`, data);
    return res.data;
})

export const userLogout = createAsyncThunk("/user/log-out", async () => {
console.log("logout");
    const res = await axios.post(`${BASE_URL}/user/log-out`);
    return res.data;
})

export const userSignup = createAsyncThunk("/user/sign-up", async (data) => {
    const res = await axios.post(`${BASE_URL}/user/sign-up`, data); 
    return res.data;
})

export const getDetailsUser = createAsyncThunk("/user/get-details", async ({id, access_token}) => {
    const res = await axiosJWT.get(`${BASE_URL}/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
   
    return res.data;
})

export const refreshToken = createAsyncThunk("/user/refresh-token", async () => {
    const res = await axios.post(`${BASE_URL}/user/refresh-token`, {
        withCredentials: true // khi có Cookie sẽ tự động lấy cookie truyền xuống backend 
    })
    return res.data;
})

export const updateUser = createAsyncThunk("/user/update-user", async ({id, data,access_token}) => {
    const res = await axiosJWT.put(`${BASE_URL}/user/update-user/${id}`, data,{
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data;
})

export const getAllUsers = createAsyncThunk("/user/get-all", async ( access_token) => {
    const res = await axiosJWT.get(`${BASE_URL}/user/get-all`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
   
    return res.data;
})

export const deleteUser = createAsyncThunk("/user/delete-user/", async ({id, access_token}) => {
    const res = await axiosJWT.delete(`${BASE_URL}/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data;
})



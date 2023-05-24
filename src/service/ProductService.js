import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit, page ) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}&page=${page}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}&page=${page}`)
    }
    return res.data
}


export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create-product`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-product/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all`)
    return res.data
}


export const addToWishList= async (data) => {
    const { access_token, ...newdata} = data
    let res;
    try {
         res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/addToWishList`, newdata, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        })
         return res.data
    } catch (error) {
        console.log(error);
    }
    
}



export const removeProductToWishList= async (data) => {
    const { access_token, ...newdata} = data
    let res;
    try {
         res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/removeProductToWishList`, newdata, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        })
         return res.data
    } catch (error) {
        console.log(error);
    }
    
}

export const removeReviewProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/deleteReview`, data)
    return res.data
}

export const removeAllProductWishList= async (data) => {
    const { access_token, newdata} = data
    let res;
    try {
         res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/removeAllProductWishList`, newdata,{
            headers: {
                token: `Bearer ${access_token}`,
            }
        })
         return res.data
    } catch (error) {
        console.log(error);
    }
    
}

export const getAllProducts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-product`);
    return res.data
}
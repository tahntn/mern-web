import axios from "axios"
import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//   return res.data
// // }
// http://localhost:3001/api/order/get-order-details/639724669c6dda4fa11edcde
export const createOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getOrderByUserId = async (id,access_token) => {

  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const cancelOrder = async (id,data) => {
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`,data)
  return res.data
}

export const updateOrder = async (id,data) => {

  const res = await axios.put(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`, data)
  return res.data
}

export const getAllOrder = async() => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all`)
return res.data
} 

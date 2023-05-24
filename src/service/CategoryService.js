import axios from "axios";


export const getAllCategory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all`);
    return res.data
}

export const createCategory = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create-category`, data);
    return res.data
}

export const getDetailsCategory = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-category/${id}`);
    return res.data
}

export const updateCategory = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/category/update-category/${id}`, data);
    return res.data
}

export const deleteCategory = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/category/delete-category/${id}`)
    return res.data
}

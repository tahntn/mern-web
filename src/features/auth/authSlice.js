import { createSlice } from '@reduxjs/toolkit';
import { deleteUser, getAllUsers, getDetailsUser, updateUser, userLogin, userLogout, userSignup } from './authActions';



const userToken =  JSON.parse(localStorage.getItem('access_token')) || null;
const userInfo = JSON.parse(localStorage.getItem("userInfo"))  ?  JSON.parse(localStorage.getItem("userInfo")) : null

const initialState = {
    loading: false,
    error: null,
    success: userInfo ? true : false,
    allUsers: null,
    userInfo,
    userToken,
    message: null,
    status:  null,
    isLoading: userInfo ? true : false,
    messageCRUD: null,
};

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
       
        setMessage: (state)=> {
            state.message = null;
            state.status = null;
            state.messageCRUD = null;
            
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
      
    },
    extraReducers(builer){
        builer
            //login 
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.userToken = action.payload.access_token;
                state.message = action.payload.message
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action;
            })
            // sign up
            .addCase(userSignup.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(userSignup.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status
                state.message = action.payload.message;
                state.messageCRUD = action.payload.message;
                
            })
            .addCase(userSignup.rejected, (state, action) => {
                state.loading = false;
                state.error = action;
            })
            //getDetailUser
            .addCase(getDetailsUser.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getDetailsUser.rejected, (state, action) => {
    
                state.isLoading = false;
            })
            .addCase(getDetailsUser.fulfilled, (state, action) => {
               
                state.userInfo = action.payload.data;
                state.isLoading = false;
            })
            //update User
            .addCase(updateUser.pending, state=>{
                state.loading = true;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "Loi nhap vao";
                state.error = action;
                state.messageCRUD = "lỗi";
                
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.messageCRUD = action.payload.message;
                state.loading = false;
                state.error = null;
                
            })
            //logout
            .addCase(userLogout.fulfilled, (state)=> {
                localStorage.removeItem('userToken') // delete token from storage
            localStorage.removeItem('userInfo') 
            state.loading = false
            state.userInfo = null
            state.userToken = null
            state.error = null
            state.success = false
            state.message = null
            })
            //lay tat ca user
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload.data;
            })
            //Xóa user 
            .addCase(deleteUser.pending, state => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.messageCRUD = action.payload.message;
            })

    }
});

export const { setMessage, logout, setIsLoading} = authSlice.actions;

export default authSlice.reducer;
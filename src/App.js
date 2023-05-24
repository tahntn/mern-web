

import { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./component/DefaultComponent/DefaultComponent";
import { routes } from "./routes";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  axiosJWT,
  getAllUsers,
  getDetailsUser,
  refreshToken,
} from "./features/auth/authActions";
import { setIsLoading, updateUser1 } from "./features/auth/authSlice";
import { getAllProducts } from "./features/product/productAction";
import * as UserService from "./service/UserService";
import * as ProductService from "./service/ProductService";
import { isJsonString } from "./utils";
import { setAllProducts, setFilterProduct, setIsLoading as setIsLoadingProduct } from "./features/product/productSlice";
import DefaultNoHomeComponent from "./component/DefaultNoHomeComponent/DefaultNoHomeComponent";

function App() {
 
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth)
  const [allProduct, setAllProduct] = useState([])

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  useEffect(()=>{
    dispatch( setIsLoadingProduct(true))
  
    const fetchAllProduct = async () => {
      const res = await ProductService.getAllProducts();
      setAllProduct(res?.data)
      
    }
    fetchAllProduct();
    
  },[])

  useEffect(()=> {
    // dispatch( setIsLoadingProduct())
    dispatch(setAllProducts(allProduct));
    dispatch(setFilterProduct(allProduct))
    if(allProduct.length > 0) {
      dispatch( setIsLoadingProduct(false))
    }
  }, [allProduct])



  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwt_decode(storageData)
    }

    return { decoded, storageData }
  }


  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })


  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }))
  }



  return (
    <div className="App" style={{backgroundColor:"#f5f5f5"}}>
      {/* header */}
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isAdmin = route?.isAdmin;
            const Layout = route.isShowHeader ? DefaultComponent : route.isNoHome ? DefaultNoHomeComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {/* {routes.map((route)=> (
            <Route element={}></Route>
          ) )} */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
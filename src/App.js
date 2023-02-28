import { Fragment, useEffect } from "react";
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
import { setIsLoading } from "./features/auth/authSlice";
import { getAllProducts } from "./features/product/productAction";

function App() {

  const dispatch = useDispatch();
  const {loading: loadingUser} = useSelector(state=> state.auth);
  const {loading : loadingProduct} = useSelector(state=> state.product)
  useEffect(  () => {
    const { decode, access_token } = handleDecoded();
    if (decode?.id) {
      dispatch(setIsLoading(true));
       dispatch(getDetailsUser({ id: decode.id, access_token }));
      // dispatch(setIsLoading(false));
    
    }
   
    // dispatch(getAllUsers(access_token))
  }, []);

  useEffect(() => {

    const {  access_token } = handleDecoded();
    dispatch(getAllUsers(access_token));
    dispatch(getAllProducts());
  }, [loadingUser, loadingProduct])

  const handleDecoded = () => {
    let access_token = JSON.parse(localStorage.getItem("access_token"))
      ? JSON.parse(localStorage.getItem("access_token"))
      : null;
    let decode = {};
    if (access_token) {
      decode = jwt_decode(access_token);
    }
    return { decode, access_token };
  };
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decode } = handleDecoded();
      if (decode?.exp < currentTime.getTime() / 1000) {
        const data = await dispatch(refreshToken());
        config.headers["token"] = `Bearer ${data?.payload.access_token}`;
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return (
    <div className="App">
      {/* header */}
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isAdmin = route?.isAdmin;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
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

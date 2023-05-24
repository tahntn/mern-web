
import { Col, Row } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import { success as MessSuccess, error as MessError } from "../../component/MessageComponent/MessageComponent";
import jwt_decode from "jwt-decode";
import { updateUser1 } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = { email: "", password: "" };


  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess } = mutation;

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser1({ ...res?.data, access_token: token, refreshToken }))
  }

  useEffect(() => {
    if(isSuccess && data?.status !== "ERROR") {
      
     if(location?.state && data?.data?.role === "false"){
       navigate(location?.state)
       MessSuccess("Chào mừng đến trang chủ")
     } else if(data?.data?.role === "true"){
       navigate("/system/admin")
       MessSuccess("Chào mừng đến trang admin")
     } 
     else {
       navigate("/")
       MessSuccess("Chào mừng đến trang chủ")
     }
     localStorage.setItem('access_token', JSON.stringify(data?.access_token));
     localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));
     if (data?.access_token) {
       const decoded = jwt_decode(data?.access_token)
       if (decoded?.id) {
         handleGetDetailsUser(decoded?.id, data?.access_token)
       }
     }
    }
    else if(isSuccess && data?.status == "ERROR"){
        MessError(data.message)
    }
   }, [isSuccess]);
 

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: Yup.string().required("Mật khẩu không được để trống"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    mutation.mutate(values);
    setSubmitting(false);
  };


  return (
    <Row className="bg-gray-100 sm:min-h-screen xs:min-h-[65vh] items-center justify-center  ">
      <Col
        xl={8}
        lg={14}
        md={16}
        sm={20}
        xs={22}
        className="  bg-white p-8 border-gray-300 shadow-lg rounded-md"
      >
        <div className="text-center mb-10">
          <span className="lg:text-3xl sm:text-2xl xs:text-xl font-bold mb-4 ">
            ĐĂNG NHẬP
          </span>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
    
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="lg:text-xl sm:textlg xs:text-base block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="lg:text-lg sm:text-base xs:text-sm w-full border-gray-400 p-2 rounded-md "
                  style={{
                    background: "rgb(232,240,254)",
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className=" error-message lg:text-xl sm:textlg xs:text-base text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="lg:text-xl sm:textlg xs:text-base block text-gray-700 font-bold mb-2"
                >
                  Mật khẩu
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
             
                  className="lg:text-lg sm:text-base xs:text-sm w-full border-gray-400 p-2 rounded-md"
                  style={{
                    background: "rgb(232,240,254)",
                  }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className=" error-message lg:text-xl sm:textlg xs:text-base text-red-500 text-sm mt-1"
                />
              </div>
              <span className="lg:text-lg sm:text-base xs:text-sm text-gray-800 ">
                Bạn chưa có tài khoản?{" "}
                <NavLink className="font-semibold text-black " to="/signup">
                  Đăng ký ngay
                </NavLink>
              </span>
              <br />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mt-8 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
}

export default LoginPage;

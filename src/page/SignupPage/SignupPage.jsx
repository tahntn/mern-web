import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Col, Row } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { success as MessSuccess,  error as MessError } from "../../component/MessageComponent/MessageComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import * as Yup from "yup";
const SignupPage = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  
  const initialValues = { email: "", password: "", confirmPassword: "" };

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isSuccess, isError } = mutation;

  
  useEffect(() => {
    if (isSuccess && data?.status !== "ERROR") {
      MessSuccess("Đăng ký thành công");
      navigate('/login', {state })
    } else if (isSuccess && data?.status == "ERROR"){
      MessError(data?.message)
    }
  }, [isSuccess, isError]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: Yup.string().required("Mật khẩu không được để trống"),
    confirmPassword: Yup.string().required("Mật khẩu không được để trống"),
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
          ĐĂNG KÝ
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
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="lg:text-xl sm:textlg xs:text-base block text-gray-700 font-bold mb-2"
              >
                Nhập lại mật khẩu
              </label>
              <Field
                type="confirmPassword"
                id="confirmPassword"
                name="confirmPassword"
           
                className="lg:text-lg sm:text-base xs:text-sm w-full border-gray-400 p-2 rounded-md"
                style={{
                  background: "rgb(232,240,254)",
                }}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className=" error-message lg:text-xl sm:textlg xs:text-base text-red-500 text-sm mt-1"
              />
            </div>
            <span className="lg:text-lg sm:text-base xs:text-sm text-gray-800 ">
              Bạn chưa có tài khoản?{" "}
              <a className="font-semibold text-black" onClick={() => navigate("/login",  {state })}>
                Đăng nhập ngay
              </a>
            </span>
            <br />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mt-8 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </Form>
        )}
      </Formik>
    </Col>
  </Row>
  );
};

export default SignupPage;

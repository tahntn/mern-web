import { Modal } from "antd";
// import { useState } from "react";
// import ButtonComponent from "../ButtonComponent/ButtonComponent";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
// import { getDetailsUser, userLogin } from "../../features/auth/authActions";
import InputComponent from "../../component/InputComponent/InputComponent";
import jwt_decode from "jwt-decode";
import { success as MessSuccess } from "../../component/MessageComponent/MessageComponent";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser, updateUser1 } from "../../features/auth/authSlice";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";

const ModalLoginComponent = ({ handleCancel, handleOk, open }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isLoading, isSuccess } = mutation;

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

  const handleClick = () => {
    mutation.mutate({
      email,
      password,
    });
  
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    if (isSuccess && data?.status !== "ERROR") {
      if (location?.state) {
        navigate(location?.state);
      } else if(data?.data?.role === "true"){
       
        navigate("/system/admin", {state: { access_token: data?.access_token, role: data?.data?.role}})
        MessSuccess("Chào mừng đến trang admin")
      } 
      else {
        navigate("/")
        MessSuccess("Chào mừng đến trang chủ")
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
      setEmail("")
      setPassword("")
      handleOk()
    } 
  }, [isSuccess]);

  return (
    <Modal
      title={
        <div className="flex justify-center text-4xl pt-10">
          <span>Đăng nhập tài khoản</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: true,
      }}
      footer={[
        <ButtonComponent textButton={"Đăng nhập"}
        styleButton={{
          width: "50%",
          marginBottom: "30px"
        }}
        styleTextButton={{
          // fontSize: "20px",
          color: "black"
        }}
        onClick={handleClick} />,
        
      ]}
      className="login"
      width={800}
      height={500}
    >
     
        <div className="flex flex-col items-center bg-white w-1/2  pt-5 pb-4 ">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className="pt-10"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "no" }]}
            >
              <InputComponent
                style={{ marginBottom: "10px" }}
                placeholder="abc@gmail.com"
                value={email}
                onChange={handleOnchangeEmail}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "no" }]}
            >
              {/* <Input.Password value={password} onChange={handleOnchangePassword} /> */}
              <InputComponent
                placeholder="mật khẩu"
                type={password}
                value={password}
                onChange={handleOnchangePassword}
              />
            </Form.Item>

            {data?.status === "ERROR" && (
              <span style={{ color: "red" }} className="flex justify-center">{data?.message}</span>
            )}
            <Form.Item wrapperCol={{ offset: 3, span: 23 }}>
              <span>Bạn chưa có tài khoản ? </span>
              <NavLink className="text-red-500  font-semibold" to="/signup">
                Đăng ký
              </NavLink>
            </Form.Item>

            {/* <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <LoadingComponent isLoading={isLoading}>
                <ButtonComponent
                  textButton="Đăng nhập"
                  styleButton={{ width: "200px" }}
                  className=""
                  htmlType="submit"
                  onClick={handleClick}
                />
              </LoadingComponent>
            </Form.Item> */}
          </Form>
        </div>
  
    </Modal>
  );
};

export default ModalLoginComponent;

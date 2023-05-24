import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { userLogin, userSignup } from "../../features/auth/authActions";
import InputComponent from "../../component/InputComponent/InputComponent";
import { setMessage } from "../../features/auth/authSlice";
import { success as MessSuccess } from "../../component/MessageComponent/MessageComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";

const ModalSignUpComponent = ({ open, handleOk, handleCancel, handleOpenLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, userInfo, error, success, message, status } = useSelector(
    (state) => state.auth
  );
  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;
  //   console.log(mutation);

  useEffect(() => {
    if (isSuccess && data?.status !== "ERROR") {
      MessSuccess("Đăng ký thành công");
      handleOk();
      handleOpenLogin();
    }
  }, [isSuccess, isError]);

  const handleClick = () => {
    mutation.mutate({ email, password, confirmPassword });
  };
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleOnchangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  return (
    <Modal
      title={
        <div className="flex justify-center text-4xl pt-10">
          <span>Đăng ký tài khoản</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: true,
      }}
      footer={[
        <ButtonComponent
          textButton={"Đăng ký"}
          styleButton={{
            width: "50%",
            marginBottom: "30px",
          }}
          styleTextButton={{
            // fontSize: "20px",
            color: "black",
          }}
          onClick={handleClick}
        />,
      ]}
      className="login"
      width={800}
      height={500}
    >
      {/* <div
        className="bg-black"
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      > */}
        <div className="flex flex-col items-center bg-white w-1/2 ">
       
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: 400 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className="pt-10"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                style={{ marginBottom: "10px" }}
                placeholder="abc@gmail.com"
                value={email}
                onChange={handleOnchangeEmail}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                placeholder="password"
                type={password}
                value={confirmPassword}
                onChange={handleOnchangePassword}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <InputComponent
                placeholder="confirm password"
                type={password}
                value={password}
                onChange={handleOnchangeConfirmPassword}
              />
            </Form.Item>
            {/* {status === "SUCCESS" ? undefined : <p>{message}</p>} */}

            {data?.status === "ERROR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <span>Bạn đã là thành viên? </span>
              <NavLink className="text-black  font-semibold" to="/login">
                Đăng nhập
              </NavLink>
            </Form.Item>

            {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <LoadingComponent isLoading={isLoading}>
                <ButtonComponent
                  textButton="Đăng ký"
                  styleButton={{ width: "200px" }}
                  className=""
                  htmlType="submit"
                  onClick={handleClick}
                />
              </LoadingComponent>
            </Form.Item> */}
          </Form>
        </div>
      {/* </div> */}
    </Modal>
  );
};

export default ModalSignUpComponent;

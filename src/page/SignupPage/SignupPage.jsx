import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { userLogin, userSignup } from "../../features/auth/authActions";
import InputComponent from "../../component/InputComponent/InputComponent";
import { setMessage } from "../../features/auth/authSlice";
import  {success as MessSuccess} from "../../component/MessageComponent/MessageComponent";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, userInfo, error, success, message, status } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch(userSignup({ email, password, confirmPassword }));
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
  

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    } else if (status === "SUCCESS") {
      MessSuccess("Đăng ky thành công");
      navigate('/login');
      dispatch(setMessage());
    }
  }, [navigate, userInfo, message])
  return (
    <div
      className="bg-black"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col items-center bg-white w-1/2 ">
        <p className="text-2xl font-semibold my-10">Sign up</p>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: 400 }}
          initialValues={{ remember: true }}
          autoComplete="off"
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
            rules={[{ required: true, message: "Please input your password!" }]}
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
            rules={[{ required: true, message: "Please input your password!" }]}
          >
           
            <InputComponent
              placeholder="confirm password"
              type={password}
              value={password}
              onChange={handleOnchangeConfirmPassword}
            />
          </Form.Item>
          {status === "SUCCESS" ? undefined : <p>{message}</p>}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <span>Bạn đã là thành viên? </span>
            <NavLink className="text-black  font-semibold" to="/login">
              Đăng nhập
            </NavLink>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <ButtonComponent
              textButton="Đăng ký"
              styleButton={{ width: "200px" }}
              className=""
              htmlType="submit"
              onClick={handleClick}
            />
       
          </Form.Item>
         
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;

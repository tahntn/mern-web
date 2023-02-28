import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { getDetailsUser, userLogin } from "../../features/auth/authActions";
import InputComponent from "../../component/InputComponent/InputComponent";
import jwt_decode from "jwt-decode";
import  {success as MessSuccess} from "../../component/MessageComponent/MessageComponent";
const LoginPage = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { loading, userInfo, userToken,error, success, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleClick = () => { 
    dispatch(userLogin({email, password}))
  }
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value)

  }
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value)
  }
  useEffect(() => {
    if (userInfo) {
      MessSuccess("Đăng nhập thành công");
      navigate('/');
    }
  }, [navigate, userInfo])

  useEffect(()=> {
  
      if(userToken){
        localStorage.setItem('access_token', JSON.stringify(userToken))
        const decode = jwt_decode(userToken);
        dispatch(getDetailsUser( {id:decode.id,access_token: userToken}))
      }
 
  }, [userToken])

  return (
    <div
      className="bg-blue-500"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col items-center bg-white w-1/2  ">
        <p className="text-2xl font-semibold my-10">Login</p>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
           
            rules={[{ required: true, message: message }]}
          >
            
            <InputComponent style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message:message }]}
          >
            {/* <Input.Password value={password} onChange={handleOnchangePassword} /> */}
            <InputComponent
              placeholder="password"
              type={password}
              value={password}
              onChange={handleOnchangePassword}
            />
          </Form.Item>
          {message === "SUCCESS" ? undefined : <p>{message}</p>}


          <Form.Item wrapperCol={{ offset: 3, span: 23 }}>
            <span>Bạn đã là thành viên ? </span>
            <NavLink className="text-black  font-semibold" to="/signup">
              Đăng ký
            </NavLink>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <ButtonComponent
              textButton="Đăng nhập"
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

export default LoginPage;

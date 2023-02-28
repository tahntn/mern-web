import { useEffect, useRef, useState } from "react";
import InputComponent from "../../component/InputComponent/InputComponent";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { Button, Col, Form, Input, Row, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import { getDetailsUser, updateUser } from "../../features/auth/authActions";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import "./index.scss";
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, userToken, status, loading } = useSelector(
    (state) => state.auth
  );
  console.log(userInfo?.avatar);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [avatar, setAvatar] = useState("");

  // setForm();
  useEffect(() => {
    setEmail(userInfo?.email);
    setName(userInfo?.name);
    setPhone(userInfo?.phone);
    setAvatar(userInfo?.avatar);
  }, [userInfo, isLoading]);

  useEffect(() => {
    dispatch(
      getDetailsUser({
        id: userInfo?._id,
        access_token: userInfo?.access_token,
      })
    );
  }, [loading]);

  const handleOnchangeEmail = (e) => {};
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeAdress = () => {};
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };
  const handleUpdate = () => {
    dispatch(
      updateUser({
        id: userInfo?._id,
        data: { name, email, phone, avatar },
        access_token: userToken,
      })
    );
  };
  return (
    <div className="w-full profile m-15">
      <LoadingComponent isLoading={isLoading}>
        {userInfo?.email ? (
          <div className="flex flex-col items-center">
            <p className="text-4xl py-20 font-semibold">Thông tin cá nhân</p>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 900, minWidth: 800 }}
              autoComplete="off"
            >
              <Row className="flex ">
                <Col span={12}>
                  <div className="flex items-center mb-5">
                    <label htmlFor="emai" className="w-14">
                      Email
                    </label>
                    <InputComponent
                      disabled={true}
                      style={{ marginLeft: "10px" }}
                      value={email}
                      id="email"
                      onChange={handleOnchangeEmail}
                      className="text-black"
                    />
                  </div>
                  <div className="flex items-center mb-5">
                    <label htmlFor="name" className="w-14">
                      Name{" "}
                    </label>
                    <InputComponent
                      style={{ marginLeft: "10px" }}
                      id="name"
                      value={name}
                      onChange={handleOnchangeName}
                    />
                  </div>
                  <div className="flex items-center mb-5">
                    <label htmlFor="phone" className="w-14">
                      Phone{" "}
                    </label>
                    <InputComponent
                      style={{ marginLeft: "10px" }}
                      id="phone"
                      value={phone}
                      onChange={handleOnchangePhone}
                    />
                  </div>
                  <div className="flex items-center mb-5">
                    <label htmlFor="adress" className="w-14">
                      Address
                    </label>
                    <InputComponent
                      style={{ marginLeft: "10px" }}
                      id="adress"
                      value={adress}
                      onChange={handleOnchangeAdress}
                    />
                  </div>
                </Col>
                <Col span={6} offset={2}>
                  <div style={{ width: "200px", border: "2px black solid", borderRadius: "10px", padding: "10px" }} className="mb-3">
                  {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                   
                  ) : (
                    <UserOutlined 
                      className="Profile--User"
                      style={{ fontSize: "20px", color: "black", width: "100%" }}
                    />
                  )}
                   </div>
                  <Upload onChange={handleOnchangeAvatar} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Col>
            
              </Row>

              <div className="my-10 flex items-center">
                {status ? <span>{status}</span> : undefined}
                <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  styleButton={{
                    height: "45px",
                    width: "fit-content",
                    borderRadius: "4px",
                    padding: "10px 90px",
                  }}
                  textButton={"Cập nhật"}
                  styleTextButton={{
                    color: "rgb(26, 148, 255)",
                    fontSize: "30px",
                    fontWeight: "700",
                  }}
                ></ButtonComponent>
              </div>
            </Form>
          </div>
        ) : (
          <div>VUI LONG DANG NHAP</div>
        )}
      </LoadingComponent>
    </div>
  );
};

export default ProfilePage;

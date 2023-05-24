import { useEffect, useRef, useState } from "react";
import InputComponent from "../../component/InputComponent/InputComponent";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../component/LoadingComponent/LoadingComponent";
import { getDetailsUser, updateUser } from "../../features/auth/authActions";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import * as UserService from "../../service/UserService";
import {
  success as MessSuccess,
  error as MessError,
} from "../../component/MessageComponent/MessageComponent";
import "./index.scss";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser1 } from "../../features/auth/authSlice";
import axios from "axios";
import BreadcrumbComponent from "../../component/BreadcrumbComponent/BreadcrumbComponent";
const ProfilePage = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [ward, setWard] = useState();

  const [isEditAddress, setIsEditAddress] = useState(false);

  const [dataCity, setDataCity] = useState([]);
  const [indexCity, setIndexCity] = useState(1);
  const [indexDistrict, setIndexDistrict] = useState(1);

  const user = useSelector((state) => state.auth);

  const mutation = useMutationHooks(
    ({
      id,
      email,
      name,
      phone,
      address_city,
      address_district,
      address_wards,
      address_street,
      indexCity,
      indexDistrict,
      avatar,
      access_token,
    }) =>
      UserService.updateUser(
        id,
        {
          name,
          phone,
          address_city,
          address_district,
          address_wards,
          address_street,
          indexCity,
          indexDistrict,
          avatar,
        },
        access_token
      )
  );
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAvatar(user?.avatar);
    setStreet(user?.street);
    setCity(user?.city);
    setDistrict(user?.district);
    setWard(user?.ward);
    setIndexCity(user?.indexCity);
    setIndexDistrict(user?.indexDistrict);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      MessSuccess("Cập nhật thành công");
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      MessError("Cập nhật không thành công");
    }
  }, [isSuccess, isError, isLoading]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser1({ ...res?.data, access_token: token }));
  };

  const handleOnchangeEmail = (e) => {};
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeStreet = (e) => {
    setStreet(e.target.value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address_city: dataCity[indexCity]?.name,
      address_district: dataCity[indexCity]?.districts[indexDistrict].name,
      address_wards: ward,
      address_street: street,
      avatar,
      access_token: user?.access_token,
      indexCity,
      indexDistrict,
    });
    setIsEditAddress(false)
  };

  useEffect(() => {
    const getCity = async () => {
      const req = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      setDataCity(req.data);
    };

    getCity();
  }, []);

  const handleChangeCity = (value, name) => {
    // console.log(name);
    setIndexCity(value);
    // setCity(dataCity[indexCity]?.name)
  };

  const handleChangeDistricts = (value) => {
    setIndexDistrict(value);
  };
  const handleChangeWard = (value) => {
    setWard(value);
  };
  console.log("city", name, email, indexCity);
  return (
    <div className="spacingPage profile ">
      <BreadcrumbComponent
        title={"Thông tin cá nhân"}
      />
      <LoadingComponent isLoading={isLoading}>
        {user?.email ? (
          <div className="flex flex-col items-center">
            <span className="text-5xl pb-20 font-semibold">Thông tin cá nhân</span>
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

                  {!isEditAddress ? (
                    <>
                      <div className="flex items-center mb-5">
                        <label htmlFor="address" className="w-14">
                          Address
                        </label>
                        <InputComponent
                          style={{ marginLeft: "10px" }}
                          id="adress"
                          value={city && district && ward &&  city + ", " + district + ", " + ward+", "+street}
                          // onChange={handleOnchangeStreet}
                        />
                      </div>
                      <ButtonComponent
                        textButton={"Sửa địa chỉ"}
                        onClick={()=>setIsEditAddress(true)}
                      />
                    </>
                  ) : (
                    <>
                      {/* //city */}
                      <div className="flex items-center mb-5">
                        <label htmlFor="city" className="w-14">
                          City
                        </label>

                        <Select
                          name="city"
                          // defaultValue={Number(indexCity)}
                          // loading={city? false : true}
                          onChange={handleChangeCity}
                          style={{
                            width: 220,
                          }}
                        >
                          {dataCity?.map((item, index) => (
                            <Select.Option key={item.code} value={index}>
                              {item?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                      {/* District */}

                      <div className="flex items-center mb-5">
                        <label htmlFor="districts" className="w-14">
                          Districts
                        </label>

                        <Select
                          name="districts"
                          // defaultValue={8}
                          onChange={handleChangeDistricts}
                          style={{
                            width: 220,
                          }}
                        >
                          {dataCity[indexCity]?.districts?.map(
                            (item, index) => (
                              <Select.Option key={item.code} value={index}>
                                {item?.name}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </div>
                      {/* ward */}
                      <div className="flex items-center mb-5">
                        <label htmlFor="wards" className="w-14">
                          Wards
                        </label>

                        <Select
                          name="wards"
                          // defaultValue={}
                          onChange={handleChangeWard}
                          style={{
                            width: 220,
                          }}
                        >
                          {dataCity[indexCity]?.districts[
                            indexDistrict
                          ]?.wards.map((item, index) => (
                            <Select.Option key={item.code} value={item.name}>
                              {item?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                      <div className="flex items-center mb-5">
                    <label htmlFor="street" className="w-14">
                      Street
                    </label>
                    <InputComponent
                      style={{ marginLeft: "10px" }}
                      id="street"
                      value={street}
                      onChange={handleOnchangeStreet}
                    />
                  </div>
                    </>
                  )}
                  
                </Col>
                <Col span={6} offset={2}>
                  <div
                    style={{
                      width: "200px",
                      border: "2px black solid",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                    className="mb-3"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <UserOutlined
                        className="Profile--User"
                        style={{
                          fontSize: "20px",
                          color: "black",
                          width: "100%",
                        }}
                      />
                    )}
                  </div>
                  <Upload onChange={handleOnchangeAvatar} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Col>
              </Row>

              <div className="my-10 flex items-center">
                <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  styleButton={{
                    height: "45px",
                    width: "fit-content",
                    borderRadius: "4px",
                    // padding: "10px 90px",
                  }}
                  textButton={"Cập nhật"}
                  styleTextButton={{
                    color: "black",
                    fontSize: "20px",
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

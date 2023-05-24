import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";

const { Option } = Select;

const PersonalInfoSchema = Yup.object().shape({
  name: Yup.string().required("Họ và tên không được để trống"),
  city: Yup.string().required("Tỉnh/thành phố không được để trống"),
  district: Yup.string().required("Quận/huyện không được để trống"),
  ward: Yup.string().required("Xã/phường không được để trống"),
});

const TestPage = () => {
  const [tinh_tp, setTinhTp] = useState([]);
  const [quan_huyen, setQuanHuyen] = useState([]);
  const [xa_phuong, setXaPhuong] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      setTinhTp(response.data);
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      city: "",
      district: "",
      ward: "",
    },
    validationSchema: PersonalInfoSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleCityChange = async (value) => {
    formik.setFieldValue("city", value);
    formik.setFieldValue("district", "");
    formik.setFieldValue("ward", "");

    const selectedCity = tinh_tp.find((item) => item.name === value);
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`
    );
    setQuanHuyen(response.data);
  };

  const handleDistrictChange = async (value) => {
    formik.setFieldValue("district", value);
    formik.setFieldValue("ward", "");

    const selectedDistrict = quan_huyen?.find((item) => item.name === value);
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=1`
    );
    setXaPhuong(response.data);
  };

  return (
    <Form onFinish={formik.handleSubmit}>
      <Form.Item
        label="Họ và tên"
        validateStatus={formik.errors.name ? "error" : ""}
        help={formik.errors.name}
      >
        <Input
          name="name"
          placeholder="Nhập họ và tên của bạn"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </Form.Item>

      <Form.Item
        label="Tỉnh/thành phố"
        validateStatus={formik.errors.city ? "error" : ""}
        help={formik.errors.city}
      >
        <Select
          placeholder="Chọn tỉnh/thành phố"
          onChange={handleCityChange}
          value={formik.values.city}
        >
          {tinh_tp.map((item) => (
            <Option key={item.code} value={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Quận/huyện"
        validateStatus={formik.errors.district ? "error" : ""}
        help={formik.errors.district}
      >
        <Select
          placeholder="Chọn quận/huyện"
          onChange={handleDistrictChange}
          value={formik.values.district}
          disabled={!formik.values.city}
        >
          {quan_huyen?.map((item) => (
            <Option key={item.name} value={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Xã/phường"
        validateStatus={formik.errors.ward ? "error" : ""}
        help={formik.errors.ward}
      >
        <Select
          placeholder="Chọn xã/phường"
          onChange={(value) => formik.setFieldValue("ward", value)}
          value={formik.values.ward}
          disabled={!formik.values.district}
        >
          {xa_phuong?.map((item) => (
            <Option key={item.name} value={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <button className="btn-submit" type="submit">
          Submit
        </button>
      </Form.Item>
    </Form>
  );
};

export default TestPage;

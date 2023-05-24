import { useEffect, useState } from "react";
import * as CategoryService from "../../service/CategoryService";
import { Checkbox, Slider, Radio, Rate, Drawer } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { setFilterProduct } from "../../features/product/productSlice";
import { searchProduct } from "../../features/product/productSlice";

const DrawerCategoryComponent = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.product.search);
  const products = useSelector((state) => state.product.allProducts);
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState();
  const [rate, setRate] = useState();
  const [selectCategories, setSelectCategories] = useState([]);
  const [price, setPrice] = useState([0, 1200000]);
  const [gender, setGender] = useState([]);
  const mark = {
    400000: "400.000 VND",
    800000: "800.000 VND",
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchAllCategoies = async () => {
      const res = await CategoryService.getAllCategory();
      const newRes = res?.data?.map((item) => item.name);
      setCategories(newRes);
    };
    fetchAllCategoies();
  }, []);

  const formatter = (value) => `${value.toLocaleString()} VND`;

  const onChangeCategory = (checkedValues) => {
    setSelectCategories(checkedValues);
  };

  const onChangeRate = (e) => {
    setRate(e.target.value);
  };

  const onChangePrice = (value) => {
    setPrice(value);
    // handleChangePage();
  };

  const onChangeGender = (checkedValues) => {
    setGender(checkedValues);
  };

  const applyFilters = () => {
    let updatedList = products;

    //filter category
    if (selectCategories?.length > 0) {
      updatedList = updatedList?.filter((item) =>
        selectCategories.includes(item.type)
      );
    }
    //filter price
    const minPrice = price[0];
    const maxPrice = price[1];
    updatedList = updatedList?.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

    //filter rate
    if (rate) {
      updatedList = updatedList.filter(
        (item) => parseInt(item.totalrating) === parseInt(rate)
      );
    }

    //filter gender
    if (gender?.length > 0) {
      updatedList = updatedList?.filter((item) => gender.includes(item.gender));
    }

    //search
    if (searchInput) {
      // console.log(searchInput);
      updatedList = updatedList.filter((item) => {
        //  console.log( item?.name?.toLowerCase().search(searchInput?.toLowerCase()?.trim()) );
        return (
          item?.name
            ?.toLowerCase()
            .search(searchInput?.toLowerCase()?.trim()) !== -1
        );
      });
    }
    dispatch(setFilterProduct(updatedList));
  };

  useEffect(() => {
    applyFilters();
  }, [selectCategories, rate, price, gender, searchInput]);

  const onClickReset = () => {
    setSelectCategories([]);
    setGender([]);
    setPrice([0, 1200000]);
    setRate(0);
    dispatch(searchProduct(""));
  };

  const styleH1 = {
    color: "#212529",
    fontWeight: "500",
    // fontFamily: "Ubuntu",
    fontFamily: "Roboto Slab",
    marginLeft: "10px",
  };

  const styleDiv = {
    borderBottom: " 1px solid #ccc",
    padding: "20px 0px",
  };
  return (
    <Drawer title="Danh mục sản phẩm" open={open} onClose={onClose} placement="left">
      <div className="category-comp bg-white rounded-xl p-3">
        <div className="flex justify-center">
          <ButtonComponent
            textButton={"Xóa tất cả"}
            onClick={onClickReset}
            className="w-9/12"
          />
        </div>
        <div style={styleDiv}>
          {/* <h5 className="text-2xl " style={styleH1}>
            Danh mục sản phẩm{" "}
          </h5> */}
          <div style={{}}>
            <Checkbox.Group
              options={categories}
              value={selectCategories}
              className="flex flex-col font-normal text-2xl capitalize"
              onChange={onChangeCategory}
            ></Checkbox.Group>
          </div>
        </div>
        <div style={{ marginBottom: "40px" }} style={styleDiv}>
          <h5 className="text-2xl " style={styleH1}>
            Giá
          </h5>
          <Slider
            range
            defaultValue={[0, 1200000]}
            value={price}
            tooltip={{
              formatter,
            }}
            marks={mark}
            max={1200000}
            className="m-2.5"
            onChange={onChangePrice}
          />
        </div>
        <div style={styleDiv}>
          <h5 className="text-2xl " style={styleH1}>
            Đánh giá sản phẩm
          </h5>
          <Radio.Group
            onChange={onChangeRate}
            value={rate}
            className="flex flex-col-reverse"
          >
            <Radio value={1}>
              <Rate disabled defaultValue={1} style={{ fontSize: "16px" }} />
            </Radio>
            <Radio value={2}>
              <Rate disabled defaultValue={2} style={{ fontSize: "16px" }} />
            </Radio>
            <Radio value={3}>
              <Rate disabled defaultValue={3} style={{ fontSize: "16px" }} />
            </Radio>
            <Radio value={4}>
              <Rate disabled defaultValue={4} style={{ fontSize: "16px" }} />
            </Radio>
            <Radio value={5}>
              <Rate disabled defaultValue={5} style={{ fontSize: "16px" }} />
            </Radio>
          </Radio.Group>
        </div>
        <div style={{ paddingTop: "20px" }}>
          <h5 className="text-2xl " style={styleH1}>
            Dành cho
          </h5>
          <Checkbox.Group
            onChange={onChangeGender}
            value={gender}
            className="flex flex-col"
          >
            <Checkbox value="male">Nam</Checkbox>
            <Checkbox value="female">Nữ</Checkbox>
          </Checkbox.Group>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerCategoryComponent;

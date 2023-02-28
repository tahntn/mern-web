import { Checkbox, Rate, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { gender } from "../../assets/data";

const SidebarComponent = () => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllCategory = async () => {
    
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category/get-alls-category`
    );
 
    setCategory(res.data.data);
    
  };
  useEffect(() => {
    setIsLoading(true);
    getAllCategory();
    setIsLoading(false);
  }, []);


  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return (
          <div className="flex flex-col">
            {options.map((option) => {
              return <span key={option.name}>{option.name}</span>;
            })}
          </div>
        );
      case "checkbox":
        return (
          <Checkbox.Group className="flex flex-col w-ful">
            {options.map((option) => {
              return (
                <Checkbox value={option.name} key={option.id}>
                  {option.name}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            <div style={{ dispaly: "flex" }} key={option}>
              <Rate
                style={{ fontSize: "12px" }}
                disabled
                defaultValue={option}
              />
              <span> {`tu ${option}  sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option) => {
          return <div key={option}>{option}</div>;
        });
      default:
        return (<></>);
    }
  };

  return (
    <div>
      {isLoading ? (<LoadingComponent isLoading={isLoading} />) : (
        <>
        <Row>
          <label className="text-black">Danh mục sản phẩm</label>
          {renderContent("checkbox", category)}
        </Row>
        <div>
          <label className="text-black">Dành cho</label>
          {renderContent("checkbox", gender)}
        </div>
        <div>
         <label className="text-black">Dành cho</label>
        </div>
        </>

)}
</div>
  );
};

export default SidebarComponent;

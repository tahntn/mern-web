import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined, GoldOutlined,ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const BreadcrumbComponent = ({ title, titleSecond }) => {
    const navigate =  useNavigate();
    let render, href;
  switch (title) {
    case "Category":
      render = <GoldOutlined  style={{
        fontSize: "20px"
      }}/>;
      break;
    case "User Profile":
      render = <UserOutlined style={{
        fontSize: "20px"
      }} />;
      break;
    case "Order":
      render = <ShoppingCartOutlined style={{
        fontSize: "20px"
      }} />;
      break;
      case "Order":
      render = <ShoppingCartOutlined style={{
        fontSize: "20px"
      }} />;
      break;

    default:
      break;
  }
  if(titleSecond) {
    switch (title) {
        case "Category":
          href = "/category";
          break;
        case "User Profile":
          render = <UserOutlined style={{
            fontSize: "20px"
          }} />;
          break;
        case "Order":
          render = <ShoppingCartOutlined  
          style={{
          fontSize: "20px"
        }}/>;
          break;
    
        default:
          break;
      }
  }
 

  return (
    <Breadcrumb className="pb-10 text-black font-medium">
      <Breadcrumb.Item
         onClick={()=> navigate("/")}
       className="cursor-pointer text-xl "
      >
        <HomeOutlined style={{
          fontSize: "20px"
        }} />
        <span className="pl-2">Home</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item
        onClick={()=> navigate(href)}
        style={ href &&{ cursor: "pointer"}}
        className="text-xl"
     >
        {render}
        <span className="pl-2">{title}</span>
      </Breadcrumb.Item>
      {titleSecond && <Breadcrumb.Item
        className="text-xl"
      >
        {/* {renderSecond} */}
        {titleSecond}
      </Breadcrumb.Item>}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;

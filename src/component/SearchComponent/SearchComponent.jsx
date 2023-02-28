import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import "./SearchComponent.scss";

const SeacrhComponent = (props) => {
  const { width, textColor, styleDiv, onChange,onClick, ...rest }= props;

  return (
    <div
      className={
        textColor
          ? "border-b-2 border-current pb-2 text-black flex"
          : "border-b-2 pb-2 text-white flex"
      }
      style={{ ...styleDiv }}
    >
      <input
        className={
          textColor
            ? "placeholder-current text-black text-base bg-transparent pl-2 w-full"
            : "placeholder-white text-white text-base bg-transparent pl-2 w-full"
        }
        placeholder="Tìm kiếm ... "
       {...props}
      />
      <div>
        <Button type="link" onClick={onClick}>
          <SearchOutlined
            style={{ fontSize: "20px" }}
            className={textColor ? "text-black" : "text-white"}
          />
        </Button>
      </div>
    </div>
  );
};

export default SeacrhComponent;

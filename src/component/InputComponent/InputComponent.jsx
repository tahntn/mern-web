
import { Input } from "antd";

const InputComponent = ({ disabled,size, placeholder, bordered, style,value, ...rests }) => {
  
  return (
    <Input
    disabled={disabled}
      className="placeholder-black"
      size={size}
      placeholder={placeholder}
      bordered={bordered}
      style={style}
      value={value}
      {...rests}
    />
  );
};

export default InputComponent;

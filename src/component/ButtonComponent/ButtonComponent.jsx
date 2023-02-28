import { Button } from "antd";
import React from "react";

const ButtonComponent = ({size, styleButton, styleTextButton,textButton,disabled, ...rests}) => {
  return (
    <Button
    style={{
      ...styleButton,
 
      
    }}
      size={size}
      {...rests}

    
    >
      {textButton}
    </Button>
  );
};

export default ButtonComponent;
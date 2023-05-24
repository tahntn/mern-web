import { Result } from "antd";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate =  useNavigate();
    return (<Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang của bạn tìm kiếm không tồn tại"
        extra={<ButtonComponent
            textButton={"Quay lại trang chủ"}
            onClick = {() => navigate("/")}
        />}
      />)
}

export default ErrorPage;
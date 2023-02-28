import { useNavigate } from 'react-router-dom'
import { StarOutlined, StarFilled, } from '@ant-design/icons';
import { Card } from 'antd';

const CardComponent = (props) => {
    const navigate = useNavigate();
    const { name, price, id, image, description } = props;
    const handelClickProduct = () => {
        navigate(`/product-detail/${id}`);
    }
    return (
        <Card
            hoverable
            // cover={<img alt="example" src={image[0] ?  image[0] : undefined } />}
            onClick={handelClickProduct}
        >
            
            <div>
                <h3>{name}</h3>
                <span>
                    {/* <s>${price}</s> */}
                    <span>{description}</span>
                </span>
                <div>
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarOutlined />
         
                </div>
            </div>
        </Card>
    )
}

export default CardComponent;
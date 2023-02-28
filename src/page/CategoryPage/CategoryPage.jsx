import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "antd";
import SidebarComponent from "../../component/SidebarComponent/SidebarComponent";
import { useDispatch,useSelector } from "react-redux";
import axios from "axios";
import CardComponent from "../../component/CardComponent/CardComponent";
import { useHistory} from "react-router-dom"

const CategoryPage = () => {

    const {searchProduct, allProducts, resultProduct } = useSelector((state) => state.product)
    const [products, setProducts] = useState([]);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })

    
    // const getProducts = async() => {
    //   const res = await axios.get(
    //     `${process.env.REACT_APP_API_URL}/product/get-alls-product?filter=name&filter=${searchProduct}`
    //   );
    //   console.log(res.data.data);
    //   setProducts(res.data.data)
    // }

    useEffect(()=> {
      if(resultProduct) {
        setProducts(resultProduct)
       
      }
      else{
        setProducts(allProducts)
      }
    }, [allProducts, resultProduct])
    console.log(products);


    const onChange =() => {

    }
  return (
    <div className="p-5">
      <Row>
        <Col span={4}>
          <SidebarComponent/>
        </Col >
        <Col span={20}>
            <Row>
                {products?.map(product=> (
                  <Col span={5} key={product._id}>
                  <CardComponent 
                    
                    id={product._id}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                  />
                  </Col>
                ))}
            </Row>
            <Pagination 
                defaultCurrent={panigate.page + 1}
                total={panigate?.total}
                onChange={onChange}
            />
        </Col>
      </Row>
    </div>
  );
};

export default CategoryPage;

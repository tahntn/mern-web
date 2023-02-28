import { Col, Row } from "antd";
import CardComponent from "../CardComponent/CardComponent";

const NewArrivalsComponent =() =>{
    return (
        <div style={{margin:'50px'}}>
             <p style={{textAlign:" center",fontSize: "56px", margin: "60px 0px"}}>NEW ARRIVALS</p>
             <Row>
                
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>

                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col><Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col><Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>
                <Col span={4} className="px-1">
                    <CardComponent/>
                </Col>

             </Row>
        </div>
    )
}
export default NewArrivalsComponent;
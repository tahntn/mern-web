import { Col, Row } from "antd";

const AboutPage = () => {
    return (
        <div className="spacingPage">
            <Row>
                <Col span={4}>
                    <div
                        style={{
                            width: "50%",
                            borderTop: "solid 1px #495057",
                            marginTop: "20px"
                        }}
                    ></div>
                </Col>
                <Col span={12} >
                    <h6 
                        className="uppercase  text-yellow-500 text-xl font-normal"
                    >Về chúng tôi</h6>
                    <h1 className="text-7xl py-10 font-bold">Chúng tôi là NO</h1>
                    <p
                    className="text-lg"
                    style={{
                        color: "#868e96"
                    }}>NO là nhà bán lẻ điện tử thời trang và phong cách sống toàn cầu cam kết làm cho vẻ đẹp của thời trang có thể tiếp cận được với tất cả mọi người. Chúng tôi sử dụng công nghệ sản xuất theo yêu cầu để kết nối các nhà cung cấp với chuỗi cung ứng linh hoạt của chúng tôi, giảm lãng phí hàng tồn kho và cho phép chúng tôi cung cấp nhiều loại sản phẩm giá cả phải chăng cho khách hàng trên khắp thế giới. Từ các văn phòng toàn cầu của mình, chúng tôi tiếp cận khách hàng tại hơn 150 quốc gia. Để tìm hiểu thêm về NO, hãy truy cập NO</p>
                </Col>
            </Row>
            <Row className="mt-10">
            <Col span={4}>
                    <div
                        style={{
                            width: "50%",
                            borderTop: "solid 1px #495057",
                            marginTop: "20px"
                        }}
                    ></div>
                </Col>
                <Col span={12}>
                    <h6 
                        className="uppercase  text-yellow-500 text-xl font-normal"
                    >Lịch sử</h6>
                    <h1 className="text-7xl py-10 font-bold">Lịch sử của NO</h1>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                        <img src="https://d19m59y37dris4.cloudfront.net/varkala/2-1/img/photo/raoul-ortega-2JtF6pYAOOI-unsplash.jpg" alt="history"/>
                </Col>
                <Col span={10} offset={3} className="flex items-center  ">
                    <div>
                        <h6 className="uppercase text-xl" style={{
                            color: "#868e96 "
                        }}>Bắt đầu đơn giản</h6>
                        <h2 className="text-2xl font-bold text-black">Chúng tôi bắt đầu với một ít</h2>
                   
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="flex items-center  ">
                <div>
                        <h6 className="uppercase text-xl" style={{
                            color: "#868e96 "
                        }}>NO hiện nay</h6>
                        <h2 className="text-2xl font-bold text-black">Và chúng tôi đang dần hoàn thiện</h2>
                   
                    </div>
                </Col>
                <Col span={8} offset={3}>
                    <img src="https://d19m59y37dris4.cloudfront.net/varkala/2-1/img/photo/clark-street-mercantile-P3pI6xzovu0-unsplash.jpg" alt="today" />
                </Col>
            </Row>


        </div>
    )
}

export default AboutPage;

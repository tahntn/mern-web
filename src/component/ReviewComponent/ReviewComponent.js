import { useState } from "react";
import usePagination from "../../hooks/usePagination";
import { Row, Pagination, Rate, Image, Col } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import Moment from "react-moment";

import "./index.scss";
const ReviewComponent = ({ reviews }) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const count = Math.ceil(reviews.length / PER_PAGE);
  // console.log(reviews.reverse())
  const DATA = usePagination(reviews, PER_PAGE);

  const handleChange = (e, p) => {
    console.log("e, p", e, p);
    setPage(e);
    DATA.jump(e);
  };

  return (
    <>
      <Col
        className="reviews p-3 mt-10"
        style={{
          boxShadow: "0 1px 1px 0 rgba(0,0,0,.05)",
          backgroundColor: "#fff",
        }}
      >
        <div>
          <h1 className="xl:text-3xl lg:text-2xl sm:text-xl xs:text-xl font-medium">Đánh giá sản phẩm</h1>
          {reviews.length > 0 ? (<>
            <div>
            <h2 className="text-xl mt-5">
              <span className="font-bold">{reviews.length}</span>
              {"           "}bình luận
            </h2>
          </div>
          <>
          <Col className="" style={{ background: "rgb(246 247 248)" }}>
            {DATA.currentData().map((review, index) => (
              <Row key={index} className="my-7 p-5 flex items-start">
                <Col
                  // style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                  // xs={2}
                  // sm={2}
                  className="xs:w-8 xs:h-8 xl:w-20 xl:h-20 md:w-20 md:h-20  sm:w-12 sm:h-12 xs:mt-2 sm:mt-1 md:mt-0"

                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                    className="flex items-center justify-center"
                  >
                      <img
                        src={review?.avatar ? review?.avatar : "https://ik.imagekit.io/gmltgojm2/4/avatar.png?updatedAt=1679846199635"}
                        alt={review?.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "6px",
                          borderRadius: "50%",
                          border: "1px solid #9999993d"
                        }}
                      />
                      </div>
                </Col>

                <Col md={18} sm={16} xs={16} offset={1} className="sm:ml-6 md:ml-3 xs:ml-6">
                  <div className="flex md:items-center md:justify-between sm:flex-col md:flex-row xs:flex-col">
                    <div className="flex items-center xs:flex-col xs:items-start">
                      <h2 className="md:text-xl sm:text-lg  xs:text-base  font-bold">{review?.name}</h2>
                      <Moment
                        format="DD-MM-YYYY HH:mm"
                        className="md:text-lg sm:text-base xs:text-sm sm:ml-3"
                      >
                        {review?.time}
                      </Moment>
                    </div>
                    <div>
                      <Rate
                        disabled
                        className="sm:text-lg xs:text-sm"
                        // style={{ fontSize: "18px" }}
                        defaultValue={review?.star}
                        value={review?.star}
                      />
                    </div>
                  </div>
                  <h3
                    className="md:text-lg sm:text-base xs:text-sm font-medium mt-3 text-justify"
                    style={{ color: "#868e96" }}
                  >
                    {review?.reviews}
                  </h3>
                </Col>
              </Row>
            ))}
          </Col>
          <Row className="">
            <Pagination
              total={count}
              pageSize={1}
              // count={count}
              // page={page}
              // variant="outlined"
              // shape="rounded"
              onChange={handleChange}
              // size='large'
            />
          </Row>
        </>
          </>) : <div>
                        <h2 className="text-lg mt-5">
                        Chưa có đánh giá về sản phẩm này
                        </h2>
            </div> }
       
        </div>
      
      </Col>
    </>
  );
};

export default ReviewComponent;

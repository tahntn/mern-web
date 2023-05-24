import { useEffect } from "react";
import { Row, Col } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import Aos from "aos";
import "./index.scss";
import "aos/dist/aos.css";
const FeaturedComponent = ({ featured }) => {
  useEffect(() => {
    Aos.init();
  }, []);
  const navigate = useNavigate();
  const handleClick = (text) => {
    navigate("/category", { state: text });
    window.scrollTo(0, 0);
  };

  return (
    <div className="featured spacingPage">
      <p
        style={{ textAlign: " center", margin: "60px 0px" }}
        data-aos="zoom-in"
        className="lg:text-5xl sm:text-3xl xs:text-2xl"
      >
        NỔI BẬT HÔM NAY
      </p>
      <Row className="flex">
        {featured.map((item) => {
          return (
            <Col
              key={item.id}
              span={item.span}
              data-aos={item.aos}
              className="featured-item p-2"
              style={{ padding: "0px 5px", margin: "5px 0px" }}
              onClick={() => handleClick(item.title)}
            >
              <NavLink>
                <div className="featured-banner lg:h-96 md:h-72 sm:h-48 xs:h-36 ">
                  <img
                    src={item.color}
                    alt={item.title}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="featured-banner__title">
                    <p className="lg:text-2xl md:text-lg sm:text-base xs:text-sm">{item.text}</p>
                    <h2 className="lg:text-xl md:text-base sm:text-sm xs:text-xs">{item.title}</h2>
                  </div>
                  <div className="featured-banner__image">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              </NavLink>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default FeaturedComponent;

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,  Navigation, Pagination } from "swiper";
import {NavLink} from 'react-router-dom';

import "swiper/css";
import "swiper/css/pagination";

import "swiper/css/navigation";
import './index.scss';
import { Col, Row } from "antd";

const SliderComponent = ({sliders, ...rest}) => {
  return (
    <>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          // disableOnInteraction: false,
        }}
        speed={2500}
        loop={true}
        pagination={{
          dynamicBullets: true,
        }}
        // navigation={true}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper "
        style={{
          height: "80vh",
          minHeight: "600px"
        }}
      >
        {sliders.map(slider => (
            <SwiperSlide key={slider.id} className="h-full">
                <Row 
                  className="slider-wrapper h-full object-fill" 
                >
                    <div >
                        <img src={slider.slider} alt={slider.title} className={
                          slider?.id === 0 ? "object-cover object-right" : slider?.id === 3 ? "object-cover object-left":   "object-cover"
                        } style={{width: "100%", height: "100%",}}/>
                    </div>
                    <Row className="slider-main w-full">
                      <Col offset={slider.offset} style={slider?.id === 1 && {
                        textAlign: "center"
                      }}>
                        {slider?.id === 1 && <>
                          <br/>
                          <br/>
                          <br/>
                        </> }
                        <span 
                          style={{
                            color: "#212529"
                          }}
                          className="font-bold text-4xl"
                        > {slider.title}</span>
                        <br/>
                        <br/>
                        <span
                        style={{
                          color: "#212529",
                          padding: "10px 0"
                        }}
                        className="font-light text-6xl"
                        >{slider.content}</span>
                        <br/>
                        <br/>
                        <NavLink to={slider.path} className="button">{slider.button}</NavLink>
                      </Col>
                    </Row>
                    {/* <Row className="slider-main" style={slider?.id === 3 ? {left: "15%"} : null}>
                      <Col offset={slider.offset} span={24} className="slider-main-col">
                        <p className="title" style={slider?.id === 3 ? {color: "white"} : null}>{slider.title}</p>
                        <h2 className="content">{slider.content}</h2>
                        <p className="description">{slider?.description}</p>
                        <NavLink to={slider.path} className="button">{slider.button}</NavLink>
                      </Col>
                    </Row> */}
                </Row>
            </SwiperSlide>
        ))}
    
      </Swiper>
    </>
  );
};

export default SliderComponent;

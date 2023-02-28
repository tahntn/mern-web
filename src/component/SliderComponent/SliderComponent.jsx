import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,  Navigation } from "swiper";
import {NavLink} from 'react-router-dom';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import './index.scss';

const SliderComponent = ({sliders, ...rest}) => {
  return (
    <>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 500000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {sliders.map(slider => (
            <SwiperSlide key={slider.id}>
                <div className="slider-wrapper" >
                    <div style={{height: "630px"}}>
                        <img src={slider.slider} alt={slider.title} style={{width: "100%", height: "100%",}}/>
                    </div>
                    <div className="slider-main">
                        <p className="title">{slider.title}</p>
                        <h2 className="content">{slider.content}</h2>
                        <p className="description">{slider?.description}</p>
                        <NavLink to={slider.path} className="button">{slider.button}</NavLink>
                    </div>
                </div>
            </SwiperSlide>
        ))}
    
      </Swiper>
    </>
  );
};

export default SliderComponent;

// import SliderComponent from '../../'

import { featured } from "../../assets/data/featured";
import { sliders } from "../../assets/data/slider";
import FeaturedComponent from "../../component/FeaturedComponent/FeaturedComponent";
import NewArrivalsComponent from "../../component/NewArrivalsComponent/NewArrivalsComponent";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";
import SliderComponent from "../../component/SliderComponent/SliderComponent";
import { Divider } from 'antd';
const HomePage = () => {
    return (
        <div>
        <SliderComponent sliders={sliders}/>
        <FeaturedComponent featured={featured}/>
        <Divider/>
        <NewArrivalsComponent/>
        <Divider/>
        <div className="spacingPage">

        <ServiceComponent/>
        </div>
        </div>
    )
}

export default HomePage;

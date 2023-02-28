import {Row, Col} from 'antd'
import { NavLink } from 'react-router-dom';
import './index.scss'
const FeaturedComponent = ({featured}) => {
    return (
        <div className='featured mb-10' style={{margin:'50px'}}>
            <p style={{textAlign:" center",fontSize: "56px", margin: "60px 0px"}}>FEATURED NOW</p>
            <Row className='flex'>
                {featured.map(item=>{
                    return (
                        <Col key={item.id} span={item.span} className='featured-item p-2' style={{padding:'0px 5px', margin: '5px 0px'}}>
                            <NavLink to={item.path}>
                                <div className='featured-banner' style={{height: "400px"}} >
                                    <img src={item.color} alt={item.title} style={{width:"100%", height:"100%"}} />
                                    <div className='featured-banner__title'> 
                                        <p>{item.text}</p>
                                        <h2>{item.title}</h2>

                                    </div>
                                    <div className="featured-banner__image"  >
                                       

                                         <img src={item.image} alt={item.title}  style={{height:"100%", width: "100%",objectFit: "contain"}}/>
                                       
                                    </div>
                                </div>

                            </NavLink>

                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}

export default FeaturedComponent;
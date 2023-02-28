import {Row, Col} from 'antd'
const ServiceComponent =() => {
    return (
        <div className="bg-gray-100 my-20">
           <div className=' py-10' >
            <Row>
                <Col span={6} className="flex items-center justify-center">
                    <div style={{width:'10%'}} className="mr-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/411/411763.png" alt="shipping" style={{width:"100%"}} />
                    </div>
                    <div>
                        <h6 className="text-base font-black">Free shipping & return </h6>
                        <p className='text-gray-500'>Freee Shipping over $300</p>
                    </div>
                </Col>
                <Col span={6} className="flex items-center justify-center">
                    <div style={{width:'10%'}} className="mr-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/3037/3037156.png" alt="money" style={{width:"100%"}} />
                    </div>
                    <div>
                        <h6 className="text-base font-black">Money back guarantee</h6>
                        <p className='text-gray-500'>30 Days Money Back Guarantee</p>
                    </div>
                </Col>
                <Col span={6} className="flex items-center justify-center">
                    <div style={{width:'10%'}} className="mr-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/2854/2854306.png" alt="shipping" style={{width:"100%"}} />
                    </div>
                    <div>
                        <h6 className="text-base font-black">Best prices </h6>
                        <p className='text-gray-500'>Always the best prices</p>
                    </div>
                </Col>
                <Col span={6} className="flex items-center justify-center">
                    <div style={{width:'10%'}} className="mr-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/1067/1067566.png" alt="shipping" style={{width:"100%"}} />
                    </div>
                    <div>
                        <h6 className="text-base font-black">0943-084-518</h6>
                        <p className='text-gray-500'>24/7 Available Support</p>
                    </div>
                </Col>
            </Row>
           </div>

        </div>
    )
}
export default ServiceComponent;
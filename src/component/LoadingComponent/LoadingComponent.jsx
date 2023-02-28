import { Spin } from 'antd'
import React from 'react'
import "./index.scss"
const LoadingComponent = ({ children, isLoading, deday = 100, style }) => {
    
    return (
        <Spin spinning={isLoading} delay={deday} style={{...style}} className="spin">
            {children}
        </Spin>
    )
}

export default LoadingComponent

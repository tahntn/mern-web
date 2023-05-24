import React from 'react';
import FooterComponent from '../FooterComponent/FooterComponent';
import DefaultHeaderComponent from '../DefaultHeaderComponent/DefaultHeaderComponent';

const DefaultComponent = ({children}) => {
    return (
        <div className='relative'>
             <DefaultHeaderComponent/>
            {/* <BottomHeaderComponent/> */}
            {children}
            <FooterComponent/>
          
        </div>
    );
};

export default DefaultComponent;
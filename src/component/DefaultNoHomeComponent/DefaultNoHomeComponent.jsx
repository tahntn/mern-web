import React from 'react';
import FooterComponent from '../FooterComponent/FooterComponent';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import BottomHeaderComponent from '../BottomHeaderComponent/BottomHeaderComponent';

const DefaultNoHomeComponent = ({children}) => {
    return (
        <div>
             {/* <HeaderComponent/> */}
             <BottomHeaderComponent/>
            {children}
            <FooterComponent/>
        </div>
    );
}

export default DefaultNoHomeComponent;
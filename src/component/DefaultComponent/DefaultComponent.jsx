import React from 'react';
import FooterComponent from '../FooterComponent/FooterComponent';
import HeaderComponent from '../HeaderComponent/HeaderComponent';

const DefaultComponent = ({children}) => {
    return (
        <div>
            <HeaderComponent/>
            {children}
            <FooterComponent/>
        </div>
    );
};

export default DefaultComponent;
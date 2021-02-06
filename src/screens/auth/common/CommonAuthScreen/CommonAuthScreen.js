import React from 'react';
import './CommonAuthScreen.scss';
import logo from '../../../../assets/images/logo.svg'
import grayLogo from '../../../../assets/images/logo-light.svg';

function CommonAuthScreen(props) {
    const {children} = props
    return (
        <div className="main-bg">
            <div className="form-container">
                <div>
                <img alt="TCR" src={logo} className="logo"/>
                <div className="header">
                    <div>Welcome To</div>
                    <div>Trade Credit Risk</div>
                </div>
                {children}
                <div className="fixed-right-strips">
                    <div className="blue-strip"></div>
                    <div className="orange-strip"></div>
                </div>
                <img alt="TCR" className="gray-logo" src={grayLogo}/>
            </div>
            </div>
        </div>
    )
}

export default CommonAuthScreen;

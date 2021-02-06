import React from 'react';
import './LoginScreen.scss';
import logo from '../../../assets/images/logo.svg'
import grayLogo from '../../../assets/images/logo-light.svg';
import Button from "../../../common/Button/Button";
import CommonAuthScreen from "../common/CommonAuthScreen/CommonAuthScreen";
import BigInput from "../../../common/BigInput/BigInput";
import Checkbox from "../../../common/Checkbox/Checkbox";

function LoginScreen() {
    return (
        <CommonAuthScreen>
            <div className="login-field-name">Email or Number</div>
            <BigInput prefix="drafts" prefixClass="login-input-icon" type="email" placeholder="Enter email or number"/>

            <div className="login-field-name">Password</div>
            <BigInput prefix="lock_open" prefixClass="login-input-icon" type="password" placeholder="Enter password"/>
            <div className="login-action-row">
                <Checkbox value="Remember me"/>
                <a href="/">Forgot Password?</a>
            </div>

            <Button title="Login" buttonType={"secondary"}/>
            <img alt="TCR" className="gray-logo" src={grayLogo}/>
        </CommonAuthScreen>
    )
}

export default LoginScreen;

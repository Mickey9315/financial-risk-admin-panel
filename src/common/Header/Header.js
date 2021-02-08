import React from 'react';
import './Header.scss';
import BigInput from '../BigInput/BigInput';
import dummy from '../../assets/images/dummy.svg';
import IconButton from '../IconButton/IconButton';

const Header = () => {
  return (
    <div className="header-container">
      <div className="screen-title">User</div>
      <div className="header-right-part">
        <BigInput
          prefix="search"
          prefixClass="font-placeholder"
          placeholder="Search Here"
          suffix="tune"
          suffixClass="font-primary"
          className="search"
        />
        <IconButton
          title="notifications_active"
          buttonType="outlined-bg"
          className="notification"
        />
        <img className="user-dp" src={dummy} />
      </div>
    </div>
  );
};

export default Header;

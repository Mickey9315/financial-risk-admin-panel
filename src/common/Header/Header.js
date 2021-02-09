import React, { useRef } from 'react';
import './Header.scss';
import BigInput from '../BigInput/BigInput';
import dummy from '../../assets/images/dummy.svg';
import IconButton from '../IconButton/IconButton';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const Header = () => {
  const [showUserSettings, setShowUserSettings] = React.useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const toggleChangePasswordModal = () => setShowChangePasswordModal(e => !e);
  const changePasswordBtns = [
    { title: 'Close', buttonType: 'background-color', onClick: toggleChangePasswordModal },
    { title: 'Save', buttonType: 'primary', onClick: toggleChangePasswordModal },
  ];

  const openUserSettings = () => setShowUserSettings(true);
  const closeUserSettings = () => setShowUserSettings(false);

  const userSettingsRef = useRef();

  useOnClickOutside(userSettingsRef, closeUserSettings);

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
        <img className="user-dp" src={dummy} onClick={openUserSettings} />
        {showUserSettings && (
          <div ref={userSettingsRef} className="user-settings">
            <div onClick={closeUserSettings}>
              <span className="material-icons-round">edit</span> Profile
            </div>
            <div onClick={toggleChangePasswordModal}>
              <span className="material-icons-round">lock</span> Change Password
            </div>
            <div onClick={closeUserSettings}>
              <span className="material-icons-round">exit_to_app</span> Logout
            </div>
          </div>
        )}
      </div>
      {showChangePasswordModal && (
        <Modal
          header="Change Password"
          buttons={changePasswordBtns}
          className="change-password-dialog"
        >
          <div className="change-password-grid">
            <div className="form-title">Current password</div>
            <div>
              <Input type="password" placeholder="Enter Current Password" />{' '}
            </div>
            <div className="form-title">New password</div>
            <div>
              <Input type="password" placeholder="Enter New Password" />{' '}
            </div>
            <div className="form-title">Re Enter password</div>
            <div>
              <Input type="password" placeholder="Re Enter Password" />{' '}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Header;

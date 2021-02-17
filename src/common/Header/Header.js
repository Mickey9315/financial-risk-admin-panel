import React, { useRef, useState, useMemo } from 'react';
import './Header.scss';
import { useHistory } from 'react-router-dom';
import BigInput from '../BigInput/BigInput';
import dummy from '../../assets/images/dummy.svg';
import IconButton from '../IconButton/IconButton';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';
import { errorNotification } from '../Toast';
import { changePassword, logoutUser } from './redux/HeaderAction';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';

const Header = () => {
  const history = useHistory();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showUserSettings, setShowUserSettings] = React.useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const toggleChangePasswordModal = value =>
    setShowChangePasswordModal(value !== undefined ? value : e => !e);

  const toggleUserSettings = value => setShowUserSettings(value !== undefined ? value : e => !e);

  const resetInputs = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const onCloseChangePasswordClick = () => {
    toggleChangePasswordModal(false);
    resetInputs();
  };

  const onChangePasswordClick = async () => {
    if (currentPassword.toString().trim().length === 0) {
      return errorNotification('Please enter your current password');
    }
    if (newPassword.toString().trim().length === 0) {
      return errorNotification('Please enter new password');
    }
    if (confirmPassword.toString().trim().length === 0) {
      return errorNotification('Please enter confirm password');
    }
    if (newPassword !== confirmPassword) {
      return errorNotification('New password and confirm password should be same');
    }

    try {
      await changePassword(currentPassword, newPassword);
      toggleChangePasswordModal(false);
      resetInputs();
    } catch (e) {
      /**/
    }
    return true;
  };

  const onLogoutClick = async () => {
    try {
      await logoutUser();
      history.replace('/login');
      toggleUserSettings(false);
    } catch (e) {
      /**/
    }
    return true;
  };

  const changePasswordBtns = [
    {
      title: 'Close',
      buttonType: 'primary-1',
      onClick: onCloseChangePasswordClick,
    },
    { title: 'Save', buttonType: 'primary', onClick: onChangePasswordClick },
  ];

  const userSettingsRef = useRef();

  useOnClickOutside(userSettingsRef, () => toggleUserSettings(false));

  const onChangeCurrentPassword = e => {
    setCurrentPassword(e.target.value);
  };

  const onChangeNewPassword = e => {
    setNewPassword(e.target.value);
  };

  const onChangeConfirmPassword = e => {
    setConfirmPassword(e.target.value);
  };

  const headerTitle = useMemo(
    () => SIDEBAR_URLS.find(item => history.location.pathname.includes(item.url)).title,
    [history.location.pathname]
  );

  return (
    <div className="header-container">
      <div className="screen-title">{headerTitle}</div>
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
        <img className="user-dp" src={dummy} onClick={toggleUserSettings} />
        {showUserSettings && (
          <div ref={userSettingsRef} className="user-settings">
            <div onClick={toggleUserSettings}>
              <span className="material-icons-round">edit</span> Profile
            </div>
            <div onClick={toggleChangePasswordModal}>
              <span className="material-icons-round">lock</span> Change Password
            </div>
            <div onClick={onLogoutClick}>
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
              <Input
                type="password"
                placeholder="Enter Current Password"
                value={currentPassword}
                onChange={onChangeCurrentPassword}
              />{' '}
            </div>
            <div className="form-title">New password</div>
            <div>
              <Input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={onChangeNewPassword}
              />{' '}
            </div>
            <div className="form-title">Re Enter password</div>
            <div>
              <Input
                type="password"
                placeholder="Re Enter Password"
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
              />{' '}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Header;

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import './Header.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePassword,
  logoutUser,
  getLoggedUserDetails,
  updateUserProfile,
  changeEditProfileData,
  uploadProfilePicture,
} from './redux/HeaderAction';
import BigInput from '../BigInput/BigInput';
import dummy from '../../assets/images/dummy.svg';
import IconButton from '../IconButton/IconButton';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';
import { errorNotification } from '../Toast';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';
import { checkForEmail, replaceHiddenCharacters } from '../../helpers/ValidationHelper';
import { MOBILE_NUMBER_REGEX } from '../../constants/RegexConstants';
import FileUpload from './component/FileUpload';

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
  /** ***
   * edit profile declarations and inits
   * ***** */
  const dispatch = useDispatch();
  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isEditProfileButton, setIsEditProfileButton] = useState(false);
  const [fileName, setFileName] = useState('Browse...');
  const [file, setFile] = useState(null);
  const toggleEditProfileModal = value =>
    setShowEditProfileModal(value !== undefined ? value : e => !e);

  const { name, email, contactNumber, profilePictureUrl, changed } = useMemo(() => {
    if (loggedUserDetail) {
      // eslint-disable-next-line no-shadow
      const { name, email, contactNumber, profilePictureUrl, changed } = loggedUserDetail;
      return {
        name: name || '',
        email: email || '',
        contactNumber: contactNumber || '',
        profilePictureUrl: profilePictureUrl || '',
        changed: changed || false,
      };
    }
    return { name: '', email: '', contactNumber: '', profilePictureUrl: '', changed: false };
  }, [loggedUserDetail]);
  /** ****
   * edit profile end
   * ***** */

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

  /** **********edit profile methods******** */
  const onCloseEditProfileClick = () => {
    if (changed) {
      dispatch(getLoggedUserDetails());
    }
    setFileName('Browse...');
    setFile(null);
    setIsEditProfileButton(false);
    toggleEditProfileModal(false);
  };
  const onChangeEditProfileData = useCallback(e => {
    // eslint-disable-next-line no-shadow
    const { name, value } = e.target;
    dispatch(changeEditProfileData({ name, value }));
  }, []);
  const onSaveEditProfileClick = async () => {
    if (name.toString().trim().length === 0) {
      return errorNotification('Please enter your name');
    }
    if (name.toString().trim().length > 150) {
      return errorNotification('Name can be upto 150 char only');
    }
    if (email.toString().trim().length === 0) {
      return errorNotification('Please enter your email address');
    }
    if (contactNumber.toString().trim().length === 0) {
      return errorNotification('Please enter your contact number');
    }
    if (!checkForEmail(replaceHiddenCharacters(email))) {
      return errorNotification('Please enter valid email address');
    }
    if (contactNumber && !contactNumber.match(MOBILE_NUMBER_REGEX)) {
      return errorNotification('Please enter valid contact number');
    }
    try {
      if (changed) {
        dispatch(updateUserProfile(name, email, contactNumber));
      }
      if (file) {
        const formData = new FormData();
        formData.append('profile-picture', file);
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        dispatch(uploadProfilePicture(formData, config));
        setFileName('Browse...');
        setFile(null);
      }
      setIsEditProfileButton(false);
      toggleEditProfileModal(false);
    } catch (e) {
      errorNotification('Something went wrong');
    }
    return true;
  };
  const editProfileButtons = [
    {
      title: 'Close',
      buttonType: 'primary-1',
      onClick: onCloseEditProfileClick,
    },
    {
      title: isEditProfileButton ? 'Save' : 'Edit',
      buttonType: 'primary',
      onClick: () => {
        setIsEditProfileButton(!isEditProfileButton);
      },
    },
  ];
  const onEditProfileButtons = [
    {
      title: 'Close',
      buttonType: 'primary-1',
      onClick: onCloseEditProfileClick,
    },
    {
      title: 'Save',
      buttonType: 'primary',
      onClick: onSaveEditProfileClick,
    },
  ];
  /** ********Edit Profile methods end********** */

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

  useEffect(() => {
    dispatch(getLoggedUserDetails());
  }, []);

  const handleChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2097152) {
        errorNotification('Maximum upload file size < 2 MB');
      } else if (selectedFile.type !== 'image/png') {
        errorNotification('File must be image file');
      } else {
        setFileName(selectedFile.name ? selectedFile.name : 'Browse...');
        setFile(selectedFile);
      }
    }
  };

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
        <img className="user-dp" src={profilePictureUrl || dummy} onClick={toggleUserSettings} />
        {showUserSettings && (
          <div ref={userSettingsRef} className="user-settings">
            <div onClick={toggleEditProfileModal}>
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
      {
        /** ***********Edit Profile Modal************** */
        showEditProfileModal && (
          <Modal
            header="Edit Profile"
            buttons={!isEditProfileButton ? editProfileButtons : onEditProfileButtons}
            className="edit-profile-dialog"
          >
            <div className="edit-profile-grid">
              <div className="form-title">Profile Avatar</div>
              {!isEditProfileButton ? (
                <img className="user-dp" src={profilePictureUrl || dummy} />
              ) : (
                <FileUpload
                  profilePictureUrl={profilePictureUrl}
                  isProfile
                  handleChange={handleChange}
                  fileName={fileName}
                />
              )}
              <div className="form-title">Name</div>
              {!isEditProfileButton ? (
                <div className="user-fields">{name && name}</div>
              ) : (
                <div>
                  <Input
                    type="Name"
                    name="name"
                    value={name}
                    onChange={onChangeEditProfileData}
                    placeholder={name}
                  />
                </div>
              )}
              <div className="form-title">Email</div>
              {!isEditProfileButton ? (
                <div className="user-fields">{email && email}</div>
              ) : (
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChangeEditProfileData}
                    placeholder={email}
                  />
                </div>
              )}
              <div className="form-title">Number</div>
              {!isEditProfileButton ? (
                <div className="user-fields">{contactNumber && contactNumber}</div>
              ) : (
                <div>
                  <Input
                    type="tel"
                    name="contactNumber"
                    value={contactNumber}
                    maxlength="10"
                    onChange={onChangeEditProfileData}
                    placeholder={contactNumber}
                  />
                </div>
              )}
            </div>
          </Modal>
        )

        /** **********Edit Profile modal end************ */
      }
      {showChangePasswordModal && (
        <Modal
          header="Change Password"
          buttons={changePasswordBtns}
          className="change-password-dialog"
        >
          <div className="change-password-grid">
            <span className="form-title">Current password</span>
            <div>
              <Input
                type="password"
                placeholder="Enter Current Password"
                value={currentPassword}
                onChange={onChangeCurrentPassword}
              />{' '}
            </div>
            <span className="form-title">New password</span>
            <div>
              <Input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={onChangeNewPassword}
              />{' '}
            </div>
            <span className="form-title">Re Enter password</span>
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

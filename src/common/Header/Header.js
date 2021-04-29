import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Header.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeEditProfileData,
  changePassword,
  getLoggedUserDetails,
  logoutUser,
  updateUserProfile,
  uploadProfilePicture,
} from './redux/HeaderAction';
import dummy from '../../assets/images/dummy.svg';
import IconButton from '../IconButton/IconButton';
import Modal from '../Modal/Modal';
import Input from '../Input/Input';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';
import { errorNotification } from '../Toast';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';
import FileUpload from './component/FileUpload';
import Drawer from '../Drawer/Drawer';
import Checkbox from '../Checkbox/Checkbox';

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
        name: name ?? '',
        email: email ?? '',
        contactNumber: contactNumber ?? '',
        profilePictureUrl: profilePictureUrl ?? '',
        changed: changed ?? false,
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
      await dispatch(logoutUser());
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
      try {
        dispatch(getLoggedUserDetails());
      } catch (e) {
        /**/
      }
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
  const onSaveEditProfileClick = useCallback(async () => {
    if (name.toString().trim().length === 0) {
      errorNotification('Please enter your name');
    } else if (name.toString().trim().length > 150) {
      errorNotification('Name can be upto 150 char only');
    } else if (contactNumber.toString().trim().length === 0) {
      errorNotification('Please enter your contact number');
    } else if (contactNumber && !contactNumber.match(/^\+?(\d+$)/)) {
      errorNotification('Please enter valid contact number');
    } else {
      try {
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
        if (changed) {
          dispatch(updateUserProfile(name, contactNumber));
        }
        setIsEditProfileButton(false);
        toggleEditProfileModal(false);
      } catch (err) {
        /**/
      }
    }
  }, [name, contactNumber, file, changed, fileName]);
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
    () =>
      SIDEBAR_URLS.find(item => history?.location?.pathname?.includes(item?.url ?? ''))?.title ??
      '',
    [history?.location?.pathname]
  );

  useEffect(() => {
    try {
      dispatch(getLoggedUserDetails());
    } catch (e) {
      /**/
    }
  }, []);

  const handleChange = e => {
    e.persist();
    if (e.target.files && e.target.files.length > 0) {
      const fileExtension = ['jpeg', 'jpg', 'png'];
      const mimeType = ['image/jpeg', 'image/jpg', 'image/png'];

      const checkExtension =
        fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
      const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;

      if (!(checkExtension || checkMimeTypes)) {
        errorNotification('Only image file allowed');
      }
      const checkFileSize = e.target.files[0].size > 4194304;
      if (checkFileSize) {
        errorNotification('File size should be less than 4 mb');
      } else {
        setFileName(e.target.files[0].name ? e.target.files[0].name : 'Browse...');
        setFile(e.target.files[0]);
      }
    }
  };

  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const openNotificationDrawer = useCallback(value =>
    setNotificationDrawer(value !== undefined ? value : e => !e)
  );
  const NotiDrawerHeader = () => {
    return (
      <div className="notification-drawer-title">
        <span className="material-icons-round">notifications_active</span> Notifications
      </div>
    );
  };

  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const searchOnFocus = () => setHeaderSearchFocused(true);
  const headerSearchRef = useRef();
  const [searchStart, setSearchStart] = useState(false);
  const searchOutsideClick = () => {
    setSearchStart(false);
    setHeaderSearchFocused(false);
  };
  useOnClickOutside(headerSearchRef, searchOutsideClick);
  const onSearchEnterKeyPress = e => {
    if (e.keyCode === 13) {
      setSearchStart(true);
    }
  };

  return (
    <div className="header-container">
      <div className="screen-title">{headerTitle}</div>
      <div className="header-right-part">
        <div
          ref={headerSearchRef}
          className={`header-search-container ${
            headerSearchFocused && 'header-search-container-focused'
          } ${searchStart && 'got-search-results'}`}
        >
          <div>
            <input
              type="text"
              placeholder="Search Here"
              onFocus={searchOnFocus}
              onKeyDown={onSearchEnterKeyPress}
            />
            <span className="material-icons-round">search</span>
          </div>
          {searchStart && <div className="header-search-results">Opps! No such results found.</div>}
        </div>
        <IconButton
          title="notifications_active"
          buttonType="outlined-bg"
          className="notification"
          onClick={openNotificationDrawer}
        />
        <img className="user-dp" src={profilePictureUrl ?? dummy} onClick={toggleUserSettings} />
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
        {
          /** ********** notification drawer starts ************ */
          <Drawer
            header={<NotiDrawerHeader />}
            drawerState={notificationDrawer}
            closeDrawer={() => setNotificationDrawer(false)}
          >
            <div className="notification-set">
              <div className="notification-set-title">Today</div>
              <div className="common-notification-content-box">
                <div className="d-flex align-center just-bet">
                  <div className="tag red-tag">Really High</div>
                  <Checkbox />
                </div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">15-Dec-2020</span>

                  <span className="title">Owner:</span>
                  <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">
                  Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                  invidunt ut labore et.
                </div>
              </div>
              <div className="common-accordion-item-content-box high-alert">
                <div className="note-title-row">
                  <div className="note-title">Title of Note</div>
                  <span className="material-icons-round font-placeholder">more_vert</span>
                </div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">15-Dec-2020</span>

                  <span className="title">Owner:</span>
                  <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">
                  Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                  invidunt ut labore et.
                </div>
              </div>
            </div>
          </Drawer>

          /** ********** notification drawer ends ************ */
        }
      </div>
      {
        /** ***********Edit Profile Modal************** */
        showEditProfileModal && (
          <Modal
            header="Edit Profile"
            buttons={!isEditProfileButton ? editProfileButtons : onEditProfileButtons}
            className="edit-profile-dialog"
            hideModal={toggleEditProfileModal}
          >
            <div className="edit-profile-grid">
              <div className="form-title">Profile Avatar</div>
              {!isEditProfileButton ? (
                <img className="user-dp" src={profilePictureUrl ?? dummy} />
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
                    disabled
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
                    type="text"
                    name="contactNumber"
                    value={contactNumber}
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
          hideModal={toggleChangePasswordModal}
        >
          <div className="change-password-grid">
            <span className="form-title">Current Password</span>
            <div>
              <Input
                type="password"
                placeholder="Enter Current Password"
                value={currentPassword}
                onChange={onChangeCurrentPassword}
              />{' '}
            </div>
            <span className="form-title">New Password</span>
            <div>
              <Input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={onChangeNewPassword}
              />{' '}
            </div>
            <span className="form-title">Re Enter Password</span>
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

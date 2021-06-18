import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import {
  changeEditProfileData,
  changePassword,
  getHeaderNotificationListURL,
  getLoggedUserDetails,
  logoutUser,
  markNotificationAsReadAndDeleteAction,
  searchGlobalData,
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
import { SESSION_VARIABLES } from '../../constants/SessionStorage';
import { getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';
import { connectWebSocket, disconnectWebSocket } from '../../helpers/SocketHelper';
import { handleGlobalSearchSelect } from '../../helpers/GlobalSearchHelper';
import { HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS } from './redux/HeaderConstants';

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

  // LoaderButtons
  const {
    updateProfileHeaderButtonLoaderAction,
    resetPasswordHeaderButtonLoaderAction,
    logoutHeaderButtonLoaderAction,
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);

  /*
  Global Search Data */

  const globalSearchResult = useSelector(
    ({ globalSearchReducer }) => globalSearchReducer?.searchResults ?? []
  );

  /*
   * Notification Data
   * */
  const notificationData = useSelector(
    ({ headerNotificationReducer }) => headerNotificationReducer ?? []
  );

  const notificationList = useMemo(() => {
    let list = [];
    if (notificationData?.notificationList?.length > 0) {
      list = Object.values(
        notificationData?.notificationList?.reduce((acc, cur) => {
          if (!acc[new Date(cur.createdAt).toLocaleDateString()])
            acc[new Date(cur.createdAt).toLocaleDateString()] = {
              createdAt: new Date(cur.createdAt).toLocaleDateString(),
              notifications: [],
            };
          acc[new Date(cur.createdAt).toLocaleDateString()].notifications.push(cur);
          return acc;
        }, {})
      );
      list = _.orderBy(list, ['createdAt'], ['desc']);
    }
    return list ?? [];
  }, [notificationData?.notificationList]);

  const notificationBadge = useMemo(() => {
    const result = notificationData?.notificationList?.filter(
      notification => notification?.isRead !== true
    );
    return result?.length ?? 0;
  }, [notificationData?.notificationList]);

  /* end */

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
      if (!logoutHeaderButtonLoaderAction) {
        await dispatch(logoutUser());
        history.replace('/login');
        toggleUserSettings(false);
      }
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
          await dispatch(uploadProfilePicture(formData, config));
        }
        if (changed) {
          await dispatch(updateUserProfile(name, contactNumber));
        }
        setIsEditProfileButton(false);
        toggleEditProfileModal(false);
        setFileName('Browse...');
        setFile(null);
      } catch (err) {
        /**/
      }
    }
  }, [name, contactNumber, file, changed, fileName]);
  const editProfileButtons = useMemo(
    () => [
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
    ],
    [onCloseEditProfileClick, isEditProfileButton, setIsEditProfileButton]
  );
  const onEditProfileButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: onCloseEditProfileClick,
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onSaveEditProfileClick,
        isLoading: updateProfileHeaderButtonLoaderAction,
      },
    ],
    [onCloseEditProfileClick, onSaveEditProfileClick, updateProfileHeaderButtonLoaderAction]
  );
  /** ********Edit Profile methods end********** */

  const changePasswordBtns = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: onCloseChangePasswordClick,
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onChangePasswordClick,
        isLoading: resetPasswordHeaderButtonLoaderAction,
      },
    ],
    [onCloseChangePasswordClick, onChangePasswordClick, resetPasswordHeaderButtonLoaderAction]
  );

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

  useEffect(() => {
    if (SESSION_VARIABLES.USER_TOKEN) dispatch(getLoggedUserDetails());
  }, [SESSION_VARIABLES.USER_TOKEN]);

  const handleChange = useCallback(
    e => {
      e.persist();
      if (e.target.files && e.target.files.length > 0) {
        const fileExtension = ['jpeg', 'jpg', 'png'];
        const mimeType = ['image/jpeg', 'image/jpg', 'image/png'];

        const checkExtension =
          fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
        const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;
        const checkFileSize = e.target.files[0].size > 4194304;

        if (!(checkExtension || checkMimeTypes)) {
          errorNotification('Only image file allowed');
        } else if (checkFileSize) {
          errorNotification('File size should be less than 4 mb');
        } else {
          setFileName(e.target.files[0].name ? e.target.files[0].name : 'Browse...');
          setFile(e.target.files[0]);
        }
      }
    },
    [setFile, setFileName]
  );

  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const openNotificationDrawer = useCallback(
    value => setNotificationDrawer(value !== undefined ? value : e => !e),
    []
  );
  const NotificationDrawerHeader = () => {
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
  const onSearchEnterKeyPress = useCallback(e => {
    try {
      if (e.keyCode === 13) {
        const { value } = e?.target;
        if (value?.trim()?.length > 0) {
          dispatch(searchGlobalData(value));
        }
      }
    } catch (err) {
      /**/
    }
  }, []);

  const handleOnSearchChange = useCallback(e => {
    if (e?.target?.value?.trim()?.length === 0) {
      setSearchStart(false);
      dispatch({
        type: HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.CLEAR_SEARCHED_DATA_LIST,
      });
    } else setSearchStart(true);
  }, []);

  useEffect(() => {
    dispatch(getHeaderNotificationListURL());
    const AUTH_TOKEN = getAuthTokenLocalStorage();
    if (AUTH_TOKEN !== null) {
      connectWebSocket(AUTH_TOKEN);
    }
    return () => disconnectWebSocket();
  }, []);

  return (
    <div className="header-container">
      <div className="screen-title">
        <Switch>
          {SIDEBAR_URLS.map(route => (
            <Route path={route.url}>{route.title}</Route>
          ))}
        </Switch>
      </div>
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
              onChange={handleOnSearchChange}
              onClick={handleOnSearchChange}
            />
            <span className="material-icons-round">search</span>
          </div>
          {searchStart && (
            <ul className="header-search-results">
              {globalSearchResult?.map(searchResult => (
                <li
                  onClick={() => {
                    handleGlobalSearchSelect(searchResult, history);
                    setSearchStart(false);
                  }}
                >
                  {searchResult?.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <IconButton
          isBadge={notificationBadge > 0}
          title="notifications_active"
          buttonType="outlined-bg"
          className="notification"
          onClick={openNotificationDrawer}
          badgeCount={notificationBadge}
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
            <div
              onClick={onLogoutClick}
              className={logoutHeaderButtonLoaderAction && 'cursor-not-allowed'}
            >
              <span className="material-icons-round">exit_to_app</span> Logout
            </div>
          </div>
        )}
        {
          /** ********** notification drawer starts ************ */
          <Drawer
            header={<NotificationDrawerHeader />}
            drawerState={notificationDrawer}
            closeDrawer={() => setNotificationDrawer(false)}
          >
            {notificationList?.length > 0 ? (
              notificationList?.map(notification => (
                <div className="notification-set">
                  <div className="notification-set-title">
                    {notification?.createdAt}
                    {moment(notification?.createdAt, 'DD/MM/YYYY').calendar({
                      sameDay: '[Today]',
                      nextDay: '[Tomorrow]',
                      nextWeek: 'dddd',
                      lastDay: '[Yesterday]',
                      lastWeek: '[Last] dddd',
                      sameElse: 'DD/MM/YYYY',
                    })}
                  </div>
                  {notification?.notifications?.map(singleNotification => (
                    <div
                      className="common-accordion-item-content-box high-alert"
                      key={singleNotification?._id}
                    >
                      <div className="date-owner-row just-bet">
                        <span className="title mr-5">Date:</span>
                        <span className="details">
                          {moment(singleNotification?.createdAt).format('DD-MMM-YYYY')}
                        </span>
                        <span />
                        <span
                          className="material-icons-round font-placeholder"
                          style={{ textAlign: 'end', fontSize: '18px', cursor: 'pointer' }}
                          onClick={() =>
                            dispatch(markNotificationAsReadAndDeleteAction(singleNotification?._id))
                          }
                        >
                          cancel
                        </span>
                      </div>
                      <div className="font-field">Description:</div>
                      <div className="font-primary">{singleNotification?.description}</div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-record-found">No record found</div>
            )}
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

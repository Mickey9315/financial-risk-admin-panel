/* eslint-disable no-shadow */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './AddUser.scss';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';
import {
  addNewUser,
  changeUserData,
  changeUserManageAccess,
  deleteUserDetails,
  getAllClientList,
  getAllOrganisationModulesList,
  getSelectedUserData,
  setNewUserInitialStates,
  updateUserDetails,
} from '../redux/UserManagementAction';
import {USER_MODULE_ACCESS, USER_ROLES} from '../../../constants/UserlistConstants';
import {errorNotification} from '../../../common/Toast';
import {EMAIL_ADDRESS_REGEX, NUMBER_REGEX} from '../../../constants/RegexConstants';
import {USER_MANAGEMENT_CRUD_REDUX_CONSTANTS} from '../redux/UserManagementReduxConstants';
import Modal from '../../../common/Modal/Modal';

const AddUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allOrganisationList = useSelector(({ organizationModulesList }) => organizationModulesList);
  const allClientList = useSelector(({ userManagementClientList }) => userManagementClientList);
  const selectedUser = useSelector(({ selectedUserData }) => selectedUserData);
  const { action, id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const filteredOrganisationList = useMemo(
    () => selectedUser?.moduleAccess?.filter(e => !e.isDefault) || [],
    [selectedUser]
  );

  useEffect(() => {
    dispatch(getAllOrganisationModulesList());
    dispatch(getAllClientList());
    if (action !== 'add' && id) {
      dispatch(getSelectedUserData(id));
    } else {
      dispatch({
        type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION,
        data: null,
      });
    }
  }, []);

  useEffect(() => {
    if (
      action === 'add' &&
      selectedUser === null &&
      allOrganisationList &&
      allOrganisationList.length !== 0
    ) {
      dispatch(setNewUserInitialStates(allOrganisationList));
    }
  }, [selectedUser, allOrganisationList]);

  const backToUser = useCallback(() => {
    history.replace('/users');
  }, [history]);

  const { name, role, email, contactNumber, clientIds } = useMemo(() => {
    if (selectedUser) {
      // eslint-disable-next-line no-shadow
      const { name, role, email, contactNumber, clientIds } = selectedUser;
      return {
        name: name || '',
        role: role || '',
        email: email || '',
        clientIds: clientIds || [],
        contactNumber: contactNumber || '',
      };
    }
    return { name: '', role: '', email: '', contactNumber: '', clientIds: [] };
  }, [selectedUser]);

  const onChangeUserData = useCallback(e => {
    const { name, value } = e.target;
    dispatch(changeUserData({ name, value }));
  }, []);

  const clientSelected = useCallback(value => {
    dispatch(changeUserData({ name: 'clientIds', value }));
  }, []);

  const onChangeUserRole = useCallback(
    e => {
      clientSelected([]);
      onChangeUserData(e);
    },
    [onChangeUserData, clientSelected]
  );

  const onChangeUserAccess = useCallback((module, value) => {
    dispatch(changeUserManageAccess({ name: module, value }));
  }, []);

  const onClickAddUser = useCallback(async () => {
    if (!selectedUser) {
      return;
    }
    if (!name || name.trim().length === 0) {
      errorNotification('Please enter name');
    } else if (!email || email.trim().length === 0) {
      errorNotification('Please enter email');
    } else if (!email.match(EMAIL_ADDRESS_REGEX)) {
      errorNotification('Please enter a valid email');
    } else if (!role || role.trim().length === 0) {
      errorNotification('Please select role');
    } else if (contactNumber && !contactNumber.match(NUMBER_REGEX)) {
      errorNotification('Please enter valid contact number');
    } else {
      try {
        if (action === 'add') {
          await dispatch(addNewUser(selectedUser));
        } else if (action === 'edit') {
          await dispatch(updateUserDetails(id, selectedUser));
        }
        backToUser();
      } catch (e) {
        /**/
      }
    }
  }, [selectedUser, name, email, role, contactNumber, action, id, backToUser]);

  const editUserClick = useCallback(() => {
    history.replace(`/users/user/edit/${id}`);
  }, [history, id]);

  const toggleConfirmationModal = useCallback(
    value => setShowModal(value !== undefined ? value : e => !e),
    [setShowModal]
  );

  const deleteUserClick = useCallback(async () => {
    try {
      toggleConfirmationModal(false);
      await dispatch(deleteUserDetails(id));
      backToUser();
    } catch (e) {
      /**/
    }
  }, [id, backToUser]);

  const deleteModalButtonClick = useCallback(() => {
    setModalData({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user?',
      buttons: [
        { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal(false) },
        {
          title: 'Delete',
          buttonType: 'danger',
          onClick: deleteUserClick,
        },
      ],
    });
    toggleConfirmationModal(true);
  }, [deleteUserClick, toggleConfirmationModal]);

  const clients = useMemo(() => {
    let finalData = [];

    if (allClientList && role !== '') {
      if (role === 'riskAnalyst') {
        finalData = allClientList.riskAnalystList;
      }
      if (role === 'serviceManager') {
        finalData = allClientList.serviceManagerList;
      }
    }

    return finalData.map(e => ({
      label: e.name,
      value: e._id,
    }));
  }, [role, allClientList]);

  const getBreadcrumbTitle = useMemo(() => {
    switch (action) {
      case 'edit':
        return 'Edit';
      case 'add':
        return 'Add';
      default:
        return 'View';
    }
  }, [action]);

  return (
    <>
      {showModal && (
        <Modal header={modalData.title} buttons={modalData.buttons}>
          <span className="confirmation-message">{modalData.description}</span>
        </Modal>
      )}
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToUser}>User List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>{getBreadcrumbTitle} User</span>
        </div>
        <div className="buttons-row">
          {action === 'view' ? (
            <>
              <Button buttonType="primary" title="Edit" onClick={editUserClick} />
              <Button buttonType="danger" title="Delete" onClick={deleteModalButtonClick} />
            </>
          ) : (
            <>
              <Button buttonType="primary-1" title="Close" onClick={backToUser} />
              <Button buttonType="primary" title="Save" onClick={onClickAddUser} />
            </>
          )}
        </div>
      </div>
      <div className="common-detail-container">
        <div className="common-detail-grid">
          <div className="common-detail-field">
            <span className="common-detail-title">Name</span>
            <Input
              type="text"
              placeholder={action === 'view' ? '' : 'Jason Gatt'}
              name="name"
              value={name}
              onChange={onChangeUserData}
              disabled={action === 'view'}
              borderClass={action === 'view' && 'disabled-control'}
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Email</span>
            <Input
              type="email"
              placeholder={action === 'view' ? '' : 'jason@trad.au'}
              name="email"
              value={email}
              onChange={onChangeUserData}
              disabled={action === 'view'}
              borderClass={action === 'view' && 'disabled-control'}
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Role</span>
            <Select
              placeholder={action === 'view' ? '' : 'Select'}
              name="role"
              options={USER_ROLES}
              value={role}
              onChange={onChangeUserRole}
              disabled={action === 'view'}
              className={action === 'view' && 'disabled-control'}
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Phone Number</span>
            <Input
              name="contactNumber"
              value={contactNumber}
              type="text"
              placeholder="1234567890"
              onChange={onChangeUserData}
              disabled={action === 'view'}
              borderClass={action === 'view' && 'disabled-control'}
            />
          </div>
        </div>
        {(role === 'riskAnalyst' || role === 'serviceManager') && (
                <div className="common-detail-field">
          <span className="common-detail-title">Select Client</span>
          <ReactSelect
            multi
            values={clientIds}
            onChange={clientSelected}
            options={clients}
            disabled={action === 'view' || role === 'superAdmin'}
            className={`select-client-list-container ${action === 'view' && 'disabled-control'}`}
            color="#003A78"
            placeholder={action === 'view' ? '' : 'Select Client'}
            dropdownHandle={false}
            keepSelectedInList={false}
          />
        </div>
        )}
      </div>
      <div className="module-container">
        {filteredOrganisationList.map(module => (
          <div className="module">
            <div className="module-title">{module.label}</div>
            {USER_MODULE_ACCESS.map(access => (
              <Checkbox
                disabled={action === 'view'}
                title={access.label}
                name={access.value}
                checked={module.accessTypes.includes(access.value)}
                onChange={() => onChangeUserAccess(module.name, access.value)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default AddUser;

import React, { useEffect, useMemo, useState } from 'react';
import './AddUser.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';
import {
  addNewUser,
  changeUserData,
  changeUserManageAccess,
  getAllOrganisationModulesList,
  getSelectedUserData,
  setNewUserInitialStates,
  updateUserDetails,
} from '../redux/UserManagementAction';
import { USER_MODULE_ACCESS, USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import { MOBILE_NUMBER_REGEX } from '../../../constants/RegexConstants';
import { USER_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/UserManagementReduxConstants';

const AddUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allOrganisationList = useSelector(({ organizationModulesList }) => organizationModulesList);
  const selectedUser = useSelector(({ selectedUserData }) => selectedUserData);
  const { action, id } = useParams();

  const filteredOrganisationList = useMemo(
    () => selectedUser?.moduleAccess?.filter(e => !e.isDefault) || [],
    [selectedUser]
  );

  useEffect(() => {
    dispatch(getAllOrganisationModulesList());
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

  const backToUser = () => {
    history.replace('/users');
  };

  const { name, role, email, contactNumber } = useMemo(() => {
    if (selectedUser) {
      // eslint-disable-next-line no-shadow
      const { name, role, email, contactNumber } = selectedUser;
      return {
        name: name || '',
        role: role || '',
        email: email || '',
        contactNumber: contactNumber || '',
      };
    }
    return { name: '', role: '', email: '', contactNumber: '' };
  }, [selectedUser]);

  const onChangeUserData = e => {
    // eslint-disable-next-line no-shadow
    const { name, value } = e.target;
    dispatch(changeUserData({ name, value }));
  };

  const onChangeUserAccess = (module, value) => {
    dispatch(changeUserManageAccess({ name: module, value }));
  };

  const onClickAddUser = async () => {
    if (!selectedUser) {
      return;
    }
    if (!name || name.trim().length === 0) {
      errorNotification('Please enter name');
    } else if (!email || email.trim().length === 0) {
      errorNotification('Please enter email');
    } else if (!contactNumber || contactNumber.trim().length === 0) {
      errorNotification('Please enter contact number');
    } else if (contactNumber.match(MOBILE_NUMBER_REGEX)) {
      errorNotification('Please enter valid contact number');
    } else if (!role || role.trim().length === 0) {
      errorNotification('Please select role');
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
  };

  const editUserClick = () => {
    history.replace(`/user/edit/${id}`);
  };

  const deleteUserClick = () => {};
  const clients = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'orange', label: 'orange' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'peach', label: 'Peach' },
    { value: 'ocean', label: 'Ocean' },
  ];
  const { client, setClient } = useState(null);
  const clientSelected = selectedClient => {
    setClient({ selectedClient });
  };
  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToUser}>User List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View User</span>
        </div>
        <div className="buttons-row">
          {action === 'view' ? (
            <>
              <Button buttonType="primary" title="Edit" onClick={editUserClick} />
              <Button buttonType="danger" title="Delete" onClick={deleteUserClick} />
            </>
          ) : (
            <>
              <Button buttonType="primary-1" title="Close" onClick={backToUser} />
              <Button buttonType="primary" title="Save" onClick={onClickAddUser} />
            </>
          )}
        </div>
      </div>
      {action === 'view' && <div className="view-only-mode-overlay" />}
      <div className="user-detail-container">
        <div className="user-detail-grid">
          <div className="add-user-detail">
            <span className="user-detail-title">Name</span>
            <Input
              type="text"
              placeholder="Jason Gatt"
              name="name"
              value={name}
              onChange={onChangeUserData}
            />
          </div>
          <div className="add-user-detail">
            <span className="user-detail-title">Email</span>
            <Input
              type="email"
              placeholder="jason@trad.au"
              name="email"
              value={email}
              onChange={onChangeUserData}
            />
          </div>
          <div className="add-user-detail">
            <span className="user-detail-title">Role</span>
            <Select
              placeholder="Select"
              name="role"
              options={USER_ROLES}
              value={role}
              onChange={onChangeUserData}
            />
          </div>
          <div className="add-user-detail">
            <span className="user-detail-title">Phone Number</span>
            <Input
              name="contactNumber"
              value={contactNumber}
              type="text"
              prefix="+01"
              prefixType="pincode"
              prefixClass="phone-code"
              borderClass="w-100 phone-number-input"
            />
          </div>
        </div>
        <div className="add-user-detail">
          <span className="user-detail-title">Select Client</span>
          <ReactSelect
            multi
            value={clients}
            onChange={client && clientSelected}
            options={clients}
            className="select-client-list-container"
            color="#003A78"
            placeholder="Select Client"
            dropdownHandle={false}
          />
          {/* <div className="select-client-list-container">
            {clientList.length > 0}
            <Input
              type="text"
              borderClass="w-100"
              name="client"
              value={name}
              onChange={onSelectClient}
            />
          </div> */}
        </div>
      </div>
      <div className="module-container">
        {filteredOrganisationList.map(module => (
          <div className="module">
            <div className="module-title">{module.label}</div>
            {USER_MODULE_ACCESS.map(access => (
              <Checkbox
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

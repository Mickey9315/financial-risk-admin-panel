import React, { useEffect, useMemo } from 'react';
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
  deleteUserDetails,
  getAllClientList,
  getAllOrganisationModulesList,
  getSelectedUserData,
  setNewUserInitialStates,
  updateUserDetails,
} from '../redux/UserManagementAction';
import { USER_MODULE_ACCESS, USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import { EMAIL_ADDRESS_REGEX, NUMBER_REGEX } from '../../../constants/RegexConstants';
import { USER_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/UserManagementReduxConstants';

const AddUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allOrganisationList = useSelector(({ organizationModulesList }) => organizationModulesList);
  const allClientList = useSelector(({ userManagementClientList }) => userManagementClientList);
  const selectedUser = useSelector(({ selectedUserData }) => selectedUserData);
  const { action, id } = useParams();

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

  const backToUser = () => {
    history.replace('/users');
  };

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
    } else if (!email.match(EMAIL_ADDRESS_REGEX)) {
      errorNotification('Please enter valid email');
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
  };

  const editUserClick = () => {
    history.replace(`/users/user/edit/${id}`);
  };

  const deleteUserClick = async () => {
    await dispatch(deleteUserDetails(id));
    backToUser();
  };

  const clients = useMemo(() => {
    let finalData = [];

    if (allClientList) {
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
  }, [allClientList]);

  const clientSelected = value => {
    dispatch(changeUserData({ name: 'clientIds', value: value.map(e => e.value) }));
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
      <div className="user-detail-container">
        <div className="user-detail-grid">
          <div className="add-user-detail">
            <span className="user-detail-title">Name</span>
            <Input
              type="text"
              placeholder={action === 'view' ? '' : 'Jason Gatt"'}
              name="name"
              value={name}
              onChange={onChangeUserData}
              disabled={action === 'view'}
              borderClass={action === 'view' && 'disabled-control'}
            />
          </div>
          <div className="add-user-detail">
            <span className="user-detail-title">Email</span>
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
          <div className="add-user-detail">
            <span className="user-detail-title">Role</span>
            <Select
              placeholder={action === 'view' ? '' : 'Select'}
              name="role"
              options={USER_ROLES}
              value={role}
              onChange={onChangeUserData}
              disabled={action === 'view'}
              className={action === 'view' && 'disabled-control'}
            />
          </div>
          <div className="add-user-detail">
            <span className="user-detail-title">Phone Number</span>
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
        <div className="add-user-detail">
          <span className="user-detail-title">Select Client</span>
          <ReactSelect
            multi
            value={clientIds}
            onChange={clientSelected}
            options={clients}
            disabled={action === 'view'}
            className={`select-client-list-container ${action === 'view' && 'disabled-control'}`}
            color="#003A78"
            placeholder={action === 'view' ? '' : 'Select Client'}
            dropdownHandle={false}
            keepSelectedInList={false}
          />
        </div>
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

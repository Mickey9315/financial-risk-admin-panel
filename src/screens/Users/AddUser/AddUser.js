import React, { useEffect, useMemo } from 'react';
import './AddUser.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../../../common/Dashboard/Dashboard';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';
import {
  changeUserData,
  changeUserManageAccess,
  getAllOrganisationModulesList,
  setNewUserInitialStates,
} from '../redux/UserManagementAction';
import { USER_MODULE_ACCESS, USER_ROLES } from '../../../constants/UserlistConstants';

const AddUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allOrganisationList = useSelector(({ organizationModulesList }) => organizationModulesList);
  const selectedUser = useSelector(({ selectedUserData }) => selectedUserData);
  const { id } = useParams();
  const filteredOrganisationList = useMemo(
    () => selectedUser?.moduleAccess?.filter(e => !e.isDefault) || [],
    [selectedUser]
  );

  useEffect(() => {
    dispatch(getAllOrganisationModulesList());
  }, []);

  useEffect(() => {
    if (
      id === 'add' &&
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

  return (
    <Dashboard>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToUser}>User List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View User</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="primary-1" title="Close" onClick={backToUser} />
          <Button buttonType="primary" title="Save" />
        </div>
      </div>

      <div className="common-white-container">
        <div className="add-user-detail">
          <span className="font-primary">Name</span>
          <Input
            type="text"
            className="add-user-input"
            placeholder="Jason Gatt"
            name="name"
            value={name}
            onChange={onChangeUserData}
          />
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Email</span>
          <Input
            type="email"
            className="add-user-input"
            placeholder="jason@trad.au"
            name="email"
            value={email}
            onChange={onChangeUserData}
          />
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Phone Number</span>
          <div className="phone-number-input">
            <div className="phone-code">+01</div>
            <input
              placeholder="1234567890"
              name="contactNumber"
              value={contactNumber}
              onChange={onChangeUserData}
            />
          </div>
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Role</span>
          <Select
            className="add-user-select"
            placeholder="Select"
            name="role"
            options={USER_ROLES}
            value={role}
            onChange={onChangeUserData}
          />
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
    </Dashboard>
  );
};

export default AddUser;

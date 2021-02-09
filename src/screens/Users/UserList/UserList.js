import React, { useEffect, useMemo } from 'react';
import './UserList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dashboard from '../../../common/Dashboard/Dashboard';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import { getUserManagementList } from '../redux/UserManagementAction';
import Modal from '../../../common/Modal/Modal';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';

const UserList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userListWithPageData = useSelector(({ userManagementList }) => userManagementList);
  const userData = useMemo(() => userListWithPageData?.docs || [], [userListWithPageData]);

  useEffect(() => {
    dispatch(getUserManagementList());
  }, []);

  const columnStructure = {
    columns: [
      {
        type: 'text',
        name: 'Name',
        value: 'name',
      },
      {
        type: 'text',
        name: 'Email',
        value: 'email',
      },
      {
        type: 'text',
        name: 'Phone',
        value: 'phone',
      },
      {
        type: 'text',
        name: 'Role',
        value: 'role',
      },
      {
        type: 'text',
        name: 'Date',
        value: 'date',
      },
    ],
    actions: [
      {
        type: 'edit',
        name: 'Edit',
        icon: 'edit-outline',
      },
      {
        type: 'delete',
        name: 'Delete',
        icon: 'trash-outline',
      },
    ],
  };
  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = () => setFilterModal(e => !e);
  const filterModalButtons = [
    { title: 'Close', buttonType: 'background-color', onClick: toggleFilterModal },
    { title: 'Apply', buttonType: 'primary' },
  ];
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const customFieldsModalButtons = [
    { title: 'Reset Defaults', buttonType: 'outlined-primary' },
    { title: 'Close', buttonType: 'background-color', onClick: toggleCustomField },
    { title: 'Save', buttonType: 'primary' },
  ];
  const defaultFields = [
    'Client Name',
    'Client Id',
    'Country',
    'Address',
    'Created Date',
    'Modified Date',
  ];
  const customFields = [
    'Phone',
    'Trading As',
    'Net of brokerage',
    'Policy Type',
    'Expiry Date',
    'Inception Date',
  ];
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const openAddUser = () => {
    history.push('/addUser');
  };
  return (
    <>
      <Dashboard>
        <div className="page-header">
          <div className="page-header-name">User List</div>
          <div className="page-header-button-container">
            <IconButton
              buttonType="secondary"
              title="filter_list"
              className="mr-10"
              onClick={toggleFilterModal}
            />
            <IconButton
              buttonType="primary"
              title="format_line_spacing"
              className="mr-10"
              onClick={toggleCustomField}
            />
            <Button title="Add User" buttonType="success" onClick={openAddUser} />
          </div>
        </div>
        <div className="user-list-container">
          <Table align="left" valign="center" data={userData} header={columnStructure} />
        </div>
        <Pagination className="user-list-pagination" />
        {filterModal && (
          <Modal
            headerIcon="filter_list"
            header="Filter"
            buttons={filterModalButtons}
            className="filter-modal"
          >
            <div className="filter-modal-row">
              <div className="form-title">Role</div>
              <Select className="filter-select" placeholder="Select" />
            </div>
            <div className="filter-modal-row">
              <div className="form-title">Date</div>
              <div className="date-picker-container filter-date-picker-container mr-15">
                <DatePicker
                  className="filter-date-picker"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                />
                <span className="material-icons-round">event_available</span>
              </div>
              <div className="date-picker-container filter-date-picker-container">
                <DatePicker
                  className="filter-date-picker"
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                />
                <span className="material-icons-round">event_available</span>
              </div>
            </div>
          </Modal>
        )}
        {customFieldModal && (
          <Modal
            headerIcon="format_line_spacing"
            header="Custom Fields"
            buttons={customFieldsModalButtons}
            className="custom-field-modal"
          >
            <div className="custom-field-content">
              <div>
                <div className="custom-field-title">Default Fields</div>
                {defaultFields.map(e => (
                  <Checkbox title={e} />
                ))}
              </div>
              <div>
                <div className="custom-field-title">Custom Fields</div>
                {customFields.map(e => (
                  <Checkbox title={e} />
                ))}
              </div>
            </div>
          </Modal>
        )}
      </Dashboard>
    </>
  );
};

export default UserList;

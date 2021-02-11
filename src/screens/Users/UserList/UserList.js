import React, { useEffect, useMemo, useReducer } from 'react';
import './UserList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Dashboard from '../../../common/Dashboard/Dashboard';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  getUserManagementList,
  getUserManagementListByFilter,
} from '../redux/UserManagementAction';
import Modal from '../../../common/Modal/Modal';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';

const initialFilterState = {
  role: 'riskAnalyst',
  startDate: null,
  endDate: null,
};

const USER_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case USER_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const UserList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userListWithPageData = useSelector(({ userManagementList }) => userManagementList);

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);

  useEffect(() => {
    dispatch(getUserManagementList());
  }, []);

  const { total, pages, page, limit, docs, headers } = useMemo(() => userListWithPageData, [
    userListWithPageData,
  ]);

  const handleFilterChange = event => {
    dispatchFilter({
      type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: event.target.name,
      value: event.target.value,
    });
  };

  const tableData = useMemo(() => {
    return docs.map(e => {
      const finalObj = {
        id: e._id,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = e[`${f.name}`];
      });

      return finalObj;
    });
  }, [docs]);

  // const tableHeaders = useMemo(() => headers.map(header => header.label), [headers]);

  const onSelectLimit = newLimit => {
    dispatch(getUserManagementList({ page: 1, limit: newLimit }));
  };

  const lastClick = newPage => {
    dispatch(getUserManagementList({ page: newPage, limit }));
  };

  const firstClick = newPage => {
    dispatch(getUserManagementList({ page: newPage, limit }));
  };

  const prevClick = newPage => {
    dispatch(getUserManagementList({ page: newPage, limit }));
  };

  const nextClick = newPage => {
    dispatch(getUserManagementList({ page: newPage, limit }));
  };

  const handleStartDateChange = date => {
    dispatchFilter({
      type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: date,
    });
  };

  const handleEndDateChange = date => {
    dispatchFilter({
      type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: date,
    });
  };

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = () => setFilterModal(e => !e);

  const { role, startDate, endDate } = filter;

  const onClickApplyFilter = () => {
    if (moment(startDate).isAfter(endDate)) {
      errorNotification('Please enter from date before to date');
    } else if (moment(endDate).isBefore(startDate)) {
      errorNotification('Please enter to date after from date');
    } else {
      const data = {
        page,
        limit,
        role: role || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      dispatch(getUserManagementListByFilter(data));
      toggleFilterModal();
    }
  };

  const filterModalButtons = [
    { title: 'Close', buttonType: 'background-color', onClick: toggleFilterModal },
    { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
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
          <Table align="left" valign="center" data={tableData} headers={headers} />
        </div>
        <Pagination
          className="user-list-pagination"
          total={total}
          pages={pages}
          page={page}
          limit={limit}
          nextClick={nextClick}
          prevClick={prevClick}
          firstClick={firstClick}
          lastClick={lastClick}
          onSelectLimit={onSelectLimit}
        />
        {filterModal && (
          <Modal
            headerIcon="filter_list"
            header="Filter"
            buttons={filterModalButtons}
            className="filter-modal"
          >
            <div className="filter-modal-row">
              <div className="form-title">Role</div>
              <Select
                className="filter-select"
                placeholder="Select"
                name="role"
                options={USER_ROLES}
                value={role}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-modal-row">
              <div className="form-title">Date</div>
              <div className="date-picker-container filter-date-picker-container mr-15">
                <DatePicker
                  className="filter-date-picker"
                  selected={startDate}
                  onChange={handleStartDateChange}
                />
                <span className="material-icons-round">event_available</span>
              </div>
              <div className="date-picker-container filter-date-picker-container">
                <DatePicker
                  className="filter-date-picker"
                  selected={endDate}
                  onChange={handleEndDateChange}
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

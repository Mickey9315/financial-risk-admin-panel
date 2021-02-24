import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import './UserList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table, { TABLE_ROW_ACTIONS } from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeUserColumnListStatus,
  deleteUserDetails,
  getUserColumnListName,
  getUserManagementListByFilter,
  saveUserColumnListName,
} from '../redux/UserManagementAction';
import Modal from '../../../common/Modal/Modal';
import { USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { processTableDataByType } from '../../../helpers/TableDataProcessHelper';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const initialFilterState = {
  role: '',
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
  const userColumnList = useSelector(({ userManagementColumnList }) => userManagementColumnList);

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const [deleteId, setDeleteId] = useState(null);
  const { role, startDate, endDate } = useMemo(() => filter, [filter]);
  const { total, pages, page, limit, docs, headers } = useMemo(() => userListWithPageData, [
    userListWithPageData,
  ]);

  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'endDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getUserManagementByFilter = useCallback(
    (params = {}, cb) => {
      if (moment(startDate).isAfter(endDate)) {
        errorNotification('From date should be greater than to date');
        resetFilterDates();
      } else if (moment(endDate).isBefore(startDate)) {
        errorNotification('To Date should be smaller than from date');
        resetFilterDates();
      } else {
        const data = {
          page: page || 1,
          limit: limit || 15,
          role: role && role.trim().length > 0 ? role : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          ...params,
        };
        dispatch(getUserManagementListByFilter(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, role, startDate, endDate, filter]
  );

  const handleFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'role',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );

  const tableData = useMemo(() => {
    return docs.map(e => {
      const finalObj = {
        id: e._id,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = processTableDataByType(f.type, e[`${f.name}`]);
      });

      return finalObj;
    });
  }, [docs]);

  const onSelectLimit = useCallback(
    newLimit => {
      getUserManagementByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getUserManagementByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getUserManagementByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getUserManagementByFilter]
  );

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(() => {
    getUserManagementByFilter({ page: 1 }, toggleFilterModal);
  }, [getUserManagementByFilter]);

  const filterModalButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveUserColumnListName({ userColumnList }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, userColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveUserColumnListName({ isReset: true }));
    dispatch(getUserColumnListName());
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleCustomField() },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );
  const { defaultFields, customFields } = useMemo(
    () => userColumnList || { defaultFields: [], customFields: [] },
    [userColumnList]
  );

  const openAddUser = useCallback(() => {
    history.push('/users/user/add/new');
  }, [history]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeUserColumnListStatus(data));
    },
    [dispatch]
  );

  const onSelectUserRecord = useCallback(
    id => {
      history.push(`/users/user/view/${id}`);
    },
    [history]
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setDeleteModal(value !== undefined ? value : e => !e),
    [setDeleteModal]
  );
  const deleteUserButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal(false) },
    {
      title: 'Delete',
      buttonType: 'danger',
      onClick: async () => {
        try {
          toggleConfirmationModal(false);
          const data = {
            page: page || 1,
            limit: limit || 15,
            role: role && role.trim().length > 0 ? role : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          };
          await dispatch(deleteUserDetails(deleteId, data));
          setDeleteId(null);
        } catch (e) {
          /**/
        }
      },
    },
  ];
  const onSelectUserRecordActionClick = useCallback(
    async (type, id) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        history.push(`/users/user/edit/${id}`);
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        setDeleteId(id);
        toggleConfirmationModal();
      }
    },
    [history]
  );

  const {
    page: paramPage,
    limit: paramLimit,
    role: paramRole,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };

    const filters = {
      role: paramRole && paramRole.trim().length > 0 ? paramRole : undefined,
      startDate: paramStartDate ? new Date(paramStartDate) : undefined,
      endDate: paramEndDate ? new Date(paramEndDate) : undefined,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: USER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });

    getUserManagementByFilter({ ...params, ...filters });
    dispatch(getUserColumnListName());
  }, []);

  useEffect(() => {
    const params = {
      page: page || 1,
      limit: limit || 15,
      role: role && role.trim().length > 0 ? role : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history.location.pathname}?${url}`);
  }, [history, total, pages, page, limit, role, startDate, endDate]);

  const userRoleSelectedValue = useMemo(() => {
    const foundValue = USER_ROLES.find(e => {
      return e.value === role;
    });
    return foundValue ? [foundValue] : [];
  }, [role]);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">User List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on user list"
            onClick={() => toggleFilterModal()}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Add User" buttonType="success" onClick={openAddUser} />
        </div>
      </div>
      {tableData ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              data={tableData}
              headers={headers}
              recordSelected={onSelectUserRecord}
              recordActionClick={onSelectUserRecordActionClick}
              rowClass="cursor-pointer"
              rowTitle="Click to view user details"
            />
          </div>
          <Pagination
            className="common-list-pagination"
            total={total}
            pages={pages}
            page={page}
            limit={limit}
            pageActionClick={pageActionClick}
            onSelectLimit={onSelectLimit}
          />
        </>
      ) : (
        <Loader />
      )}

      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Role</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={USER_ROLES}
              values={userRoleSelectedValue}
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
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldsModalButtons}
        />
      )}
      {deleteModal && (
        <Modal header="Delete User" buttons={deleteUserButtons}>
          <span className="confirmation-message">Are you sure you want to delete this user?</span>
        </Modal>
      )}
    </>
  );
};

export default UserList;

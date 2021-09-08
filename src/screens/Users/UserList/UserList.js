import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table, { TABLE_ROW_ACTIONS } from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeUserColumnListStatus,
  deleteUserDetails,
  getUserColumnListName,
  getUserManagementListByFilter,
  resetUserListPaginationData,
  saveUserColumnListName,
} from '../redux/UserManagementAction';
import Modal from '../../../common/Modal/Modal';
import { USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import { USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/UserManagementReduxConstants';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import Select from '../../../common/Select/Select';

const UserList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userListWithPageData = useSelector(({ userManagementList }) => userManagementList ?? {});
  const { userColumnNameList, userDefaultColumnNameList } = useSelector(
    ({ userManagementColumnList }) => userManagementColumnList ?? {}
  );

  const {
    UserListColumnSaveButtonLoaderAction,
    UserListColumnResetButtonLoaderAction,
    viewUserDeleteUserButtonLoaderAction,
    userListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { userListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const [deleteId, setDeleteId] = useState(null);
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);
  const { total, pages, page, limit, docs, headers } = useMemo(() => userListWithPageData ?? {}, [
    userListWithPageData,
  ]);

  const handleStartDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: date,
    });
  }, []);

  const handleEndDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: date,
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getUserManagementByFilter = useCallback(
    (params = {}, cb) => {
      if (
        tempFilter?.startDate &&
        tempFilter?.endDate &&
        moment(tempFilter?.endDate).isBefore(tempFilter?.startDate)
      ) {
        errorNotification('Please enter a valid date range');
        resetFilterDates();
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          role: (tempFilter?.role?.trim()?.length ?? -1) > 0 ? tempFilter?.role : undefined,
          startDate: tempFilter?.startDate ?? undefined,
          endDate: tempFilter?.endDate ?? undefined,
          ...params,
        };
        dispatch(getUserManagementListByFilter(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, resetFilterDates, { ...tempFilter }]
  );

  const handleFilterChange = useCallback(event => {
    if (event?.value) {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'role',
        value: event.value,
      });
    }
  }, []);

  const onSelectLimit = useCallback(
    newLimit => {
      getUserManagementByFilter({ page: 1, limit: newLimit });
    },
    [getUserManagementByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getUserManagementByFilter({ page: newPage, limit });
    },
    [limit, getUserManagementByFilter]
  );

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(() => {
    toggleFilterModal();
    getUserManagementByFilter({ page: 1, limit });
  }, [getUserManagementByFilter, toggleFilterModal]);

  const onClickResetFilterUserList = useCallback(() => {
    dispatchFilter({ type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE });
    onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilterUserList,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilterUserList]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(userColumnNameList, userDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveUserColumnListName({ userColumnNameList }));
        getUserManagementByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, userColumnNameList, userDefaultColumnNameList, getUserManagementByFilter]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveUserColumnListName({ isReset: true }));
    dispatch(getUserColumnListName());
    getUserManagementByFilter();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getUserManagementByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_COLUMN_LIST_ACTION,
      data: userDefaultColumnNameList,
    });
    toggleCustomField();
  }, [toggleCustomField, userDefaultColumnNameList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: UserListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: UserListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      UserListColumnSaveButtonLoaderAction,
      UserListColumnResetButtonLoaderAction,
    ]
  );
  const { defaultFields, customFields } = useMemo(
    () => userColumnNameList ?? { defaultFields: [], customFields: [] },
    [userColumnNameList]
  );

  const openAddUser = useCallback(() => {
    history.push('/users/user/add/new');
  }, [history]);

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeUserColumnListStatus(data));
  }, []);

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
  const deleteUserButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal(false) },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteUserDetails(deleteId));
            getUserManagementByFilter();
            toggleConfirmationModal(false);
            setDeleteId(null);
          } catch (e) {
            /**/
          }
        },
        isLoading: viewUserDeleteUserButtonLoaderAction,
      },
    ],
    [
      toggleConfirmationModal,
      setDeleteId,
      page,
      limit,
      viewUserDeleteUserButtonLoaderAction,
      deleteId,
    ]
  );
  const onSelectUserRecordActionClick = useCallback(
    async (type, id) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        history.push(`/users/user/edit/${id}`);
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        setDeleteId(id);
        toggleConfirmationModal();
      }
    },
    [history, setDeleteId, toggleConfirmationModal]
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
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };

    const filters = {
      role: paramRole?.trim()?.length > 0 ?? false ? paramRole : userListFilters?.role,
      startDate: paramStartDate ? new Date(paramStartDate) : userListFilters?.startDate,
      endDate: paramEndDate ? new Date(paramEndDate) : userListFilters?.endDate,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });

    getUserManagementByFilter({ ...params, ...filters });
    dispatch(getUserColumnListName());
    dispatch(resetUserListPaginationData(page, limit, pages, total));
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('userListFilters', finalFilter));
  }, [finalFilter]);

  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      role: finalFilter?.role?.length > 0 ?? false ? finalFilter?.role?.trim() : undefined,
      startDate: finalFilter?.startDate
        ? new Date(finalFilter?.startDate)?.toISOString()
        : undefined,
      endDate: finalFilter?.endDate ? new Date(finalFilter?.endDate)?.toISOString() : undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  const { hasWriteAccess, hasFullAccess } = useModulePrivileges(SIDEBAR_NAMES.USER);

  const userRoleSelectedValue = useMemo(() => {
    const foundValue = USER_ROLES.find(e => {
      return (e?.value ?? '') === tempFilter?.role;
    });
    return foundValue ?? [];
  }, [tempFilter?.role]);

  return (
    <>
      {!userListLoader ? (
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
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.USER}>
                <Button title="Add User" buttonType="success" onClick={openAddUser} />
              </UserPrivilegeWrapper>
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                  recordSelected={onSelectUserRecord}
                  recordActionClick={onSelectUserRecordActionClick}
                  rowClass="cursor-pointer"
                  haveActions={hasFullAccess || hasWriteAccess}
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
            <div className="no-record-found">No record found</div>
          )}

          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal"
              hideModal={toggleFilterModal}
            >
              <div className="filter-modal-row">
                <div className="form-title">Role</div>
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="role"
                  options={USER_ROLES}
                  value={userRoleSelectedValue}
                  onChange={handleFilterChange}
                  searchable={false}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.endDate ? new Date(tempFilter?.endDate) : null}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                    dateFormat="dd/MM/yyyy"
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
              toggleCustomField={toggleCustomField}
            />
          )}
          {deleteModal && (
            <Modal
              header="Delete User"
              buttons={deleteUserButtons}
              hideModal={toggleConfirmationModal}
            >
              <span className="confirmation-message">
                Are you sure you want to delete this user?
              </span>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default UserList;

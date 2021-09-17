import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeAuditLogColumnListStatus,
  getAuditLogColumnNameList,
  getAuditLogsList,
  getAuditUserName,
  resetAuditLogList,
  saveAuditLogColumnNameList,
} from '../redux/SettingAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import { errorNotification } from '../../../common/Toast';
import { SETTING_REDUX_CONSTANTS } from '../redux/SettingReduxConstants';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import Select from '../../../common/Select/Select';

const SettingsAuditLogTab = () => {
  const { auditLogList, auditLogColumnNameList, auditLogDefaultColumnNameList } = useSelector(
    ({ settingReducer }) => settingReducer ?? {}
  );

  const { userNameList } = useSelector(({ settingReducer }) => settingReducer ?? []);

  const {
    settingAuditLogColumnSaveButtonLoaderAction,
    settingAuditLogColumnResetButtonLoaderAction,
    settingAuditLogTabLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { defaultFields, customFields } = useMemo(
    () => auditLogColumnNameList ?? { defaultFields: [], customFields: [] },
    [auditLogColumnNameList]
  );
  const dispatch = useDispatch();
  const { total, pages, page, limit, docs, headers } = useMemo(() => auditLogList ?? {}, [
    auditLogList,
  ]);
  const [filterModal, setFilterModal] = useState(false);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const { settingAuditLogListFilters } = useSelector(
    ({ listFilterReducer }) => listFilterReducer ?? {}
  );

  const handleStartDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const handleEndDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const handleEntityTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'entityType',
      value: event?.value,
    });
  }, []);

  const handleUserNameFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'userRefId',
      value: event?.value,
    });
  }, []);

  const handleActionTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'actionType',
      value: event?.value,
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getAuditLogListByFilter = useCallback(
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
          page: page || 1,
          limit: limit || 15,
          entityType:
            tempFilter?.entityType?.trim()?.length > 0 ? tempFilter?.entityType : undefined,
          userRefId: tempFilter?.userRefId?.trim()?.length > 0 ? tempFilter?.userRefId : undefined,
          actionType:
            tempFilter?.actionType?.trim()?.length > 0 ? tempFilter?.actionType : undefined,
          startDate: tempFilter?.startDate ?? undefined,
          endDate: tempFilter?.endDate || undefined,
          ...params,
        };
        dispatch(getAuditLogsList(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, { ...tempFilter }]
  );

  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const onClickApplyFilter = useCallback(() => {
    toggleFilterModal();
    getAuditLogListByFilter({ page: 1, limit });
  }, [getAuditLogListByFilter, toggleFilterModal]);

  const onClickResetFilterAuditLogList = useCallback(() => {
    dispatchFilter({ type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE });
    onClickApplyFilter();
  }, [dispatchFilter]);

  const {
    startDate: paramStartDate,
    endDate: paramEndDate,
    actionType: paramActionType,
    userRefId: paramUserRefId,
    entityType: paramEntityType,
    page: paramPage,
    limit: paramLimit,
  } = useQueryParams();

  useEffect(() => {
    dispatch(getAuditUserName());
    return () => dispatch(resetAuditLogList());
  }, []);

  const onSelectLimit = useCallback(
    newLimit => {
      getAuditLogListByFilter({ page: 1, limit: newLimit });
    },
    [getAuditLogListByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getAuditLogListByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getAuditLogListByFilter]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeAuditLogColumnListStatus(data));
  }, []);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(auditLogColumnNameList, auditLogDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveAuditLogColumnNameList({ auditLogColumnNameList }));
        getAuditLogListByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    toggleCustomField,
    auditLogColumnNameList,
    getAuditLogListByFilter,
    auditLogDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveAuditLogColumnNameList({ isReset: true }));
    dispatch(getAuditLogColumnNameList());
    getAuditLogListByFilter();
    toggleCustomField();
  }, [toggleCustomField, getAuditLogListByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_COLUMN_LIST_ACTION,
      data: auditLogDefaultColumnNameList,
    });
    toggleCustomField();
  }, [auditLogDefaultColumnNameList, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: settingAuditLogColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: settingAuditLogColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      settingAuditLogColumnSaveButtonLoaderAction,
      settingAuditLogColumnResetButtonLoaderAction,
    ]
  );

  useUrlParamsUpdate(
    {
      page: page || 1,
      limit: limit || 15,
      actionType:
        finalFilter?.actionType?.toString()?.trim()?.length > 0
          ? finalFilter?.actionType
          : undefined,
      entityType:
        finalFilter?.entityType?.toString()?.trim()?.length > 0
          ? finalFilter?.entityType
          : undefined,
      userRefId:
        finalFilter?.userRefId?.toString()?.trim()?.length > 0 ? finalFilter?.userRefId : undefined,
      startDate: finalFilter?.startDate || undefined,
      endDate: finalFilter?.endDate || undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    const filters = {
      actionType:
        paramActionType && paramActionType.toString().trim().length > 0
          ? paramActionType
          : settingAuditLogListFilters?.actionType,
      userRefId:
        paramUserRefId && paramUserRefId.toString().trim().length > 0
          ? paramUserRefId
          : settingAuditLogListFilters?.userRefId,
      entityType:
        paramEntityType && paramEntityType.toString().trim().length > 0
          ? paramEntityType
          : settingAuditLogListFilters?.entityType,
      startDate: paramStartDate ? new Date(paramStartDate) : settingAuditLogListFilters?.startDate,
      endDate: paramEndDate ? new Date(paramEndDate) : settingAuditLogListFilters?.endDate,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });

    getAuditLogListByFilter({ ...params, ...filters });
    dispatch(getAuditLogColumnNameList());
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('settingAuditLogListFilters', finalFilter));
  }, [finalFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilterAuditLogList,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleFilterModal();
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter]
  );
  const userNameOptions = useMemo(() => {
    return userNameList?.map(e => ({
      label: e.name,
      value: e._id,
    }));
  }, [userNameList]);

  const entityTypeOptions = [
    {
      label: 'Client',
      value: 'client',
    },
    {
      label: 'Debtor',
      value: 'debtor',
    },
    {
      label: 'Application',
      value: 'application',
    },
    {
      label: 'Note',
      value: 'note',
    },
    {
      label: 'Task',
      value: 'task',
    },
    {
      label: 'Document',
      value: 'document',
    },
    {
      label: 'Client User',
      value: 'client-user',
    },
    {
      label: 'Credit Limit',
      value: 'credit-limit',
    },
  ];

  const actionTypeOptions = [
    {
      label: 'Add',
      value: 'add',
    },
    {
      label: 'Edit',
      value: 'edit',
    },
    {
      label: 'Delete',
      value: 'delete',
    },
    {
      label: 'sync',
      value: 'Sync',
    },
  ];

  const entityTypeSelectedValue = useMemo(() => {
    const selectedEntityType = entityTypeOptions.find(e => {
      return e.value === tempFilter?.entityType;
    });
    return selectedEntityType ? [selectedEntityType] : [];
  }, [filter, tempFilter?.entityType]);

  const userNameSelectedValue = useMemo(() => {
    const selectedUserName = userNameList?.filter(e => e._id === tempFilter?.userRefId);
    if (selectedUserName?.length > 0)
      return { label: selectedUserName?.[0]?.name, value: selectedUserName?.[0]?._id };
    return [];
  }, [tempFilter?.userRefId]);

  const actionTypeSelectedValue = useMemo(() => {
    const selectedActiontype = actionTypeOptions.find(e => {
      return e.value === tempFilter?.actionType;
    });
    return selectedActiontype ? [selectedActiontype] : [];
  }, [filter, tempFilter?.actionType]);

  return (
    <>
      {!settingAuditLogTabLoader ? (
        <>
          <div className="settings-title-row">
            <div className="title">Audit Logs List</div>
            <div className="buttons-row">
              <IconButton
                buttonType="secondary"
                title="filter_list"
                onClick={() => toggleFilterModal()}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                onClick={() => toggleCustomField()}
              />
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container settings-audit-log-list-container">
                <Table data={docs} tableClass="main-list-table" headers={headers} />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                onSelectLimit={onSelectLimit}
                pageActionClick={pageActionClick}
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
                <div className="form-title">Module</div>
                <Select
                  className="filter-select"
                  placeholder="Select module"
                  name="entityType"
                  value={entityTypeSelectedValue ?? []}
                  options={entityTypeOptions}
                  onChange={handleEntityTypeFilterChange}
                  isSearchable
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">User Name</div>
                <Select
                  className="filter-select"
                  placeholder="Select user name"
                  name="userRefId"
                  options={userNameOptions}
                  value={userNameSelectedValue ?? []}
                  onChange={handleUserNameFilterChange}
                  isSearchable
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Action Type</div>
                <Select
                  className="filter-select"
                  placeholder="Select action type"
                  name="actionType"
                  value={actionTypeSelectedValue}
                  options={actionTypeOptions ?? []}
                  onChange={handleActionTypeFilterChange}
                  isSearchable
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
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SettingsAuditLogTab;

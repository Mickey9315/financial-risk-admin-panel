import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';

import {
  changeClientColumnListStatus,
  clientsDownloadAction,
  getClientColumnListName,
  getClientFilter,
  getClientList,
  getListFromCrm,
  resetClientListPaginationData,
  saveClientColumnListName,
} from '../redux/ClientAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { errorNotification, successNotification } from '../../../common/Toast';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import ClientApiService from '../services/ClientApiService';
import {
  CLIENT_ADD_FROM_CRM_REDUX_CONSTANT,
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
} from '../redux/ClientReduxConstants';
import Loader from '../../../common/Loader/Loader';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import Select from '../../../common/Select/Select';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const ClientList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clientListWithPageData = useSelector(
    ({ clientManagement }) => clientManagement?.clientList ?? {}
  );
  const { clientColumnList, clientDefaultColumnList } = useSelector(
    ({ clientManagementColumnList }) => clientManagementColumnList ?? {}
  );
  const filterList = useSelector(
    ({ clientManagementFilterList }) => clientManagementFilterList ?? {}
  );
  const syncListFromCrm = useSelector(({ syncClientWithCrm }) => syncClientWithCrm ?? []);

  const { clientListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const {
    clientListColumnSaveButtonLoaderAction,
    clientListColumnResetButtonLoaderAction,
    clientListAddFromCRMButtonLoaderAction,
    clientListLoader,
    clientsDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const { docs, headers } = useMemo(() => clientListWithPageData ?? {}, [clientListWithPageData]);
  const [crmIds, setCrmIds] = useState([]);
  useEffect(() => {
    dispatch(getClientFilter());
  }, []);

  const {
    page: paramPage,
    limit: paramLimit,
    riskAnalystId: paramRiskAnalyst,
    serviceManagerId: paramServiceManager,
    inceptionStartDate: paramInceptionStartDate,
    inceptionEndDate: paramInceptionEndDate,
    expiryStartDate: paramExpiryStartDate,
    expiryEndDate: paramExpiryEndDate,
  } = useQueryParams();

  const appliedFilters = useMemo(() => {
    return {
      riskAnalystId:
        (tempFilter?.riskAnalystId?.trim()?.length ?? -1) > 0
          ? tempFilter?.riskAnalystId
          : undefined,
      serviceManagerId:
        (tempFilter?.serviceManagerId?.trim()?.length ?? -1) > 0
          ? tempFilter?.serviceManagerId
          : undefined,
      inceptionStartDate: tempFilter?.inceptionStartDate ?? undefined,
      inceptionEndDate: tempFilter?.inceptionEndDate ?? undefined,
      expiryStartDate: tempFilter?.expiryStartDate ?? undefined,
      expiryEndDate: tempFilter?.expiryEndDate ?? undefined,
    };
  }, [{ ...tempFilter }]);

  const riskAnalystFilterListData = useMemo(() => {
    const finalData = filterList?.riskAnalystList;

    return finalData?.map(e => ({
      label: e.name,
      value: e._id,
    }));
  }, [filterList]);

  const serviceManagerFilterListData = useMemo(() => {
    const finalData = filterList?.serviceManagerList;

    return finalData?.map(e => ({
      label: e.name,
      value: e._id,
    }));
  }, [filterList]);

  const { total, pages, page, limit } = useMemo(
    () => clientListWithPageData ?? {},
    [clientListWithPageData]
  );

  const handleStartDateChange = useCallback((name, date) => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name,
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const handleEndDateChange = useCallback((name, date) => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name,
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getClientListByFilter = useCallback(
    async (params = {}, cb) => {
      if (
        tempFilter?.inceptionStartDate &&
        tempFilter?.inceptionEndDate &&
        moment(tempFilter?.inceptionEndDate).isBefore(tempFilter?.inceptionStartDate)
      ) {
        errorNotification('Please enter a valid inception date range');
        resetFilterDates();
      } else if (
        tempFilter?.expiryStartDate &&
        tempFilter?.expiryEndDate &&
        moment(tempFilter?.expiryEndDate).isBefore(tempFilter?.expiryStartDate)
      ) {
        errorNotification('Please enter a valid expiry date range');
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          ...appliedFilters,
          ...params,
        };
        await dispatch(getClientList(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, { ...appliedFilters }]
  );

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };

    const filters = {
      riskAnalystId:
        (paramRiskAnalyst?.trim()?.length ?? -1) > 0
          ? paramRiskAnalyst
          : clientListFilters?.riskAnalystId,
      serviceManagerId:
        (paramServiceManager?.trim()?.length ?? -1) > 0
          ? paramServiceManager
          : clientListFilters?.serviceManagerId,
      inceptionStartDate: paramInceptionStartDate
        ? new Date(paramInceptionStartDate)
        : clientListFilters?.inceptionStartDate,
      inceptionEndDate: paramInceptionEndDate
        ? new Date(paramInceptionEndDate)
        : clientListFilters?.inceptionEndDate,
      expiryStartDate: paramExpiryStartDate
        ? new Date(paramInceptionStartDate)
        : clientListFilters?.expiryStartDate,
      expiryEndDate: paramExpiryEndDate
        ? new Date(paramInceptionEndDate)
        : clientListFilters?.expiryEndDate,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });

    await getClientListByFilter({ ...params, ...filters });
    dispatch(getClientColumnListName());
  }, []);

  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      riskAnalystId:
        (finalFilter?.riskAnalystId?.trim()?.length ?? -1) > 0
          ? finalFilter?.riskAnalystId
          : undefined,
      serviceManagerId:
        (finalFilter?.serviceManagerId?.trim()?.length ?? -1) > 0
          ? finalFilter?.serviceManagerId
          : undefined,
      inceptionStartDate: finalFilter?.inceptionStartDate || undefined,
      inceptionEndDate: finalFilter?.inceptionEndDate || undefined,
      expiryStartDate: finalFilter?.expiryStartDate || undefined,
      expiryEndDate: finalFilter?.expiryEndDate || undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  const pageActionClick = useCallback(
    async newPage => {
      await getClientListByFilter({ page: newPage, limit });
    },
    [limit, getClientListByFilter]
  );
  const onSelectLimit = useCallback(
    async newLimit => {
      await getClientListByFilter({ page: 1, limit: newLimit });
    },
    [getClientListByFilter]
  );
  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(async () => {
    toggleFilterModal();
    await getClientListByFilter({ page: 1, limit });
  }, [getClientListByFilter, page, limit, toggleFilterModal]);

  const onClickResetFilterClientList = useCallback(async () => {
    dispatchFilter({ type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE });
    await onClickApplyFilter();
  }, []);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilterClientList,
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
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: onClickApplyFilter,
      },
    ],
    [toggleFilterModal, onClickApplyFilter, toggleFilterModal]
  );
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION,
      data: clientDefaultColumnList,
    });
    toggleCustomField();
  }, [clientDefaultColumnList, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(clientColumnList, clientDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveClientColumnListName({ clientColumnList }));
        getClientListByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [getClientListByFilter, toggleCustomField, clientColumnList, clientDefaultColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientColumnListName({ isReset: true }));
    dispatch(getClientColumnListName());
    getClientListByFilter();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getClientListByFilter]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: clientListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: clientListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      clientListColumnSaveButtonLoaderAction,
      onClickSaveColumnSelection,
      clientListColumnResetButtonLoaderAction,
    ]
  );

  const { defaultFields, customFields } = useMemo(
    () => clientColumnList ?? { defaultFields: [], customFields: [] },
    [clientColumnList]
  );

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientColumnListStatus(data));
    },
    [dispatch]
  );

  const [addFromCRM, setAddFromCRM] = React.useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const onClickAddFromCRM = useCallback(
    value => setAddFromCRM(value !== undefined ? value : e => !e),
    [setAddFromCRM]
  );

  const addDataFromCrm = useCallback(() => {
    const data = {
      crmIds,
    };
    try {
      if (data.crmIds.length > 0) {
        startGeneralLoaderOnRequest('clientListAddFromCRMButtonLoaderAction');
        ClientApiService.updateClientListFromCrm(data)
          .then(res => {
            if (res.data.status === 'SUCCESS') {
              successNotification(res?.data?.message || 'Client data successfully synced');
              setAddFromCRM(false);
              dispatch(getClientList());
              dispatch({
                type: CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION,
                data: [],
              });
              stopGeneralLoaderOnSuccessOrFail('clientListAddFromCRMButtonLoaderAction');
            }
            setCrmIds([]);
          })
          .catch(e => {
            displayErrors(e);
            stopGeneralLoaderOnSuccessOrFail('clientListAddFromCRMButtonLoaderAction');
          });
      } else {
        errorNotification('Select at least one client to Add');
      }
    } catch (e) {
      /**/
    }
  }, [crmIds, setAddFromCRM, setCrmIds]);

  const toggleAddFromCRM = useCallback(() => {
    setCrmIds([]);
    dispatch({
      type: CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION,
      data: [],
    });
    setAddFromCRM(e => !e);
  }, [setAddFromCRM, setCrmIds]);

  const addToCRMButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: toggleAddFromCRM,
      },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: addDataFromCrm,
        isLoading: clientListAddFromCRMButtonLoaderAction,
      },
    ],
    [toggleAddFromCRM, addDataFromCrm, clientListAddFromCRMButtonLoaderAction]
  );
  const openViewClient = useCallback(
    id => {
      history.push(`/clients/client/view/${id}`);
    },
    [history]
  );

  const searchInputRef = useRef();

  const checkIfEnterKeyPressed = useCallback(async () => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length !== 0) {
      setCrmIds([]);
      setIsModalLoading(true);
      await dispatch(getListFromCrm(searchKeyword?.trim()?.toString()));
      setIsModalLoading(false);
    }
  }, [searchInputRef, setIsModalLoading, setCrmIds]);

  const handleRiskAnalystFilterChange = useCallback(event => {
    if (event && event.value) {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'riskAnalystId',
        value: event.value,
      });
    }
  }, []);
  const handleServiceManagerFilterChange = useCallback(event => {
    if (event && event.value) {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'serviceManagerId',
        value: event.value,
      });
    }
  }, []);

  const clientRiskAnalystSelectedValue = useMemo(() => {
    const foundValue = filterList?.riskAnalystList?.find(e => {
      return e._id === tempFilter?.riskAnalystId;
    });
    return foundValue
      ? [
          {
            label: foundValue?.name,
            value: foundValue?._id,
          },
        ]
      : [];
  }, [filterList, tempFilter?.riskAnalystId]);

  const clientServiceManagerSelectedValue = useMemo(() => {
    const foundValue = filterList?.serviceManagerList?.find(e => {
      return e._id === tempFilter?.serviceManagerId;
    });
    return foundValue
      ? [
          {
            label: foundValue?.name,
            value: foundValue?._id,
          },
        ]
      : [];
  }, [filterList, tempFilter?.serviceManagerId]);
  const selectClientFromCrm = useCallback(
    crmId => {
      let arr = [...crmIds];
      if (arr.includes(crmId)) {
        arr = arr.filter(e => e !== crmId);
      } else {
        arr = [...arr, crmId];
      }
      setCrmIds(arr);
    },
    [crmIds, setCrmIds]
  );

  const selectAllClientsFromCrm = useCallback(
    e => {
      if (e.target.checked) {
        const arr = syncListFromCrm?.map(crm => crm?.crmId?.toString());
        setCrmIds(arr);
      } else {
        setCrmIds([]);
      }
    },
    [syncListFromCrm, setCrmIds]
  );

  const downloadClients = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const response = await clientsDownloadAction(appliedFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [docs?.length, { ...appliedFilters }]);

  useEffect(() => {
    dispatch(saveAppliedFilters('clientListFilters', finalFilter));
  }, [finalFilter]);

  useEffect(() => {
    dispatch(resetClientListPaginationData(page, pages, total, limit));
  }, []);
  return (
    <>
      {!clientListLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Client List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download Client List"
                onClick={downloadClients}
                isLoading={clientsDownloadButtonLoaderAction}
              />
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
                onClick={() => toggleCustomField()}
              />
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.CLIENT}>
                <Button title="Add From CRM" buttonType="success" onClick={onClickAddFromCRM} />
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
                  recordSelected={openViewClient}
                  data={docs}
                  headers={headers}
                  rowClass="client-list-row"
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
                <div className="form-title client-filter-title">Service Manager Name</div>
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="serviceManagerId"
                  options={serviceManagerFilterListData}
                  value={clientServiceManagerSelectedValue}
                  onChange={handleServiceManagerFilterChange}
                  isSearchable
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title client-filter-title">Risk Analyst Name</div>
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="riskAnalystId"
                  options={riskAnalystFilterListData}
                  value={clientRiskAnalystSelectedValue}
                  onChange={handleRiskAnalystFilterChange}
                  isSearchable
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title client-filter-title">Inception Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={
                      tempFilter?.inceptionStartDate
                        ? new Date(tempFilter?.inceptionStartDate)
                        : null
                    }
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={date => handleStartDateChange('inceptionStartDate', date)}
                    placeholderText="From Date"
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={
                      tempFilter?.inceptionEndDate ? new Date(tempFilter?.inceptionEndDate) : null
                    }
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={date => handleEndDateChange('inceptionEndDate', date)}
                    placeholderText="To Date"
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
              </div>
              <div className="filter-modal-row">
                <div className="form-title client-filter-title">Expiry Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={
                      tempFilter?.expiryStartDate ? new Date(tempFilter?.expiryStartDate) : null
                    }
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={date => handleStartDateChange('expiryStartDate', date)}
                    placeholderText="From Date"
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={
                      tempFilter?.expiryEndDate ? new Date(tempFilter?.expiryEndDate) : null
                    }
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={date => handleEndDateChange('expiryEndDate', date)}
                    placeholderText="To Date"
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
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
          {addFromCRM && (
            <Modal
              header="Add From CRM"
              className="add-to-crm-modal"
              buttons={addToCRMButtons}
              hideModal={onClickAddFromCRM}
            >
              <BigInput
                ref={searchInputRef}
                prefix="search"
                prefixClass="font-placeholder"
                placeholder="Search clients"
                type="text"
                onChange={_.debounce(checkIfEnterKeyPressed, 1000)}
              />
              {!isModalLoading ? (
                <>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {syncListFromCrm.length > 0 ? (
                    <>
                      {/* <Checkbox title="Name" className="check-all-crmList" /> */}
                      <Checkbox
                        title="Add All"
                        className="check-all-crmList"
                        onChange={e => selectAllClientsFromCrm(e)}
                      />
                      <div className="crm-checkbox-list-container">
                        {syncListFromCrm.map(crm => (
                          <Checkbox
                            title={crm.name}
                            className="crm-checkbox-list"
                            checked={crmIds?.includes(crm?.crmId?.toString())}
                            onChange={() => selectClientFromCrm(crm?.crmId?.toString())}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-record-found">No record found</div>
                  )}
                </>
              ) : (
                <Loader />
              )}
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default ClientList;

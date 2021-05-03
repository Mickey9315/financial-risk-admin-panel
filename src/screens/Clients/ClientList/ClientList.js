import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './ClientList.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';

import {
  changeClientColumnListStatus,
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
import { CLIENT_ADD_FROM_CRM_REDUX_CONSTANT } from '../redux/ClientReduxConstants';
import Loader from '../../../common/Loader/Loader';

const initialFilterState = {
  riskAnalystId: '',
  serviceManagerId: '',
  startDate: null,
  endDate: null,
};

const CLIENT_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case CLIENT_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const ClientList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clientListWithPageData = useSelector(
    ({ clientManagement }) => clientManagement?.clientList ?? {}
  );
  const clientColumnList = useSelector(
    ({ clientManagementColumnList }) => clientManagementColumnList ?? []
  );
  const filterList = useSelector(
    ({ clientManagementFilterList }) => clientManagementFilterList ?? {}
  );
  const syncListFromCrm = useSelector(({ syncClientWithCrm }) => syncClientWithCrm ?? []);
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { riskAnalystId, serviceManagerId, startDate, endDate } = useMemo(() => filter, [filter]);

  const { docs, isLoading, headers } = useMemo(() => clientListWithPageData, [
    clientListWithPageData,
  ]);
  const [crmIds, setCrmIds] = useState([]);
  useEffect(() => {
    dispatch(getClientFilter());
  }, []);

  const {
    page: paramPage,
    limit: paramLimit,
    riskAnalystId: paramRiskAnalyst,
    serviceManagerId: paramServiceManager,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

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

  const { total, pages, page, limit } = clientListWithPageData;

  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
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

  const getClientListByFilter = useCallback(
    async (params = {}, cb) => {
      if (moment(startDate)?.isAfter(endDate)) {
        errorNotification('From date should be greater than to date');
        resetFilterDates();
      } else if (moment(endDate)?.isBefore(startDate)) {
        errorNotification('To Date should be smaller than from date');
        resetFilterDates();
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          riskAnalystId: (riskAnalystId?.trim()?.length ?? -1) > 0 ? riskAnalystId : undefined,
          serviceManagerId:
            (serviceManagerId?.trim()?.length ?? -1) > 0 ? serviceManagerId : undefined,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          ...params,
        };
        await dispatch(getClientList(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, riskAnalystId, serviceManagerId, startDate, endDate, filter]
  );

  useEffect(() => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };

    const filters = {
      riskAnalystId: (paramRiskAnalyst?.trim()?.length ?? -1) > 0 ? paramRiskAnalyst : undefined,
      serviceManagerId:
        (paramServiceManager?.trim()?.length ?? -1) > 0 ? paramServiceManager : undefined,
      startDate: paramStartDate ? new Date(paramStartDate) : undefined,
      endDate: paramEndDate ? new Date(paramEndDate) : undefined,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });

    getClientListByFilter({ ...params, ...filters });
    dispatch(getClientColumnListName());
  }, []);

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      riskAnalystId: (riskAnalystId?.trim()?.length ?? -1) > 0 ? riskAnalystId : undefined,
      serviceManagerId: (serviceManagerId?.trim()?.length ?? -1) > 0 ? serviceManagerId : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit, riskAnalystId, serviceManagerId, startDate, endDate]);

  const pageActionClick = useCallback(
    newPage => {
      getClientListByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getClientListByFilter]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      getClientListByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getClientListByFilter]
  );
  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(() => {
    getClientListByFilter({ page, limit }, toggleFilterModal);
  }, [getClientListByFilter, page, limit]);

  const onClickResetFilterClientList = useCallback(() => {
    dispatchFilter({ type: CLIENT_FILTER_REDUCER_ACTIONS.RESET_STATE });
    onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilterClientList,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, toggleFilterModal]
  );
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveClientColumnListName({ clientColumnList }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, clientColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientColumnListName({ isReset: true }));
    dispatch(getClientColumnListName());
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

  useEffect(() => {
    dispatch(getClientColumnListName());
  }, []);

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

  const onClickAddFromCRM = useCallback(
    value => setAddFromCRM(value !== undefined ? value : e => !e),
    [setAddFromCRM]
  );

  const addDataFromCrm = () => {
    dispatch({
      type: CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION,
      data: [],
    });
    const data = {
      crmIds,
    };
    if (data.crmIds.length > 0) {
      ClientApiService.updateClientListFromCrm(data)
        .then(res => {
          if (res.data.status === 'SUCCESS') {
            successNotification('Client data successfully synced');
            setAddFromCRM(e => !e);
            dispatch(getClientList());
          }
        })
        .catch(() => {
          errorNotification('Server error');
        });
    } else {
      errorNotification('Select at least one client to Add');
    }
  };

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
      { title: 'Close', buttonType: 'primary-1', onClick: toggleAddFromCRM },
      { title: 'Add', buttonType: 'primary', onClick: addDataFromCrm },
    ],
    [toggleAddFromCRM, addDataFromCrm]
  );
  const openViewClient = useCallback(
    id => {
      history.push(`/clients/client/view/${id}`);
    },
    [history]
  );
  const [searchClients, setSearchClients] = React.useState(false);

  const searchInputRef = useRef();

  const checkIfEnterKeyPressed = e => {
    if (e.key === 'Enter') {
      const searchKeyword = searchInputRef?.current?.value;
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        dispatch(getListFromCrm(searchKeyword?.trim()?.toString()));
        setSearchClients(true);
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const handleRiskAanalystFilterChange = useCallback(
    event => {
      if (event && event.value) {
        dispatchFilter({
          type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
          name: 'riskAnalystId',
          value: event.value,
        });
      }
    },
    [dispatchFilter]
  );
  const handleServiceManagerFilterChange = useCallback(
    event => {
      if (event && event.value) {
        dispatchFilter({
          type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
          name: 'serviceManagerId',
          value: event.value,
        });
      }
    },
    [dispatchFilter]
  );

  const clientRiskAnalystSelectedValue = useMemo(() => {
    const foundValue = filterList?.riskAnalystList?.find(e => {
      return e._id === riskAnalystId;
    });
    return foundValue
      ? [
          {
            label: foundValue?.name,
            value: foundValue?._id,
          },
        ]
      : [];
  }, [filterList, riskAnalystId]);

  const clientServiceManagerSelectedValue = useMemo(() => {
    const foundValue = filterList?.serviceManagerList?.find(e => {
      return e._id === serviceManagerId;
    });
    return foundValue
      ? [
          {
            label: foundValue?.name,
            value: foundValue?._id,
          },
        ]
      : [];
  }, [filterList, serviceManagerId]);
  const selectClientFromCrm = crmId => {
    let arr = [...crmIds];
    if (arr.includes(crmId)) {
      arr = arr.filter(e => e !== crmId);
    } else {
      arr = [...arr, crmId];
    }
    setCrmIds(arr);
  };

  const selectAllClientsFromCrm = e => {
    if (e.target.checked) {
      const arr = syncListFromCrm?.map(crm => crm?.crmId?.toString());
      setCrmIds(arr);
    } else {
      setCrmIds([]);
    }
  };

  useEffect(() => {
    return dispatch(resetClientListPaginationData(page, pages, total, limit));
  }, []);
  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Client List</div>
        {!isLoading && docs && (
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
              onClick={() => toggleCustomField()}
            />
            <Button title="Add From CRM" buttonType="success" onClick={onClickAddFromCRM} />
          </div>
        )}
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs.length > 0 ? (
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
        )
      ) : (
        <Loader />
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
            <ReactSelect
              className="filter-select react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              name="serviceManagerId"
              options={serviceManagerFilterListData}
              value={clientServiceManagerSelectedValue}
              onChange={handleServiceManagerFilterChange}
              isSearchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title client-filter-title">Risk Analyst Name</div>
            <ReactSelect
              className="filter-select react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              name="riskAnalystId"
              options={riskAnalystFilterListData}
              value={clientRiskAnalystSelectedValue}
              onChange={handleRiskAanalystFilterChange}
              isSearchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title client-filter-title">Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
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
                selected={endDate}
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
            onKeyDown={checkIfEnterKeyPressed}
          />
          {searchClients && (
            <>
              {/* eslint-disable-next-line no-nested-ternary */}
              {syncListFromCrm ? (
                syncListFromCrm.length > 0 ? (
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
                )
              ) : (
                <Loader />
              )}
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default ClientList;

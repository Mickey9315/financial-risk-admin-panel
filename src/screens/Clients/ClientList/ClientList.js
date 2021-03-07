import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './ClientList.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-dropdown-select';
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
  saveClientColumnListName,
} from '../redux/ClientAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import Drawer from '../../../common/Drawer/Drawer';
import { saveUserColumnListName } from '../../Users/redux/UserManagementAction';
import { errorNotification, successNotification } from '../../../common/Toast';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import ClientApiService from '../services/ClientApiService';
import { CLIENT_ADD_FROM_CRM_REDUX_CONSTANT } from '../redux/ClientReduxConstants';

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
  const clientListWithPageData = useSelector(({ clientManagement }) => clientManagement.clientList);
  const clientColumnList = useSelector(
    ({ clientManagementColumnList }) => clientManagementColumnList
  );
  const filterList = useSelector(({ clientManagementFilterList }) => clientManagementFilterList);
  const syncListFromCrm = useSelector(({ syncClientWithCrm }) => syncClientWithCrm);
  console.log('syncListFromCrm', syncListFromCrm);
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { riskAnalystId, serviceManagerId, startDate, endDate } = useMemo(() => filter, [filter]);

  const { docs, headers } = useMemo(() => clientListWithPageData, [clientListWithPageData]);
  const [crmIds, setCrmIds] = useState([]);
  useEffect(() => {
    dispatch(getClientList());
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
    const finalData = filterList.riskAnalystList;

    return finalData.map(e => ({
      label: e.name,
      value: e.name,
    }));
  }, [filterList]);

  const serviceManagerFilterListData = useMemo(() => {
    const finalData = filterList.serviceManagerList;

    return finalData.map(e => ({
      label: e.name,
      value: e.name,
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
          riskAnalystId:
            riskAnalystId && riskAnalystId.trim().length > 0 ? riskAnalystId : undefined,
          serviceManagerId:
            serviceManagerId && serviceManagerId.trim().length > 0 ? serviceManagerId : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          ...params,
        };
        dispatch(getClientList(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, riskAnalystId, serviceManagerId, startDate, endDate, filter]
  );

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };

    const filters = {
      riskAnalystId:
        paramRiskAnalyst && paramRiskAnalyst.trim().length > 0 ? paramRiskAnalyst : undefined,
      serviceManagerId:
        paramServiceManager && paramServiceManager.trim().length > 0
          ? paramServiceManager
          : undefined,
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
      page: page || 1,
      limit: limit || 15,
      riskAnalystId: riskAnalystId && riskAnalystId.trim().length > 0 ? riskAnalystId : undefined,
      serviceManagerId:
        serviceManagerId && serviceManagerId.trim().length > 0 ? serviceManagerId : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history.location.pathname}?${url}`);
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
    getClientListByFilter({ page: 1 }, toggleFilterModal);
  }, [getClientListByFilter]);

  const filterModalButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter]
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
    await dispatch(saveUserColumnListName({ isReset: true }));
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
    () => clientColumnList || { defaultFields: [], customFields: [] },
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
    ClientApiService.updateClientListFromCrm(data)
      .then(res => {
        if (res.data.status === 'SUCCESS') {
          successNotification('Client data successfully synced');
          setAddFromCRM(e => !e);
          dispatch(getClientList());
        }
      })
      .catch(() => {
        /**/
      });
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
      history.replace(`/clients/client/view/${id}`);
    },
    [history]
  );
  const [searchClients, setSearchClients] = React.useState(false);

  const searchInputRef = useRef();

  const checkIfEnterKeyPressed = e => {
    if (e.key === 'Enter') {
      const searchKeyword = searchInputRef.current.value;
      if (searchKeyword.trim().toString().length !== 0) {
        dispatch(getListFromCrm(searchKeyword.trim().toString()));
        setSearchClients(true);
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const [state, setState] = React.useState(false);
  const clientListClicked = () => {
    setState(e => !e);
  };
  const handleRiskAanalystFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'riskAnalystId',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );
  const handleServiceManagerFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: CLIENT_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'serviceManagerId',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );

  const clientRiskAnalystSelectedValue = useMemo(() => {
    const foundValue = docs.find(e => {
      return e.riskAnalystId === riskAnalystId;
    });
    return foundValue ? [foundValue] : [];
  }, [riskAnalystId]);

  const clientServiceManagerSelectedValue = useMemo(() => {
    const foundValue = docs.find(e => {
      return e.serviceManagerId === serviceManagerId;
    });
    return foundValue ? [foundValue] : [];
  }, [serviceManagerId]);
  const selectClientFromCrm = crmId => {
    let arr = [...crmIds];
    if (arr.includes(crmId)) {
      arr = arr.filter(e => e !== crmId);
    } else {
      arr = [...arr, crmId];
    }
    setCrmIds(arr);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-name" onClick={clientListClicked}>
          Client List
        </div>
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
      </div>
      <div className="common-list-container">
        <Table
          align="left"
          valign="center"
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
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Service Manager Name</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="servicePerson"
              options={serviceManagerFilterListData}
              values={clientServiceManagerSelectedValue}
              onChange={handleServiceManagerFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">RiskAnalyst Name</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="riskAnalystName"
              options={riskAnalystFilterListData}
              values={clientRiskAnalystSelectedValue}
              onChange={handleRiskAanalystFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
                onChange={handleStartDateChange}
                placeholderText="From Date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
                className="filter-date-picker"
                selected={endDate}
                onChange={handleEndDateChange}
                placeholderText="To Date"
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
      {addFromCRM && (
        <Modal header="Add From CRM" className="add-to-crm-modal" buttons={addToCRMButtons}>
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
              {/* <Checkbox title="Name" className="check-all-crmList" /> */}
              <div className="crm-checkbox-list-container">
                {console.log(syncListFromCrm)}
                {syncListFromCrm && syncListFromCrm.length > 0 ? (
                  syncListFromCrm.map(crm => (
                    <Checkbox
                      title={crm.name}
                      className="crm-checkbox-list"
                      checked={crmIds.includes(crm.crmId.toString())}
                      onChange={() => selectClientFromCrm(crm.crmId.toString())}
                    />
                  ))
                ) : (
                  <div className="no-data-available">No data available</div>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
      <Drawer header="Contact Details" drawerState={state}>
        <div className="contacts-grid">
          <div className="title">Name</div>
          <div>Lorem ipsum</div>
          <div className="title">Job Title</div>
          <div>Lorem ipsum</div>
          <div className="title">Department</div>
          <div>$10000</div>
          <div className="title">Mainline</div>
          <div>Lorem ipsum</div>
          <div className="title">Direct</div>
          <div>Lorem ipsum</div>
          <div className="title">Mobile</div>
          <div>1234567890</div>
          <div className="title">Email</div>
          <div>lorem@email.com</div>
          <div className="title">Role</div>
          <div>Lorem ipsum</div>
          <div className="title">Decision Maker</div>
          <div>No</div>
          <div className="title">Hold</div>
          <div>No</div>
          <div className="title">Operator Code</div>
          <div>-</div>
          <div className="title">Password</div>
          <div>-</div>
          <div className="title">Link</div>
          <div>-</div>
          <div className="title">Left Company</div>
          <div>Yes</div>
          <div className="title">Local AddressLine</div>
          <div>-</div>
          <div className="title">Local City</div>
          <div>-</div>
          <div className="title">Local County/State</div>
          <div>-</div>
        </div>
      </Drawer>
    </>
  );
};

export default ClientList;

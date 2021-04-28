import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Loader from '../../../common/Loader/Loader';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeApplicationColumnNameList,
  getApplicationColumnNameList,
  getApplicationsListByFilter,
  saveApplicationColumnNameList,
  getApplicationFilter,
} from '../redux/ApplicationAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { errorNotification } from '../../../common/Toast';
import '../ViewApplication/ViewApplication.scss';
import { APPLICATION_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/ApplicationReduxConstants';

const initialFilterState = {
  entity: '',
  clientId: '',
  debtorId: '',
  status: '',
  minCreditLimit: '',
  maxCreditLimit: '',
  startDate: null,
  endDate: null,
};

const APPLICATION_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state = initialFilterState, action) {
  switch (action.type) {
    case APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action?.name}`]: action?.value,
      };
    case APPLICATION_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const ApplicationList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const applicationListWithPageData = useSelector(
    ({ application }) => application?.applicationList ?? {}
  );
  const applicationColumnNameList = useSelector(
    ({ application }) => application?.applicationColumnNameList ?? {}
  );
  const applicationDefaultColumnNameList = useSelector(
    ({ application }) => application?.applicationDefaultColumnNameList ?? {}
  );
  const { total, pages, page, limit, docs, headers, isLoading } = useMemo(
    () => applicationListWithPageData,
    [applicationListWithPageData]
  );

  const { dropdownData } = useSelector(
    ({ application }) => application?.applicationFilterList ?? {}
  );
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const {
    entity,
    clientId,
    debtorId,
    status,
    minCreditLimit,
    maxCreditLimit,
    startDate,
    endDate,
  } = useMemo(() => filter ?? {}, [filter]);

  useEffect(() => {
    dispatch(getApplicationFilter());
  }, []);
  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
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

  const handleEntityTypeFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'entity',
        value: event?.[0]?.value,
      });
    },
    [dispatchFilter]
  );
  const handleClientIdFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'clientId',
        value: event?.[0]?.value,
      });
    },
    [dispatchFilter]
  );
  const handleDebtorIdFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'debtorId',
        value: event?.[0]?.value,
      });
    },
    [dispatchFilter]
  );
  const handleApplicationStatusFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'status',
        value: event?.[0]?.value,
      });
    },
    [dispatchFilter]
  );
  const handleMinLimitChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'minCreditLimit',
        value: event?.target?.value,
      });
    },
    [dispatchFilter]
  );
  const handleMaxLimitChange = useCallback(
    event => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'maxCreditLimit',
        value: event?.target?.value,
      });
    },
    [dispatchFilter]
  );

  const getApplicationsByFilter = useCallback(
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
          entityType: (entity?.trim()?.length ?? -1) > 0 ? entity : undefined,
          clientId: (clientId?.trim()?.length ?? -1) > 0 ? clientId : undefined,
          debtorId: (debtorId?.trim()?.length ?? -1) > 0 ? debtorId : undefined,
          status: (status?.trim()?.length ?? -1) > 0 ? status : undefined,
          minCreditLimit: (minCreditLimit?.trim()?.length ?? -1) > 0 ? minCreditLimit : undefined,
          maxCreditLimit: (maxCreditLimit?.trim()?.length ?? -1) > 0 ? maxCreditLimit : undefined,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          ...params,
        };
        try {
          await dispatch(getApplicationsListByFilter(data));
          if (cb && typeof cb === 'function') {
            cb();
          }
        } catch (e) {
          /**/
        }
      }
    },
    [
      page,
      limit,
      entity,
      clientId,
      debtorId,
      status,
      minCreditLimit,
      maxCreditLimit,
      startDate,
      endDate,
      resetFilterDates,
    ]
  );

  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getApplicationsByFilter({ page: 1, limit: newLimit });
    },
    [getApplicationsByFilter]
  );
  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getApplicationsByFilter({ page: newPage, limit });
    },
    [getApplicationsByFilter, limit]
  );

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const onClickApplyFilter = useCallback(() => {
    getApplicationsByFilter({ page, limit }, toggleFilterModal);
  }, [getApplicationsByFilter, toggleFilterModal]);

  const onClickResetFilter = useCallback(() => {
    dispatchFilter({
      type: APPLICATION_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(applicationColumnNameList, applicationDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveApplicationColumnNameList({ applicationColumnNameList }));
        getApplicationsByFilter();
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
    applicationColumnNameList,
    getApplicationsByFilter,
    applicationDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveApplicationColumnNameList({ isReset: true }));
    dispatch(getApplicationColumnNameList());
    getApplicationsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getApplicationsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
      data: applicationDefaultColumnNameList,
    });
    toggleCustomField();
  }, [toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );

  const { defaultFields, customFields } = useMemo(
    () => applicationColumnNameList || { defaultFields: [], customFields: [] },
    [applicationColumnNameList]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeApplicationColumnNameList(data));
  }, []);

  const {
    page: paramPage,
    limit: paramLimit,
    entityType: paramEntity,
    clientId: paramClientId,
    debtorId: paramDebtorId,
    status: paramStatus,
    minCreditLimit: paramMinCreditLimit,
    maxCreditLimit: paramMaxCreditLimit,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    const filters = {
      entityType: (paramEntity?.trim()?.length ?? -1) > 0 ? paramEntity : undefined,
      clientId: (paramClientId?.trim()?.length ?? -1) > 0 ? paramClientId : undefined,
      debtorId: (paramDebtorId?.trim()?.length ?? -1) > 0 ? paramDebtorId : undefined,
      status: (paramStatus?.trim()?.length ?? -1) > 0 ? paramStatus : undefined,
      minCreditLimit:
        (paramMinCreditLimit?.trim()?.length ?? -1) > 0 ? paramMinCreditLimit : undefined,
      maxCreditLimit:
        (paramMaxCreditLimit?.trim()?.length ?? -1) > 0 ? paramMaxCreditLimit : undefined,
      startDate: paramStartDate ? new Date(paramStartDate) : undefined,
      endDate: paramEndDate ? new Date(paramEndDate) : undefined,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: APPLICATION_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getApplicationsByFilter({ ...params, ...filters });
    dispatch(getApplicationColumnNameList());
  }, []);

  const generateApplicationClick = useCallback(() => {
    history.push(`/applications/application/generate/`);
  }, []);

  // for params in url
  useEffect(() => {
    const params = {
      page: page || 1,
      limit: limit || 15,
      entityType: (entity?.trim()?.length ?? -1) > 0 ? entity : undefined,
      clientId: (clientId?.trim()?.length ?? -1) > 0 ? clientId : undefined,
      debtorId: (debtorId?.trim()?.length ?? -1) > 0 ? debtorId : undefined,
      status: (status?.trim()?.length ?? -1) > 0 ? status : undefined,
      minCreditLimit: (minCreditLimit?.trim()?.length ?? -1) > 0 ? minCreditLimit : undefined,
      maxCreditLimit: (maxCreditLimit?.trim()?.length ?? -1) > 0 ? maxCreditLimit : undefined,
      startDate: startDate ? new Date(startDate)?.toISOString() : undefined,
      endDate: endDate ? new Date(endDate)?.toISOString() : undefined,
    };
    const url = Object.entries(params)
      ?.filter(arr => arr[1] !== undefined)
      ?.map(([k, v]) => `${k}=${v}`)
      ?.join('&');
    history.replace(`${history?.location?.pathname}?${url}`);
  }, [
    history,
    total,
    pages,
    page,
    limit,
    entity,
    clientId,
    debtorId,
    status,
    minCreditLimit,
    maxCreditLimit,
    startDate,
    endDate,
  ]);

  const entityTypeSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.entityType?.find(e => {
      return (e?.value ?? '') === entity;
    });
    return foundValue ? [foundValue] : [];
  }, [entity, dropdownData]);
  const clientIdSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.clients?.find(e => {
      return (e?.value ?? '') === clientId;
    });
    return foundValue ? [foundValue] : [];
  }, [clientId, dropdownData]);
  const debtorIdSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.debtors?.find(e => {
      return (e?.value ?? '') === debtorId;
    });
    return foundValue ? [foundValue] : [];
  }, [debtorId, dropdownData]);
  const applicationStatusSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.applicationStatus?.find(e => {
      return (e?.value ?? '') === status;
    });
    return foundValue ? [foundValue] : [];
  }, [status, dropdownData]);

  const viewApplicationOnSelectRecord = useCallback(_id => {
    history.push(`/applications/detail/view/${_id}`);
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Application List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on application list"
            onClick={() => toggleFilterModal()}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Generate" buttonType="success" onClick={generateApplicationClick} />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs?.length > 0 ? (
          <>
            <div className="common-list-container">
              <Table
                align="left"
                valign="center"
                tableClass="main-list-table"
                data={docs}
                headers={headers}
                recordSelected={viewApplicationOnSelectRecord}
                rowClass="cursor-pointer"
                haveActions
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
          <div className="no-data-available">No data available</div>
        )
      ) : (
        <Loader />
      )}
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="filter"
          buttons={filterModalButtons}
          className="filter-modal application-filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Entity Type</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={dropdownData?.entityType}
              values={entityTypeSelectedValue}
              onChange={handleEntityTypeFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Client Name</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={dropdownData?.clients}
              values={clientIdSelectedValue}
              onChange={handleClientIdFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Debtor Name</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={dropdownData?.debtors}
              values={debtorIdSelectedValue}
              onChange={handleDebtorIdFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Application Status</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={dropdownData?.applicationStatus}
              values={applicationStatusSelectedValue}
              onChange={handleApplicationStatusFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title"> Minimum Credit Limit</div>
            <Input
              type="text"
              name="min-limit"
              value={minCreditLimit}
              placeholder="3000"
              onChange={handleMinLimitChange}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Maximum Credit Limit</div>
            <Input
              type="text"
              name="max-limit"
              value={maxCreditLimit}
              placeholder="100000"
              onChange={handleMaxLimitChange}
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
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
                className="filter-date-picker"
                selected={endDate}
                onChange={handleEndDateChange}
                placeholderText="To Date"
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
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
    </>
  );
};

export default ApplicationList;

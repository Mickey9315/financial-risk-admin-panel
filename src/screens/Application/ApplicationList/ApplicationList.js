import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Loader from '../../../common/Loader/Loader';
import Pagination from '../../../common/Pagination/Pagination';
import {
  applicationDownloadAction,
  changeApplicationColumnNameList,
  getApplicationColumnNameList,
  getApplicationFilter,
  getApplicationFilterDropDownDataBySearch,
  getApplicationsListByFilter,
  resetApplicationListPaginationData,
  saveApplicationColumnNameList,
  updateEditApplicationField,
  deleteApplicationApiCall,
} from '../redux/ApplicationAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { errorNotification } from '../../../common/Toast';
import { APPLICATION_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/ApplicationReduxConstants';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import ImportApplicationModal from '../ImportApplication/ImportApplicationModal';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import CustomSelect from '../../../common/CustomSelect/CustomSelect';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const ApplicationList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    page: paramPage,
    limit: paramLimit,
    entityType: paramEntityType,
    status: paramStatus,
    minCreditLimit: paramMinCreditLimit,
    maxCreditLimit: paramMaxCreditLimit,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  const { applicationColumnNameList, applicationDefaultColumnNameList } = useSelector(
    ({ application }) => application ?? {}
  );
  const applicationListWithPageData = useSelector(
    ({ application }) => application?.applicationList ?? {}
  );

  const isApplicationUpdatable = useModulePrivileges(SIDEBAR_NAMES.APPLICATION).hasWriteAccess;

  const { total, pages, page, limit, docs, headers } = useMemo(
    () => applicationListWithPageData ?? {},
    [applicationListWithPageData]
  );
  const { dropdownData } = useSelector(
    ({ application }) => application?.applicationFilterList ?? {}
  );

  const { applicationListFilters } = useSelector(
    ({ listFilterReducer }) => listFilterReducer ?? {}
  );
  const {
    applicationListColumnSaveButtonLoaderAction,
    applicationListColumnResetButtonLoaderAction,
    applicationListPageLoader,
    applicationDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);
  const defaultApplicationStatus =
    'SENT_TO_INSURER,REVIEW_APPLICATION,UNDER_REVIEW,PENDING_INSURER_REVIEW,AWAITING_INFORMATION,DRAFT,REVIEW_SURRENDERED';

  const appliedFilters = useMemo(() => {
    const endDate = tempFilter?.endDate
      ? moment(tempFilter?.endDate)?.set({ hour: 23, minute: 59, second: 59 }).toDate()
      : undefined;
    return {
      entityType:
        tempFilter?.entityType?.value?.toString()?.trim()?.length > 0
          ? tempFilter?.entityType?.value
          : undefined,
      clientId:
        tempFilter?.clientId?.value?.toString()?.trim()?.length > 0
          ? tempFilter?.clientId
          : undefined,
      debtorId:
        tempFilter?.debtorId?.value?.toString()?.trim()?.length > 0
          ? tempFilter?.debtorId

          : undefined,
      status: tempFilter?.status?.toString()?.trim()?.length > 0 ? tempFilter?.status : undefined,
      minCreditLimit:
        tempFilter?.minCreditLimit?.toString()?.trim()?.length > 0
          ? tempFilter?.minCreditLimit
          : undefined,
      maxCreditLimit:
        tempFilter?.maxCreditLimit?.toString()?.trim()?.length > 0
          ? tempFilter?.maxCreditLimit
          : undefined,
      startDate: tempFilter?.startDate || undefined,
      endDate,
    };
  }, [tempFilter]);

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

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const handleEntityTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'entityType',
      value: event,
    });
  }, []);
  const handleClientIdFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'clientId',
      value: event,
    });
  }, []);
  const handleDebtorIdFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'debtorId',
      value: event,
    });
  }, []);
  const handleApplicationStatusFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'status',
      value: event?.map(value => value.value).join(','),
    });
  }, []);
  const handleMinLimitChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'minCreditLimit',
        value: parseInt(event?.target?.value?.toString()?.replaceAll(',', ''), 10),
      });
    },
    [dispatchFilter]
  );
  const handleMaxLimitChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'maxCreditLimit',
        value: parseInt(event?.target?.value?.toString()?.replaceAll(',', ''), 10),
      });
    },
    [dispatchFilter]
  );

  const getApplicationsByFilter = async (params = {}, cb, overrideParams = false) => {
    if (
      tempFilter?.startDate &&
      tempFilter?.endDate &&
      moment(tempFilter?.endDate).isBefore(tempFilter?.startDate)
    ) {
      errorNotification('Please enter a valid date range');
      resetFilterDates();
    } else {
      let data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...appliedFilters,
        ...params,
      };
      if (overrideParams) {
        data = {
          ...params,
        };
      }
      try {
        await dispatch(getApplicationsListByFilter(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    }
  };

  // on record limit changed
  const onSelectLimit = useCallback(
    async newLimit => {
      await getApplicationsByFilter({ page: 1, limit: newLimit });
    },
    [getApplicationsByFilter]
  );
  // on pagination changed
  const pageActionClick = useCallback(
    async newPage => {
      await getApplicationsByFilter({ page: newPage, limit });
    },
    [getApplicationsByFilter, limit]
  );

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const onClickApplyFilter = async params => {
    let data = {
      page: 1,
      limit,
    };
    toggleFilterModal();
    if (params) {
      data = { ...data, ...params };
    }
    await getApplicationsByFilter(data, null, !!params);
  };

  const onClickResetFilter = async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'status',
      value: defaultApplicationStatus,
    });

    await onClickApplyFilter({ status: defaultApplicationStatus });
  };

  const filterModalButtons = [
    {
      title: 'Reset Defaults',
      buttonType: 'outlined-primary',
      onClick: onClickResetFilter,
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
      onClick: () => onClickApplyFilter(),
    },
  ];
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
        await getApplicationsByFilter();
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
    await getApplicationsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getApplicationsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
      data: applicationDefaultColumnNameList,
    });
    toggleCustomField();
  }, [toggleCustomField, applicationDefaultColumnNameList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: applicationListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: applicationListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      toggleCustomField,
      onClickSaveColumnSelection,
      applicationListColumnSaveButtonLoaderAction,
      applicationListColumnResetButtonLoaderAction,
    ]
  );

  const { defaultFields, customFields } = useMemo(
    () => applicationColumnNameList ?? { defaultFields: [], customFields: [] },
    [applicationColumnNameList]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeApplicationColumnNameList(data));
  }, []);

  useEffect(() => {
    dispatch(getApplicationFilter());
  }, []);

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      entityType:
        (paramEntityType?.trim()?.length ?? -1) > 0
          ? paramEntityType
          : applicationListFilters?.entityType ?? undefined,
      clientId: applicationListFilters?.clientId,
      debtorId: applicationListFilters?.debtorId,

      status:
        (paramStatus?.trim()?.length ?? -1) > 0
          ? paramStatus
          : applicationListFilters?.status,
      minCreditLimit:
        (paramMinCreditLimit?.trim()?.length ?? -1) > 0
          ? paramMinCreditLimit
          : applicationListFilters?.minCreditLimit,
      maxCreditLimit:
        (paramMaxCreditLimit?.trim()?.length ?? -1) > 0
          ? paramMaxCreditLimit
          : applicationListFilters?.maxCreditLimit,
      startDate: paramStartDate || applicationListFilters?.startDate,
      endDate: paramEndDate || applicationListFilters?.endDate,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getApplicationsByFilter({ ...params, ...filters });
    dispatch(getApplicationColumnNameList());
  }, []);

  const generateApplicationClick = useCallback(() => {
    dispatch(
      updateEditApplicationField('company', 'country', {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      })
    );
    history.push(`/applications/generate/`);
  }, []);

  // for params in url
  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      entityType:
        finalFilter?.entityType?.toString()?.trim()?.length > 0
          ? finalFilter?.entityType?.value
          : undefined,
      clientId:
        finalFilter?.clientId?.value?.toString()?.trim()?.length > 0

          ? finalFilter?.clientId?.value
          : undefined,
      debtorId:
        finalFilter?.debtorId?.value?.toString()?.trim()?.length > 0
          ? finalFilter?.debtorId?.value
          : undefined,
      status: finalFilter?.status?.toString()?.trim()?.length > 0 ? finalFilter?.status : undefined,
      minCreditLimit:
        finalFilter?.minCreditLimit?.toString()?.trim()?.length > 0
          ? finalFilter?.minCreditLimit
          : undefined,
      maxCreditLimit:
        finalFilter?.maxCreditLimit?.toString()?.trim()?.length > 0
          ? finalFilter?.maxCreditLimit
          : undefined,
      startDate: finalFilter?.startDate || undefined,
      endDate: finalFilter?.endDate || undefined,
    },
    [page, limit, { ...finalFilter }]
  );
 
  const applicationStatusSelectedValue = useMemo(() => {
    const foundValue = dropdownData?.applicationStatus?.filter(e => {
      return tempFilter?.status?.split(',').includes(e.value);
    });
    return foundValue ?? [];
  }, [tempFilter?.status, dropdownData]);

  // eslint-disable-next-line no-shadow
  const viewApplicationOnSelectRecord = useCallback((id, data) => {
    if (data?.status === 'Draft') {
      history.push(`/applications/generate/?applicationId=${id}`);
    } else {
      history.push(`/applications/detail/view/${id}`);
    }
  }, []);

  const downloadApplication = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const finalFilters = {
          ...appliedFilters,
          clientId: appliedFilters?.clientId?.value,
          debtorId: appliedFilters?.debtorId?.value
        };
        const response = await applicationDownloadAction(finalFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [docs?.length, appliedFilters]);

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    const options = {
      searchString: text,
      entityType: searchEntity,
      requestFrom: 'application',
    };
    dispatch(getApplicationFilterDropDownDataBySearch(options));
  }, []);

  useEffect(() => {
    dispatch(resetApplicationListPaginationData(page, pages, total, limit));
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('applicationListFilters', finalFilter));
  }, [finalFilter]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal],
  );

  const { generateApplicationDeleteButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false,
  );

  const callBack = useCallback(() => {
    toggleConfirmationModal();
    const filters = {
      entityType:
        (paramEntityType?.trim()?.length ?? -1) > 0 ? paramEntityType : applicationListFilters?.entityType ?? undefined,
      clientId: applicationListFilters?.clientId,
      debtorId: applicationListFilters?.debtorId,

      status: (paramStatus?.trim()?.length ?? -1) > 0 ? paramStatus : applicationListFilters?.status,
      minCreditLimit:
        (paramMinCreditLimit?.trim()?.length ?? -1) > 0 ? paramMinCreditLimit : applicationListFilters?.minCreditLimit,
      maxCreditLimit:
        (paramMaxCreditLimit?.trim()?.length ?? -1) > 0 ? paramMaxCreditLimit : applicationListFilters?.maxCreditLimit,
      startDate: paramStartDate || applicationListFilters?.startDate,
      endDate: paramEndDate || applicationListFilters?.endDate,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getApplicationsByFilter({ ...filters });
  }, [getApplicationsByFilter]);

  const deleteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteApplicationApiCall(applicationId, callBack));
          } catch (e) {
            /**/
          }
        },
        isLoading: generateApplicationDeleteButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, applicationId, generateApplicationDeleteButtonLoaderAction],
  );


  const deleteApplication = appId => {
    setApplicationId(appId);
    setShowConfirmModal(true);
  };

  return (
    <>
      {!applicationListPageLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Application List</div>
            <div className="page-header-button-container">
              <UserPrivilegeWrapper moduleName="import-application-dump">
                <ImportApplicationModal />
              </UserPrivilegeWrapper>
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download applications"
                onClick={downloadApplication}
                isLoading={applicationDownloadButtonLoaderAction}
              />
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
              {isApplicationUpdatable && (
                <Button title="Generate" buttonType="success" onClick={generateApplicationClick} />
              )}
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
                  recordSelected={viewApplicationOnSelectRecord}
                  rowClass="cursor-pointer"
                  deleteApplication={deleteApplication}
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

          {showConfirmModal && (
            <Modal header="Delete Application" buttons={deleteButtons} hideModal={toggleConfirmationModal}>
              <span className="confirmation-message">Are you sure you want to delete this Application?</span>
            </Modal>
          )}

          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal application-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Entity Type</div>
                <Select
                  className="filter-select"
                  placeholder="Select Entity Type"
                  name="role"
                  options={dropdownData?.entityType}
                  value={tempFilter?.entityType}
                  onChange={handleEntityTypeFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Client Name</div>
                <Select
                  className="filter-select"
                  placeholder="Select Client"
                  name="role"
                  options={dropdownData?.clients}
                  value={tempFilter?.clientId}
                  onChange={handleClientIdFilterChange}
                  onInputChange={text => handleOnSelectSearchInputChange('clients', text)}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Debtor Name</div>
                <Select
                  className="filter-select"
                  placeholder="Select Debtor"
                  name="role"
                  options={dropdownData?.debtors}
                  value={tempFilter?.debtorId}
                  onChange={handleDebtorIdFilterChange}
                  onInputChange={text => handleOnSelectSearchInputChange('debtors', text)}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Application Status</div>
                <CustomSelect
                  className="application-status-select"
                  options={dropdownData?.applicationStatus}
                  placeholder="Select Status"
                  onChangeCustomSelect={handleApplicationStatusFilterChange}
                  value={applicationStatusSelectedValue}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title"> Minimum Requested Amount</div>
                <Input
                  type="text"
                  name="min-limit"
                  value={NumberCommaSeparator(tempFilter?.minCreditLimit)}
                  placeholder="0"
                  onChange={handleMinLimitChange}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Maximum Requested Amount</div>
                <Input
                  type="text"
                  name="max-limit"
                  value={NumberCommaSeparator(tempFilter?.maxCreditLimit)}
                  placeholder="0"
                  onChange={handleMaxLimitChange}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Expiry Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.endDate ? new Date(tempFilter?.endDate) : null}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
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
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ApplicationList;

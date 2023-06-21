import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import { 
  applyFinalFilter,
  changeAlertColumnList,
  changeAlertsFilterFields,
  getAlertColumnList,
  getAlertFilterDropdownData,
  getAlertsList,
  getAlertsClientDropdownData,
  getAlertsFilterDropDownDataBySearch,
  alertDownloadAction,
  resetCurrentFilter,
  resetAlertListData,
  saveAlertColumnList,
  getAlertDetails,
  clearAlertDetails,
  updateAlertStatus,
} from '../redux/AlertsAction';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import IconButton from '../../../common/IconButton/IconButton';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { ALERTS_REDUX_CONSTANTS } from '../redux/AlertsReduxConstants';
import Modal from '../../../common/Modal/Modal';
import CustomSelect from '../../../common/CustomSelect/CustomSelect';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { startGeneralLoaderOnRequest } from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import Select from '../../../common/Select/Select';
import { REPORTS_SEARCH_ENTITIES } from '../../../constants/EntitySearchConstants';
import { filterDateValidations } from '../alertFilterValidations';
import { ALERT_TYPE_ROW, checkAlertValue } from '../../../helpers/AlertHelper';

const AlertList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { page: paramPage, limit: paramLimit } = useQueryParams();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const [isAlertModal, setIsAlertModal] = useState(false);
  const alertList = useSelector(({ alerts }) => alerts?.alertsList ?? {});
  const alertDetail = useSelector(({ alerts }) => alerts?.alertDetail ?? {});
  const { alertColumnList, alertDefaultColumnList } = useSelector(({ alerts }) => alerts ?? {});

  const {
    alertListColumnSaveButtonLoaderAction,
    alertListColumnResetButtonLoaderAction,
    alertDownloadButtonLoaderAction,
    viewAlertListLoader,
    onlyAlertListLoader,
    alertDetailsLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { docs, headers, page, limit, pages, total } = useMemo(() => alertList, [alertList]);

  const alertFilters = useSelector(({ alertAllFilters }) => alertAllFilters ?? {});
  const alertEntityListData = useSelector(({ alerts }) => alerts?.alertEntityListData ?? []);
  const alertStatusListData = useSelector(({ alerts }) => alerts?.alertStatusListData ?? []);
  const alertId = useSelector(({ alerts }) => alerts?.alertId ?? '');
  // end

  const { defaultFields, customFields } = useMemo(
    () => alertColumnList ?? { defaultFields: [], customFields: [] },
    [alertColumnList]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const tempFilters = useMemo(() => {
    const params = {};
    Object.entries(alertFilters?.tempFilter ?? {})?.forEach(
      ([key, value]) => {
        params[key] = value || undefined;
      }
    );

    return { ...params };
  }, [alertFilters]);
  const finalFilters = useMemo(() => {
    const params = {};
    Object.entries(alertFilters?.finalFilter ?? {})?.forEach(
      ([key, value]) => {
        params[key] = value || undefined;
      }
    );

    return { ...params };
  }, [alertFilters]);

  const getAlertListByFilter = useCallback(
    async (initialParams = { page: 1, limit: 15 }, cb, isReset) => {
      // eslint-disable-next-line no-unused-vars
      const appliedFilters = isReset ? {} : tempFilters;
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...initialParams,
        ...appliedFilters,
      };

      let isFiltersValid = true;
      isFiltersValid = filterDateValidations(tempFilters);
      try {
        if (isFiltersValid) {
          startGeneralLoaderOnRequest('viewAlertListLoader');
          await dispatch(getAlertsList(params));
          if (cb && typeof cb === 'function') {
            cb();
          }
        } else {
          await dispatch(resetCurrentFilter());
        }
      } catch (e) {
        /**/
      }
    },
    [page, limit, tempFilters]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.GET_ALERT_COLUMN_LIST,
      data: alertDefaultColumnList,
    });
    setCustomFieldModal(false);
  }, [alertDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(alertColumnList, alertDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveAlertColumnList({ alertColumnList }));
        toggleCustomField();
        startGeneralLoaderOnRequest('onlyAlertListLoader');
        await getAlertListByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        toggleCustomField();
        throw Error();
      }
    } catch (e) {
      /**/
    }
  }, [
    toggleCustomField,
    alertColumnList,
    getAlertListByFilter,
    alertDefaultColumnList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveAlertColumnList({ isReset: true, }));
      dispatch(getAlertColumnList());
      await getAlertListByFilter();
      setCustomFieldModal(false);
    } catch (e) {
      /**/
    }
  }, [getAlertListByFilter]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: alertListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: alertListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      alertListColumnSaveButtonLoaderAction,
      alertListColumnResetButtonLoaderAction,
    ]
  );
  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeAlertColumnList(data));
  }, []);

  // on record limit changed
  const onSelectLimit = useCallback(
    async newLimit => {
      await getAlertListByFilter({ page: 1, limit: newLimit });
    },
    [getAlertListByFilter]
  );

  // on pagination changed
  const pageActionClick = useCallback(
    async newPage => {
      await getAlertListByFilter({ page: newPage, limit });
    },
    [getAlertListByFilter, limit]
  );

  /*
   * Filter
   */

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const changeFilterFields = useCallback(
    (name, value) => {
      dispatch(changeAlertsFilterFields(name, value));
    },
    [alertFilters]
  );

  const handleSelectInputChange = useCallback(e => {
    changeFilterFields(e.name, e);
  }, []);

  const handleMultiSelectInputChange = useCallback((fieldName, selectedList) => {
    changeFilterFields(fieldName, selectedList?.length > 0 ? selectedList : undefined);
  }, []);

  const handleDateInputChange = useCallback((name, date) => {
    changeFilterFields(name, new Date(date).toISOString());
  }, []);

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    const options = {
      searchString: text,
      entityType: REPORTS_SEARCH_ENTITIES?.[searchEntity],
      requestFrom: 'report',
    };
    dispatch(getAlertsFilterDropDownDataBySearch(options));
  }, []);

  const handleCustomSearch = (text, fieldName) => {
    if (fieldName !== 'limitType') {
      handleOnSelectSearchInputChange(fieldName, text);
    }
  };
  
  const onSearchChange = _.debounce(handleCustomSearch, 800);
  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'select': {
          component = (
            <Select
              className="filter-select"
              placeholder={input.placeHolder}
              name="role"
              isSearchble
              options={alertEntityListData?.[input.name]}
              value={alertFilters?.tempFilter[input.name]}
              onChange={handleSelectInputChange}
              onInputChange={
                ['debtorId'].includes(input?.name)
                  ? text => handleOnSelectSearchInputChange(input?.name, text)
                  : undefined
              }
            />
          );
          break;
        }
        case 'multiSelect': {
          component = (
            <CustomSelect
              options={alertEntityListData?.[input.name]}
              placeholder={input.placeHolder}
              onChangeCustomSelect={selectedList =>
                handleMultiSelectInputChange(input.name, selectedList)
              }
              value={alertFilters?.tempFilter?.[input.name]}
              onSearchChange={text => onSearchChange(text, input.name)}
            />
          );
          break;
        }
        case 'dateRange':
          component = input.range.map(date => (
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                name={date.name}
                className="filter-date-picker"
                selected={
                  alertFilters?.tempFilter[date.name]
                    ? new Date(alertFilters?.tempFilter[date.name])
                    : null
                }
                onChange={selectedDate => handleDateInputChange(date.name, selectedDate)}
                placeholderText={date.placeHolder}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
              />
              <span className="material-icons-round">event</span>
            </div>
          ));
          break;
        default:
          component = <span />;
      }
      return (
        <>
          <div className="filter-modal-row">
            <div className="form-title">{input.label}</div>
            {component}
          </div>
        </>
      );
    },
    [
      alertEntityListData,
      alertFilters,
      handleSelectInputChange,
      handleDateInputChange,
      handleMultiSelectInputChange,
      handleOnSelectSearchInputChange,
    ]
  );

  const applyAlertsFilter = useCallback(async () => {
    toggleFilterModal();
    await getAlertListByFilter();
    dispatch(applyFinalFilter());
  }, [getAlertListByFilter, toggleFilterModal]);

  const resetAlertsFilter = useCallback(
    async params => {
      await dispatch(resetCurrentFilter());
      setFilterModal(false);
      await getAlertListByFilter(params ?? {}, () => { }, true);
      dispatch(applyFinalFilter());
    },
    [tempFilters]
  );

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: resetAlertsFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatch({
            type: ALERTS_REDUX_CONSTANTS.CLOSE_ALERT_FILTER_ACTION,
          });
          toggleFilterModal();
        },
      },
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: applyAlertsFilter,
      },
    ],
    [toggleFilterModal, applyAlertsFilter, resetAlertsFilter]
  );

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    startGeneralLoaderOnRequest('viewAlertListLoader');
    await dispatch(getAlertsClientDropdownData());
    await dispatch(getAlertFilterDropdownData());
    await getAlertListByFilter({ ...params, ...finalFilters });
    dispatch(getAlertColumnList());
    return () => {
      dispatch(resetAlertListData());
      startGeneralLoaderOnRequest('viewAlertListLoader');
    };
  }, []);

  // for params in url
  useEffect(() => {
    const otherFilters = {};
    Object.entries(finalFilters).forEach(([key, value]) => {
      if (_.isArray(value)) {
        otherFilters[key] = value
          ?.map(record => record?.value)
          .join(',');
      } else if (_.isObject(value)) {
        otherFilters[key] = value?.value;
      } else {
        otherFilters[key] = value || undefined;
      }
    });
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      ...otherFilters,
    };
    const url = Object.entries(params)
      ?.filter(arr => arr[1] !== undefined)
      ?.map(([k, v]) => `${k}=${v}`)
      ?.join('&');
    history.push(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit]);

  useEffect(() => {
    dispatch({ type: ALERTS_REDUX_CONSTANTS.INITIALIZE_FILTERS });
    dispatch({ type: ALERTS_REDUX_CONSTANTS.INITIALIZE_ALERTS });
  }, []);

  const onSelectRecord = useCallback(
    id => {
      dispatch(getAlertDetails(id));
      dispatch({
        type: ALERTS_REDUX_CONSTANTS.SAVE_ALERT_ID,
        data: id,
      });
      setIsAlertModal(true);
    },
    []
  );

  const onCloseAlertModal = useCallback(() => {
    setIsAlertModal(false);
    dispatch(clearAlertDetails());
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.REMOVE_ALERT_ID,
    });
  }, []);

  const alertModalButtons = useMemo(
    () => [{ title: 'Close', buttonType: 'primary-1', onClick: onCloseAlertModal }],
    []
  );

  const handleOnSelectStatusInputChange = useCallback((event) => {
    dispatch(updateAlertStatus(alertId, event));
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_DETAILS_STATUS,
      data: event?.value,
    });
  }, [alertId]);

  // download
  const downloadReport = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const response = await alertDownloadAction(tempFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [tempFilters, docs?.length]);

  return (
    <>
      {!viewAlertListLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">
              Alert List
            </div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download alerts"
                onClick={downloadReport}
                isLoading={alertDownloadButtonLoaderAction}
              />
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply tempFilters on alerts"
                onClick={toggleFilterModal}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                buttonTitle="Click to select custom fields"
                onClick={toggleCustomField}
              />
            </div>
          </div>

          {docs?.length > 0 ? (
            [
              !onlyAlertListLoader ? (
                <>
                  <div className="common-list-container">
                    <Table
                      align="left"
                      valign="center"
                      tableClass="main-list-table"
                      data={docs}
                      headers={headers}
                      recordSelected={onSelectRecord}
                      rowClass="cursor-pointer"
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
              ),
            ]
          ) : (
            <div className="no-record-found">No record found</div>
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
          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal overdue-filter-modal"
            >
              <>{alertFilters?.filterInputs?.map(getComponentFromType)}</>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
      {isAlertModal && (
        <Modal header="Alerts" buttons={alertModalButtons} className="alert-details-modal">
          {!alertDetailsLoader ? (
            (() =>
              !_.isEmpty(alertDetail) ? (
                <>
                  <div className={`alert-type ${ALERT_TYPE_ROW[alertDetail?.priority]}`}>
                    <span className="material-icons-round f-h2">warning</span>
                    <div className="alert-type-right-texts">
                      <div className="f-16 f-bold">{alertDetail?.priority}</div>
                      <div className="font-primary f-14">{alertDetail?.name}</div>
                    </div>
                  </div>
                  {alertDetail?.generalDetails?.length > 0 && (
                    <div className="alert-details-wrapper">
                      <span className="font-primary f-16 f-bold">General Details</span>
                      <div className="alert-general-details">
                        {alertDetail?.generalDetails?.map(detail => (
                          <>
                            <span>{detail?.label}</span>
                            <div className="alert-detail-value-field">
                              {checkAlertValue(detail)}
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                  {alertDetail?.alertDetails?.length > 0 && (
                    <div className="alert-details-wrapper">
                      <span className="font-primary f-16 f-bold">Alert Details</span>
                      <div className="alert-detail">
                        {alertDetail?.alertDetails?.map(detail => {
                          if (detail.label === 'Status') {
                            return (
                              <>
                                <span>{detail?.label}</span>
                                <Select
                                  className="filter-select"
                                  placeholder="Select Status"
                                  name="role"
                                  options={alertStatusListData}
                                  value={
                                    detail?.value === 'Pending'
                                      ? alertStatusListData[0]
                                      : alertStatusListData[1]
                                  }
                                  onChange={handleOnSelectStatusInputChange}
                                  isSearchble
                                />
                              </>
                            );
                          }
                          return (
                            <>
                              <span>{detail?.label}</span>
                              <div className="alert-detail-value-field">
                                {checkAlertValue(detail)}
                              </div>
                            </>
                          );
                        } 
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-record-found">No record found</div>
              ))()
          ) : (
            <Loader />
          )}
        </Modal>
      )}
    </>
  );
};

export default AlertList;

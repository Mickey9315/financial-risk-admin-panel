import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import { reportType } from '../../../helpers/reportTypeHelper';
import {
  applyFinalFilter,
  changeReportColumnList,
  changeReportsFilterFields,
  getAlertFilterDropdownData,
  getReportColumnList,
  getReportList,
  getReportsClientDropdownData,
  getReportsFilterDropDownDataBySearch,
  reportDownloadAction,
  resetCurrentFilter,
  resetReportListData,
  saveReportColumnList,
} from '../redux/ReportsAction';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import IconButton from '../../../common/IconButton/IconButton';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { REPORTS_REDUX_CONSTANTS } from '../redux/ReportsReduxConstants';
import Modal from '../../../common/Modal/Modal';
import CustomSelect from '../../../common/CustomSelect/CustomSelect';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { startGeneralLoaderOnRequest } from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import Select from '../../../common/Select/Select';
import { REPORTS_SEARCH_ENTITIES } from '../../../constants/EntitySearchConstants';
import { filterDateValidations } from '../reportFilterValidations';

const ViewReport = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { type: paramReport } = useParams();
  const { page: paramPage, limit: paramLimit } = useQueryParams();
  const [customFieldModal, setCustomFieldModal] = useState(false);

  const reportList = useSelector(({ reports }) => reports?.reportsList ?? {});
  const { reportColumnList, reportDefaultColumnList } = useSelector(({ reports }) => reports ?? {});

  const {
    reportListColumnSaveButtonLoaderAction,
    reportListColumnResetButtonLoaderAction,
    reportDownloadButtonLoaderAction,
    viewReportListLoader,
    onlyReportListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { docs, headers, page, limit, pages, total } = useMemo(() => reportList, [reportList]);
  const reportName = useMemo(() => {
    const selectedReport = reportType.filter(report => report?.url === paramReport);
    return selectedReport ? selectedReport?.[0]?.name : '';
  }, [paramReport]);

  // filter
  const currentFilter = useMemo(() => reportType.find(report => report.url === paramReport), [reportType, paramReport]);
  const reportFilters = useSelector(({ reportAllFilters }) => reportAllFilters ?? {});
  const reportEntityListData = useSelector(({ reports }) => reports?.reportEntityListData ?? []);
  const [reviewReportFilterDate, setReviewReportFilterDate] = useState(new Date());
  // end

  const { defaultFields, customFields } = useMemo(
    () => reportColumnList ?? { defaultFields: [], customFields: [] },
    [reportColumnList],
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal],
  );
  const tempFilters = useMemo(() => {
    const params = {};
    Object.entries(reportFilters?.[currentFilter.filter]?.tempFilter ?? {})?.forEach(([key, value]) => {
      params[key] = value || undefined;
    });

    if (currentFilter.filter === 'reviewReport') {
      params.date = reviewReportFilterDate.toISOString() || undefined;
    }
    return { ...params };
  }, [reportFilters, currentFilter, reviewReportFilterDate]);
  const finalFilters = useMemo(() => {
    const params = {};
    Object.entries(reportFilters?.[currentFilter.filter]?.finalFilter ?? {})?.forEach(([key, value]) => {
      params[key] = value || undefined;
    });

    if (currentFilter.filter === 'reviewReport') {
      params.date = reviewReportFilterDate.toISOString() || undefined;
    }
    return { ...params };
  }, [reportFilters, currentFilter, reviewReportFilterDate]);

  const backToReports = useCallback(() => history.replace('/reports'), [history]);

  const getReportListByFilter = useCallback(
    async (initialParams = { page: 1, limit: 15 }, cb, isReset) => {
      // eslint-disable-next-line no-unused-vars
      const appliedFilters = isReset ? {} : tempFilters;
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        columnFor: paramReport ?? '',
        ...initialParams,
        ...appliedFilters,
      };

      let isFiltersValid = true;
      if (
        currentFilter?.filter === 'clientList' ||
        currentFilter?.filter === 'limitList' ||
        currentFilter?.filter === 'pendingApplications' ||
        currentFilter?.filter === 'alert'
      ) {
        isFiltersValid = filterDateValidations(currentFilter.filter, tempFilters);
      }
      if (currentFilter.filter === 'reviewReport') {
        if (initialParams?.date) {
          params.date = new Date(initialParams?.date)?.toISOString();
        } else {
          params.date = new Date(reviewReportFilterDate).toISOString();
        }
      }
      try {
        if (isFiltersValid) {
          startGeneralLoaderOnRequest('viewReportListLoader');
          await dispatch(getReportList(params, currentFilter?.filter));
          if (cb && typeof cb === 'function') {
            cb();
          }
        } else {
          await dispatch(resetCurrentFilter(currentFilter.filter));
        }
      } catch (e) {
        /**/
      }
    },
    [page, limit, tempFilters, currentFilter, reviewReportFilterDate, paramReport],
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.GET_REPORT_COLUMN_LIST,
      data: reportDefaultColumnList,
    });
    setCustomFieldModal(false);
  }, [reportDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(reportColumnList, reportDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveReportColumnList({ reportColumnList, reportFor: paramReport }));
        toggleCustomField();
        startGeneralLoaderOnRequest('onlyReportListLoader');
        await getReportListByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        toggleCustomField();
        throw Error();
      }
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, reportColumnList, getReportListByFilter, reportDefaultColumnList, paramReport]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveReportColumnList({ isReset: true, reportFor: paramReport }));
      dispatch(getReportColumnList(paramReport));
      await getReportListByFilter();
      setCustomFieldModal(false);
    } catch (e) {
      /**/
    }
  }, [getReportListByFilter, paramReport]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: reportListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: reportListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      reportListColumnSaveButtonLoaderAction,
      reportListColumnResetButtonLoaderAction,
    ],
  );
  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeReportColumnList(data));
  }, []);

  // on record limit changed
  const onSelectLimit = useCallback(
    async newLimit => {
      await getReportListByFilter({ page: 1, limit: newLimit });
    },
    [getReportListByFilter],
  );

  // on pagination changed
  const pageActionClick = useCallback(
    async newPage => {
      await getReportListByFilter({ page: newPage, limit });
    },
    [getReportListByFilter, limit],
  );

  /*
   * Filter
   */

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal],
  );

  const changeFilterFields = useCallback(
    (name, value) => {
      dispatch(changeReportsFilterFields(currentFilter.filter, name, value));
    },
    [reportFilters, currentFilter],
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
    dispatch(getReportsFilterDropDownDataBySearch(options));
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
              options={reportEntityListData?.[input.name]}
              value={reportFilters?.[currentFilter.filter]?.tempFilter[input.name]}
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
              options={reportEntityListData?.[input.name]}
              placeholder={input.placeHolder}
              onChangeCustomSelect={selectedList => handleMultiSelectInputChange(input.name, selectedList)}
              value={reportFilters?.[currentFilter.filter]?.tempFilter?.[input.name]}
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
                  reportFilters?.[currentFilter.filter]?.tempFilter[date.name]
                    ? new Date(reportFilters?.[currentFilter.filter]?.tempFilter[date.name])
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
      reportEntityListData,
      reportFilters,
      currentFilter,
      handleSelectInputChange,
      handleDateInputChange,
      handleMultiSelectInputChange,
      handleOnSelectSearchInputChange,
    ],
  );

  const applyReportsFilter = useCallback(async () => {
    toggleFilterModal();
    await getReportListByFilter();
    dispatch(applyFinalFilter(currentFilter.filter));
  }, [getReportListByFilter, toggleFilterModal]);

  const resetReportsFilter = useCallback(
    async params => {
      await dispatch(resetCurrentFilter(currentFilter.filter));
      setFilterModal(false);
      await getReportListByFilter(params ?? {}, () => {}, true);
      dispatch(applyFinalFilter(currentFilter.filter));
    },
    [currentFilter, tempFilters],
  );

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: resetReportsFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatch({
            type: REPORTS_REDUX_CONSTANTS.CLOSE_REPORT_FILTER_ACTION,
            filterFor: currentFilter.filter,
          });
          toggleFilterModal();
        },
      },
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: applyReportsFilter,
      },
    ],
    [toggleFilterModal, applyReportsFilter, resetReportsFilter, currentFilter],
  );

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    startGeneralLoaderOnRequest('viewReportListLoader');
    await dispatch(getReportsClientDropdownData());
    if (paramReport === 'alert') {
      await dispatch(getAlertFilterDropdownData());
    }
    await getReportListByFilter({ ...params, ...finalFilters });
    dispatch(getReportColumnList(paramReport));
    return () => {
      dispatch(resetReportListData());
      startGeneralLoaderOnRequest('viewReportListLoader');
    };
  }, []);

  // for params in url
  useEffect(() => {
    const otherFilters = {};
    Object.entries(finalFilters).forEach(([key, value]) => {
      if (_.isArray(value)) {
        otherFilters[key] = value
          ?.map(record => (currentFilter?.filter === 'claimsReport' ? record?.secondValue : record?.value))
          .join(',');
      } else if (_.isObject(value)) {
        otherFilters[key] = currentFilter?.filter === 'claimsReport' ? value?.secondValue : value?.value;
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
  }, [history, total, pages, page, limit, tempFilters]);

  // extra filter for reviewReport
  const handleSelectDateChange = async date => {
    setReviewReportFilterDate(date);
    resetReportsFilter({ date });
  };

  useEffect(() => {
    dispatch({ type: REPORTS_REDUX_CONSTANTS.INITIALIZE_FILTERS });
  }, []);
  // download
  const downloadReport = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const response = await reportDownloadAction(paramReport, tempFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [paramReport, tempFilters, docs?.length]);

  return (
    <>
      {!viewReportListLoader ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToReports}>Reports</span>
              <span className="material-icons-round">navigate_next</span>
              <span>{reportName}</span>
            </div>
            <div className="page-header-button-container">
              {currentFilter.filter === 'reviewReport' && (
                <div className="date-picker-container month-year-picker filter-date-picker-container mr-15 review-report-month-picker">
                  <DatePicker
                    selected={reviewReportFilterDate}
                    onChange={handleSelectDateChange}
                    showMonthYearPicker
                    showFullMonthYearPicker
                    placeholderText="Select Month"
                    dateFormat="MMM yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
              )}
              {['limit-list', 'limit-history', 'pending-application', 'usage', 'review', 'usage-per-client', 'alert'].includes(
                paramReport,
              ) && (
                <IconButton
                  buttonType="primary-1"
                  title="cloud_download"
                  className="mr-10"
                  buttonTitle={`Click to download ${reportName}`}
                  onClick={downloadReport}
                  isLoading={reportDownloadButtonLoaderAction}
                />
              )}
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle={`Click to apply tempFilters on ${reportName}`}
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
          {reportName === 'Limit List' && (
            <div>
              <div className="disclaimer-title">Disclaimer</div>
              <div className="disclaimer-body">
                Full details of the terms and conditions relating to individual credit limits can
                only be determined by reference to the original limit endorsements issued by your
                insurer. The list provided is a summary of your credit limits only, based on
                information obtained from the insurer&apos;s website. Whilst every precaution has been
                taken by TCR to provide you with accurate and up-to-date information, TCR cannot be
                held responsible for any errors or omissions contained herein.
              </div>
            </div>
          )}
          {docs?.length > 0 ? (
            [
              !onlyReportListLoader ? (
                <>
                  <div className="common-list-container">
                    <Table align="left" valign="center" tableClass="main-list-table" data={docs} headers={headers} />
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
              <>{reportFilters?.[currentFilter?.filter]?.filterInputs?.map(getComponentFromType)}</>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewReport;

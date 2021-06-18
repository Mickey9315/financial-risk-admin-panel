import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { reportType } from '../../../helpers/reportTypeHelper';
import { getAllClientList } from '../../Users/redux/UserManagementAction';
import {
  changeReportColumnList,
  getReportColumnList,
  getReportList,
  getReportsClientDropdownData,
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
import CustomSelect from '../../../common/CustomSelect/CustomSelect';

const ViewReport = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { type: paramReport } = useParams();
  const { page: paramPage, limit: paramLimit } = useQueryParams();
  const customSelectFor = ['limit-list', 'usage-per-client', 'limit-history', 'claims'];
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const reportList = useSelector(({ reports }) => reports?.reportsList ?? {});
  const reportColumnList = useSelector(({ reports }) => reports?.reportColumnList ?? {});
  const reportDefaultColumnList = useSelector(
    ({ reports }) => reports?.reportDefaultColumnList ?? {}
  );
  const reportClientList = useSelector(({ reports }) => reports?.reportDropdownClientData ?? []);

  const clientList = useMemo(() => reportClientList?.clients, [reportClientList]);
  const {
    reportListColumnSaveButtonLoaderAction,
    reportListColumnResetButtonLoaderAction,
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);
  const { docs, headers, page, limit, pages, total, isLoading } = useMemo(() => reportList, [
    reportList,
  ]);
  const reportName = useMemo(() => {
    const selectedReport = reportType.filter(report => report?.url === paramReport);
    return selectedReport ? selectedReport?.[0]?.name : '';
  }, [paramReport]);

  const { defaultFields, customFields } = useMemo(
    () => reportColumnList ?? { defaultFields: [], customFields: [] },
    [reportColumnList]
  );

  const backToReports = useCallback(() => history.replace('/reports'), [history]);

  const getReportListByFilter = useCallback(
    (initialParams = { page: 1, limit: 15 }, cb) => {
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        columnFor: paramReport ?? '',
        ...initialParams,
      };
      if (cb && typeof cb === 'function') {
        cb();
      }
      dispatch(getReportList(params));
    },
    [reportList, page, limit]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.GET_REPORT_COLUMN_LIST,
      data: reportDefaultColumnList,
    });
    toggleCustomField();
  }, [reportDefaultColumnList, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(reportColumnList, reportDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveReportColumnList({ reportColumnList, reportFor: paramReport }));
        getReportListByFilter();
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
    reportColumnList,
    getReportListByFilter,
    reportDefaultColumnList,
    paramReport,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveReportColumnList({ isReset: true, reportFor: paramReport }));
      dispatch(getReportColumnList(paramReport));
      getReportListByFilter();
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getReportListByFilter]);

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
    ]
  );
  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeReportColumnList(data));
  }, []);

  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getReportListByFilter({ page: 1, limit: newLimit });
    },
    [getReportListByFilter]
  );
  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getReportListByFilter({ page: newPage, limit });
    },
    [getReportListByFilter, limit]
  );

  const onChangeSelectedClient = useCallback(
    selectedClient => {
      const selected = selectedClient
        .map(client => (paramReport === 'claims' ? client.clientId : client._id))
        .join(',');
      const data = {
        page: paramPage ?? page ?? 1,
        limit: paramLimit ?? limit ?? 15,
        clientIds: selected,
      };
      getReportListByFilter(data);
    },
    [getReportListByFilter]
  );

  useEffect(() => {
    const data = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    dispatch(getAllClientList());
    getReportListByFilter(data);
    dispatch(getReportColumnList(paramReport));
    dispatch(getReportsClientDropdownData());
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToReports}>Reports</span>
          <span className="material-icons-round">navigate_next</span>
          <span>{reportName}</span>
        </div>
        <div className="page-header-button-container">
          {customSelectFor.includes(paramReport) && (
            <CustomSelect
              options={clientList ?? []}
              placeholder="Select Client"
              className="mr-10"
              onChangeCustomSelect={_.debounce(onChangeSelectedClient, 1000)}
            />
          )}
          <IconButton
            buttonType="primary"
            title="cloud_download"
            className="mr-10"
            buttonTitle={`Click to download ${reportName}`}
          />
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle={`Click to apply filters on ${reportName}`}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            buttonTitle="Click to select custom fields"
            onClick={toggleCustomField}
          />
        </div>
      </div>
      {!isLoading && docs ? (
        (() =>
          docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
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
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
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

export default ViewReport;

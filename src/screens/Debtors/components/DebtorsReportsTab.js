import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import {
  changeDebtorReportsColumnListStatus,
  fetchSelectedReportsForDebtor,
  getDebtorReportsColumnNameList,
  getDebtorReportsListData,
  getDebtorReportsListForFetch,
  saveDebtorReportsColumnNameList,
} from '../redux/DebtorsAction';
import { errorNotification } from '../../../common/Toast';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import Select from '../../../common/Select/Select';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const DebtorsReportsTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    reportsList,
    reportsListForFetch,
    partners,
    debtorsReportsColumnNameList,
    debtorsReportsDefaultColumnNameList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.reports ?? {});

  const {
    viewDebtorReportsColumnSaveButtonLoaderAction,
    viewDebtorReportsColumnResetButtonLoaderAction,
    viewDebtorFetchReportButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => reportsList ?? {},
    [reportsList]
  );

  const getDebtorReportsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorReportsListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorReportsList({ page: 1, limit: newLimit });
    },
    [getDebtorReportsList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorReportsList({ page: newPage, limit });
    },
    [limit, getDebtorReportsList]
  );

  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeDebtorReportsColumnListStatus(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorReportsColumnNameList({ isReset: true }));
      dispatch(getDebtorReportsColumnNameList());
      getDebtorReportsList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [toggleCustomField, dispatch]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        debtorsReportsColumnNameList,
        debtorsReportsDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveDebtorReportsColumnNameList({ debtorsReportsColumnNameList }));
        getDebtorReportsList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, dispatch, debtorsReportsColumnNameList]);

  const { defaultFields, customFields } = useMemo(
    () => debtorsReportsColumnNameList || { defaultFields: [], customFields: [] },
    [debtorsReportsColumnNameList]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.REPORTS.DEBTOR_REPORTS_COLUMN_LIST_ACTION,
      data: debtorsReportsDefaultColumnNameList,
    });
    toggleCustomField();
  }, [debtorsReportsDefaultColumnNameList, toggleCustomField]);

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewDebtorReportsColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewDebtorReportsColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewDebtorReportsColumnResetButtonLoaderAction,
      viewDebtorReportsColumnSaveButtonLoaderAction,
    ]
  );

  // fetch report

  const [fetchReportsModal, setFetchReportsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedStakeHolder, setSelectedStakeHolder] = useState([]);

  const toggleFetchReportsModal = useCallback(() => {
    setFetchReportsModal(e => !e);
  }, []);

  const partnersWithCompany = useMemo(() => {
    return partners?.filter(partner => partner?.type === 'company') ?? [];
  }, [partners]);

  const OnClickFetchReportButton = useCallback(async () => {
    if (partners?.length > 0 && selectedStakeHolder?.length <= 0) {
      errorNotification('Please select Stake Holder');
    } else if (selectedReports?.length <= 0) {
      errorNotification('Please select reports to fetch');
    } else {
      try {
        const selectedProductCodes =
          selectedReports?.value; /* selectedReports?.map(report => report?.value); */
        const data = {
          debtorId: id,
          productCode: selectedProductCodes,
        };
        if (partners?.length > 0) {
          data.stakeholderId = selectedStakeHolder?.value;
        }
        await dispatch(fetchSelectedReportsForDebtor(data));
        getDebtorReportsList();
        setSelectedReports([]);
        setSelectedStakeHolder([]);
        toggleFetchReportsModal();
      } catch (e) {
        /**/
      }
    }
  }, [
    id,
    selectedReports,
    getDebtorReportsList,
    toggleFetchReportsModal,
    selectedStakeHolder?.value,
    partners?.length,
  ]);

  const fetchReportsButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleFetchReportsModal },
      {
        title: `Fetch`,
        buttonType: 'primary',
        onClick: OnClickFetchReportButton,
        isLoading: viewDebtorFetchReportButtonLoaderAction,
      },
    ],
    [toggleFetchReportsModal, OnClickFetchReportButton, viewDebtorFetchReportButtonLoaderAction]
  );

  const handleOnReportSelect = useCallback(value => {
    setSelectedReports(value);
  }, []);

  const handleOnStakeHolderSelect = useCallback(value => {
    setSelectedStakeHolder(value);
  }, []);

  useEffect(() => {
    getDebtorReportsList(id);
    dispatch(getDebtorReportsColumnNameList());
  }, []);

  useEffect(() => {
    dispatch(getDebtorReportsListForFetch(id));
  }, [id]);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getDebtorReportsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getDebtorReportsList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  return (
    <>
      {fetchReportsModal && (
        <Modal header="Fetch Report" className="fetch-report-modal" buttons={fetchReportsButtons}>
          <div className="fetch-report-popup-container">
            {partners?.length > 0 && (
              <>
                <span>Stake Holder</span>
                <Select
                  name="role"
                  placeholder="Select Stake Holder"
                  dropdownHandle={false}
                  options={partnersWithCompany}
                  value={selectedStakeHolder}
                  onChange={handleOnStakeHolderSelect}
                />
              </>
            )}
            <span>Report</span>
            <Select
              name="role"
              placeholder="Select Reports"
              dropdownHandle={false}
              options={reportsListForFetch}
              value={selectedReports}
              onChange={handleOnReportSelect}
            />
            {partners?.length > 0 && partnersWithCompany?.length <= 0 && (
              <>
                <span />
                <div className="font-danger">
                  All stake holders are individual so reports cannot be fetched.
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
      <div className="tab-content-header-row">
        <div className="tab-content-header">Reports</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.DEBTOR}>
            <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.REPORT}>
              <Button
                buttonType="secondary"
                title="Fetch Report"
                onClick={toggleFetchReportsModal}
              />
            </UserPrivilegeWrapper>
          </UserPrivilegeWrapper>
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
                refreshData={getDebtorReportsList}
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
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={buttons}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default DebtorsReportsTab;

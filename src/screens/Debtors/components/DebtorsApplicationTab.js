import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  changeDebtorApplicationColumnListStatus,
  downloadDebtorTabApplicationCSV,
  getDebtorApplicationColumnNameList,
  getDebtorApplicationListData,
  getDebtorsColumnNameList,
  saveDebtorApplicationColumnNameList,
} from '../redux/DebtorsAction';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import { downloadAll } from '../../../helpers/DownloadHelper';

const DebtorsApplicationTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const history = useHistory();

  const {
    applicationList,
    debtorsApplicationColumnNameList,
    debtorsApplicationDefaultColumnNameList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.application ?? {});

  const {
    viewDebtorApplicationColumnSaveButtonLoaderAction,
    viewDebtorApplicationColumnResetButtonLoaderAction,
    DebtorDownloadApplicationCSVButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => applicationList ?? {},
    [applicationList]
  );

  const getDebtorApplicationList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorApplicationListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorApplicationList({ page: 1, limit: newLimit });
    },
    [getDebtorApplicationList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorApplicationList({ page: newPage, limit });
    },
    [limit, getDebtorApplicationList]
  );

  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeDebtorApplicationColumnListStatus(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorApplicationColumnNameList({ isReset: true }));
      dispatch(getDebtorsColumnNameList());
      getDebtorApplicationList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [toggleCustomField, dispatch]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        debtorsApplicationColumnNameList,
        debtorsApplicationDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveDebtorApplicationColumnNameList({ debtorsApplicationColumnNameList }));
        getDebtorApplicationList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, dispatch, debtorsApplicationColumnNameList]);

  const { defaultFields, customFields } = useMemo(
    () => debtorsApplicationColumnNameList || { defaultFields: [], customFields: [] },
    [debtorsApplicationColumnNameList]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_COLUMN_LIST_ACTION,
      data: debtorsApplicationDefaultColumnNameList,
    });
    toggleCustomField();
  }, [debtorsApplicationDefaultColumnNameList, toggleCustomField]);

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewDebtorApplicationColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewDebtorApplicationColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewDebtorApplicationColumnSaveButtonLoaderAction,
      viewDebtorApplicationColumnResetButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getDebtorApplicationColumnNameList());
  }, []);

  useEffect(() => {
    getDebtorApplicationList();
  }, [id]);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getDebtorApplicationList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getDebtorApplicationList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const handleApplicationRedirectLink = useCallback(row => {
    history.replace(
      row?.status === 'Draft'
        ? `/applications/generate/?applicationId=${row._id}`
        : `/applications/detail/view/${row._id}`
    );
  }, []);

  const onClickDownloadButton = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const res = await dispatch(downloadDebtorTabApplicationCSV(id));
        if (res) downloadAll(res);
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  }, [docs, id]);



  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Application</div>
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
          <IconButton buttonType="primary" title="format_line_spacing" onClick={toggleCustomField} />
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            className="mr-10"
            buttonTitle="Click to download applications"
            onClick={onClickDownloadButton}
            isLoading={DebtorDownloadApplicationCSVButtonLoaderAction}
          />
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
                handleRedirectClick={row => handleApplicationRedirectLink(row)}
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

export default DebtorsApplicationTab;

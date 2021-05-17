import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import {
  changeClientCreditLimitColumnListStatus,
  getClientCreditLimitData,
  getCreditLimitColumnsNameList,
  saveClientCreditLimitColumnNameList,
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';

const ClientCreditLimitTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    creditLimitList,
    clientCreditLimitColumnNameList,
    clientCreditLimitDefaultColumnNameList,
  } = useSelector(({ clientManagement }) => clientManagement?.creditLimit ?? {});

  const {
    viewClientCreditLimitColumnSaveButtonLoaderAction,
    viewClientCreditLimitColumnResetButtonLoaderAction,
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);

  const { total, headers, pages, docs, page, limit } = useMemo(() => creditLimitList ?? {}, [
    creditLimitList,
  ]);

  const getCreditLimitList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getClientCreditLimitData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getCreditLimitList({ page: 1, limit: newLimit });
    },
    [getCreditLimitList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getCreditLimitList({ page: newPage, limit });
    },
    [limit, getCreditLimitList]
  );

  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClientCreditLimitColumnListStatus(data));
  }, []);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientCreditLimitColumnNameList({ isReset: true }));
    dispatch(getCreditLimitColumnsNameList());
    getCreditLimitList();
    toggleCustomField();
  }, [toggleCustomField, getCreditLimitList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        clientCreditLimitColumnNameList,
        clientCreditLimitDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveClientCreditLimitColumnNameList({ clientCreditLimitColumnNameList }));
        getCreditLimitList();
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
    getCreditLimitList,
    clientCreditLimitColumnNameList,
    clientCreditLimitDefaultColumnNameList,
  ]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION,
      data: clientCreditLimitDefaultColumnNameList,
    });
    toggleCustomField();
  }, [clientCreditLimitDefaultColumnNameList, toggleCustomField]);

  const { defaultFields, customFields } = useMemo(
    () => clientCreditLimitColumnNameList ?? { defaultFields: [], customFields: [] },
    [clientCreditLimitColumnNameList]
  );

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewClientCreditLimitColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewClientCreditLimitColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewClientCreditLimitColumnSaveButtonLoaderAction,
      viewClientCreditLimitColumnResetButtonLoaderAction,
    ]
  );

  useEffect(() => {
    getCreditLimitList();
    dispatch(getCreditLimitColumnsNameList());
  }, []);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getCreditLimitList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getCreditLimitList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Credit Limit</div>
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
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
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

export default ClientCreditLimitTab;

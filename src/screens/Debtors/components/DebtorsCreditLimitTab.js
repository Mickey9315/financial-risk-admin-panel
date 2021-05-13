import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  changeDebtorCreditLimitColumnListStatus,
  getCreditLimitColumnsNameList,
  getDebtorCreditLimitData,
  saveDebtorCreditLimitColumnNameList,
} from '../redux/DebtorsAction';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';

const DebtorsCreditLimitTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    creditLimitList,
    debtorsCreditLimitColumnNameList,
    debtorsCreditLimitDefaultColumnNameList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.creditLimit ?? {});
  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => creditLimitList ?? {},
    [creditLimitList]
  );

  const getCreditLimitList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorCreditLimitData(id, data));
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

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeDebtorCreditLimitColumnListStatus(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorCreditLimitColumnNameList({ isReset: true }));
      dispatch(getCreditLimitColumnsNameList());
      getCreditLimitList();
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getCreditLimitList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        debtorsCreditLimitColumnNameList,
        debtorsCreditLimitDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveDebtorCreditLimitColumnNameList({ debtorsCreditLimitColumnNameList }));
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
    debtorsCreditLimitColumnNameList,
    debtorsCreditLimitDefaultColumnNameList,
    getCreditLimitList,
  ]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION,
      data: debtorsCreditLimitDefaultColumnNameList,
    });
    toggleCustomField();
  }, [debtorsCreditLimitDefaultColumnNameList, toggleCustomField]);

  const { defaultFields, customFields } = useMemo(
    () => debtorsCreditLimitColumnNameList || { defaultFields: [], customFields: [] },
    [debtorsCreditLimitColumnNameList]
  );

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, onClickCloseColumnSelection, onClickSaveColumnSelection]
  );

  useEffect(() => {
    getCreditLimitList();
    dispatch(getCreditLimitColumnsNameList());
  }, []);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
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

export default DebtorsCreditLimitTab;

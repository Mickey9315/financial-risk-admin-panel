import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  changeDebtorApplicationColumnListStatus,
  getDebtorApplicationColumnNameList,
  getDebtorApplicationListData,
  saveDebtorApplicationColumnNameList,
} from '../redux/DebtorsAction';

const DebtorsApplicationTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const debtorApplicationListData = useSelector(
    ({ debtorsManagement }) => debtorsManagement.application.applicationList
  );
  const debtorApplicationColumnNameListData = useSelector(
    ({ debtorsManagement }) => debtorsManagement.application.columnList
  );
  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => debtorApplicationListData,
    [debtorApplicationListData]
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
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorApplicationList({ page, limit: newLimit });
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
      getDebtorApplicationList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [toggleCustomField, dispatch]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorApplicationColumnNameList({ debtorApplicationColumnNameListData }));
      getDebtorApplicationList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [toggleCustomField, dispatch, debtorApplicationColumnNameListData]);

  const { defaultFields, customFields } = useMemo(
    () => debtorApplicationColumnNameListData || { defaultFields: [], customFields: [] },
    [debtorApplicationColumnNameListData]
  );

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleCustomField() },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [toggleCustomField, onClickSaveColumnSelection]
  );

  useEffect(() => {
    getDebtorApplicationList();
    dispatch(getDebtorApplicationColumnNameList());
  }, []);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getDebtorApplicationList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getDebtorApplicationList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

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
          <div className="no-data-available">No data available</div>
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

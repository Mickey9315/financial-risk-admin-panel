import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  downloadCreditLimitCSV,
  downloadCreditLimitDecisionLetter,
  getCreditLimitColumnsNameList,
  getDebtorCreditLimitData,
  modifyDebtorCreditLimit,
  saveDebtorCreditLimitColumnNameList,
  surrenderDebtorCreditLimit,
} from '../redux/DebtorsAction';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Button from '../../../common/Button/Button';
import { NUMBER_REGEX } from '../../../constants/RegexConstants';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';

const DebtorsCreditLimitTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    creditLimitList,
    debtorsCreditLimitColumnNameList,
    debtorsCreditLimitDefaultColumnNameList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.creditLimit ?? {});

  const {
    viewDebtorCreditLimitColumnSaveButtonLoaderAction,
    viewDebtorCreditLimitColumnResetButtonLoaderAction,
    ViewDebtorSurrenderCreditLimitButtonLoaderAction,
    ViewDebtorModifyCreditLimitButtonLoaderAction,
    viewDebtorDownloadCreditLimitCSVButtonLoaderAction,
    decisionLetterDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

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
    [page, limit, id]
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
        isLoading: viewDebtorCreditLimitColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewDebtorCreditLimitColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewDebtorCreditLimitColumnSaveButtonLoaderAction,
      viewDebtorCreditLimitColumnResetButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getCreditLimitColumnsNameList());
  }, []);

  useEffect(() => {
    getCreditLimitList();
  }, [id]);

  const onClickDownloadButton = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const res = await dispatch(downloadCreditLimitCSV(id));
        if (res) downloadAll(res);
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  }, [docs, id]);

  const downloadDecisionLetter = useCallback(
    async creditLimitId => {
      if (creditLimitId) {
        try {
          const res = await dispatch(downloadCreditLimitDecisionLetter(creditLimitId));
          if (res) downloadAll(res);
        } catch (e) {
          errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
        }
      } else {
        errorNotification('You have no records to download');
      }
    },
    [id]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getCreditLimitList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getCreditLimitList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  // actions

  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const [surrenderModal, setSurrenderModal] = useState(false);
  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [currentCreditLimitData, setCurrentCreditLimitData] = useState({});

  const toggleModifyLimitModal = useCallback(() => {
    setNewCreditLimit('');
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal, setNewCreditLimit]);

  const toggleSurrenderModal = useCallback(() => {
    setSurrenderModal(!surrenderModal);
  }, [surrenderModal]);

  const creditLimitAction = useMemo(
    () => [
      data => (
        <span className="table-action-buttons">
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            buttonTitle="Click to download decision letter"
            className="download-decision-letter-icon"
            onClick={() => {
              if (!decisionLetterDownloadButtonLoaderAction) downloadDecisionLetter(data?.id);
            }}
          />
          <Button
            buttonType="outlined-primary-small"
            title="Modify"
            onClick={() => {
              setCurrentCreditLimitData(data);
              toggleModifyLimitModal();
            }}
          />
          <Button
            buttonType="outlined-red-small"
            title="Surrender"
            onClick={() => {
              setCurrentCreditLimitData(data);
              toggleSurrenderModal();
            }}
          />
        </span>
      ),
    ],
    [
      toggleModifyLimitModal,
      toggleSurrenderModal,
      setCurrentCreditLimitData,
      decisionLetterDownloadButtonLoaderAction,
    ]
  );

  const modifyLimit = useCallback(async () => {
    try {
      if (newCreditLimit?.toString()?.trim().length <= 0) {
        errorNotification('Please provide new credit limit');
      } else if (newCreditLimit && !newCreditLimit?.toString()?.match(NUMBER_REGEX)) {
        errorNotification('Please provide valid credit limit');
      } else {
        const data = {
          action: 'modify',
          creditLimit: parseInt(newCreditLimit, 10),
        };
        await dispatch(modifyDebtorCreditLimit(currentCreditLimitData?.id, data));
        getCreditLimitList();
        toggleModifyLimitModal();
      }
    } catch (e) {
      /**/
    }
  }, [newCreditLimit, currentCreditLimitData, toggleModifyLimitModal, getCreditLimitList]);

  const surrenderLimit = useCallback(async () => {
    try {
      const data = {
        action: 'surrender',
        creditLimit: currentCreditLimitData?.creditLimit,
      };
      await dispatch(surrenderDebtorCreditLimit(currentCreditLimitData?.id, data));
      toggleSurrenderModal();
      getCreditLimitList();
    } catch (e) {
      /**/
    }
  }, [currentCreditLimitData, toggleSurrenderModal, getCreditLimitList]);

  const modifyLimitButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleModifyLimitModal() },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: modifyLimit,
        isLoading: ViewDebtorModifyCreditLimitButtonLoaderAction,
      },
    ],
    [toggleModifyLimitModal, modifyLimit, ViewDebtorModifyCreditLimitButtonLoaderAction]
  );
  const surrenderLimitButtons = useMemo(
    () => [
      { title: 'No', buttonType: 'primary-1', onClick: () => toggleSurrenderModal() },
      {
        title: 'Yes',
        buttonType: 'danger',
        onClick: surrenderLimit,
        isLoading: ViewDebtorSurrenderCreditLimitButtonLoaderAction,
      },
    ],
    [toggleSurrenderModal, surrenderLimit, ViewDebtorSurrenderCreditLimitButtonLoaderAction]
  );

  console.log(newCreditLimit);

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
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            onClick={onClickDownloadButton}
            isLoading={viewDebtorDownloadCreditLimitCSVButtonLoaderAction}
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
                listFor={{ module: 'debtor' }}
                tableButtonActions={creditLimitAction}
                isEditableDrawer
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
      {modifyLimitModal && (
        <Modal
          header="Modify Credit Limit"
          buttons={modifyLimitButtons}
          hideModal={toggleModifyLimitModal}
        >
          <div className="modify-credit-limit-container align-center">
            <span>Credit Limit</span>
            <Input
              type="text"
              value={
                currentCreditLimitData?.creditLimit
                  ? NumberCommaSeparator(currentCreditLimitData?.creditLimit)
                  : ''
              }
              disabled
              borderClass="disabled-control"
            />
            <span>Change Credit Limit</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="New Credit Limit"
              name="creditLimit"
              type="text"
              value={newCreditLimit ? NumberCommaSeparator(newCreditLimit) : ''}
              onChange={e => setNewCreditLimit(e.target.value.toString().replaceAll(',', ''))}
            />
          </div>
        </Modal>
      )}
      {surrenderModal && (
        <Modal
          header="Modify Credit Limit"
          buttons={surrenderLimitButtons}
          hideModal={toggleSurrenderModal}
        >
          <span className="confirmation-message">
            Are you sure you want to surrender this credit limit?
          </span>
        </Modal>
      )}
    </>
  );
};

export default DebtorsCreditLimitTab;

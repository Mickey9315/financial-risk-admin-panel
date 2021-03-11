import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Table from '../../../common/Table/Table';
import Button from '../../../common/Button/Button';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import {
  changeClientPoliciesColumnListStatus,
  getClientPoliciesColumnNamesList,
  getClientPoliciesListData,
  saveClientPoliciesColumnListName,
  syncClientPolicyListData,
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';

const ClientPoliciesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const [pageLimit, setPageLimit] = useState('');
  const clientPoliciesList = useSelector(
    ({ clientManagement }) => clientManagement.policies.policiesList
  );

  const clientPoliciesColumnList = useSelector(
    ({ clientManagement }) => clientManagement.policies.columnList
  );

  const { defaultFields, customFields } = useMemo(
    () => clientPoliciesColumnList || { defaultFields: [], customFields: [] },
    [clientPoliciesColumnList]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientPoliciesColumnListName({ clientPoliciesColumnList }));
      dispatch(getClientPoliciesListData(id, { limit: pageLimit }));
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [dispatch, toggleCustomField, clientPoliciesColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientPoliciesColumnListName({ isReset: true }));
    dispatch(getClientPoliciesListData(id, { limit: pageLimit }));
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientPoliciesColumnListStatus(data));
    },
    [dispatch]
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
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );

  const { total, pages, page, limit, docs, headers } = useMemo(() => clientPoliciesList, [
    clientPoliciesList,
  ]);

  const getClientPoliciesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientPoliciesListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );
  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getClientPoliciesList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientPoliciesList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const onSelectLimit = useCallback(
    newLimit => {
      setPageLimit(newLimit);
      getClientPoliciesList({ page: 1, limit: newLimit });
    },
    [getClientPoliciesList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientPoliciesList({ page: newPage, limit });
    },
    [limit, getClientPoliciesList]
  );

  const syncClientPoliciesData = useCallback(() => {
    dispatch(syncClientPolicyListData(id));
  }, [id]);

  useEffect(() => {
    getClientPoliciesList();
    dispatch(getClientPoliciesColumnNamesList());
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Policies</div>
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
          <Button buttonType="secondary" title="Sync With CRM" onClick={syncClientPoliciesData} />
        </div>
      </div>
      {docs ? (
        <>
          <div className="tab-table-container">
            <Table
              align="left"
              tableClass="white-header-table"
              valign="center"
              data={docs}
              headers={headers}
              refreshData={getClientPoliciesList}
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

export default ClientPoliciesTab;

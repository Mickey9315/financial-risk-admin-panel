import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
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
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';

const ClientPoliciesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const {
    policiesList,
    clientPoliciesColumnNameList,
    clientPoliciesDefaultColumnNameList,
  } = useSelector(({ clientManagement }) => clientManagement?.policies ?? {});

  const {
    viewClientPoliciesColumnSaveButtonLoaderAction,
    viewClientPoliciesColumnResetButtonLoaderAction,
    viewClientPoliciesSyncWithCRMButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(() => policiesList ?? {}, [
    policiesList,
  ]);

  const getClientPoliciesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getClientPoliciesListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const { defaultFields, customFields } = useMemo(
    () => clientPoliciesColumnNameList ?? { defaultFields: [], customFields: [] },
    [clientPoliciesColumnNameList]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        clientPoliciesColumnNameList,
        clientPoliciesDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveClientPoliciesColumnListName({ clientPoliciesColumnNameList }));
        getClientPoliciesList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    getClientPoliciesList,
    toggleCustomField,
    clientPoliciesColumnNameList,
    clientPoliciesDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientPoliciesColumnListName({ isReset: true }));
    dispatch(getClientPoliciesColumnNamesList());
    getClientPoliciesList();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getClientPoliciesList]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_LIST_USER_ACTION,
      data: clientPoliciesDefaultColumnNameList,
    });
    toggleCustomField();
  }, [clientPoliciesDefaultColumnNameList, toggleCustomField]);

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
        isLoading: viewClientPoliciesColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewClientPoliciesColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewClientPoliciesColumnSaveButtonLoaderAction,
      viewClientPoliciesColumnResetButtonLoaderAction,
    ]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getClientPoliciesList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getClientPoliciesList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const onSelectLimit = useCallback(
    newLimit => {
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
    dispatch(getClientPoliciesColumnNamesList());
  }, []);

  useEffect(() => {
    getClientPoliciesList();
  }, [id]);

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
          <Button
            buttonType="secondary"
            title="Sync With CRM"
            onClick={syncClientPoliciesData}
            isLoading={viewClientPoliciesSyncWithCRMButtonLoaderAction}
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

export default ClientPoliciesTab;

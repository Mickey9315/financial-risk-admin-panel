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
  changeClientContactColumnListStatus,
  getClientContactColumnNamesList,
  getClientContactListData,
  saveClientContactColumnListName,
  syncClientContactListData,
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';

const ClientContactsTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const {
    contactList,
    clientContactColumnNameList,
    clientContactDefaultColumnNameList,
  } = useSelector(({ clientManagement }) => clientManagement?.contact ?? {});

  const {
    viewClientContactColumnSaveButtonLoaderAction,
    viewClientContactColumnResetButtonLoaderAction,
    viewClientContactSyncWithCRMButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(() => contactList ?? {}, [
    contactList,
  ]);

  const getClientContactsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getClientContactListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const { defaultFields, customFields } = useMemo(
    () => clientContactColumnNameList ?? { defaultFields: [], customFields: [] },
    [clientContactColumnNameList]
  );
  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        clientContactColumnNameList,
        clientContactDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveClientContactColumnListName({ clientContactColumnNameList }));
        getClientContactsList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    getClientContactsList,
    toggleCustomField,
    clientContactColumnNameList,
    clientContactDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientContactColumnListName({ isReset: true }));
    dispatch(getClientContactColumnNamesList());
    getClientContactsList();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getClientContactsList]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION,
      data: clientContactDefaultColumnNameList,
    });
    toggleCustomField();
  }, [clientContactDefaultColumnNameList, toggleCustomField]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientContactColumnListStatus(data));
    },
    [dispatch]
  );

  const customFieldModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewClientContactColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewClientContactColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewClientContactColumnResetButtonLoaderAction,
      viewClientContactColumnSaveButtonLoaderAction,
    ]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getClientContactsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientContactsList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const onSelectLimit = useCallback(
    newLimit => {
      getClientContactsList({ page: 1, limit: newLimit });
    },
    [getClientContactsList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientContactsList({ page: newPage, limit });
    },
    [limit, getClientContactsList]
  );

  const syncClientContactData = useCallback(() => {
    dispatch(syncClientContactListData(id));
  }, [id]);

  useEffect(() => {
    getClientContactsList();
  }, [id]);

  useEffect(() => {
    dispatch(getClientContactColumnNamesList());
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Contacts</div>
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
            onClick={syncClientContactData}
            isLoading={viewClientContactSyncWithCRMButtonLoaderAction}
          />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
                refreshData={getClientContactsList}
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
          buttons={customFieldModalButtons}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default ClientContactsTab;

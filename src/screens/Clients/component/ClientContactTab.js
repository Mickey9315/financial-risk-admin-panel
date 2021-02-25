import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';

const ClientContactsTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const clientContactList = useSelector(
    ({ clientManagement }) => clientManagement.contact.contactList
  );

  const clientContactColumnList = useSelector(
    ({ clientManagement }) => clientManagement.contact.columnList
  );

  const { defaultFields, customFields } = useMemo(
    () => clientContactColumnList || { defaultFields: [], customFields: [] },
    [clientContactColumnList]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientContactColumnListName({ clientContactColumnList }));
      dispatch(getClientContactListData(id));
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [dispatch, toggleCustomField, clientContactColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientContactColumnListName({ isReset: true }));
    dispatch(getClientContactListData(id));
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientContactColumnListStatus(data));
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

  const { total, pages, page, limit, docs, headers } = useMemo(() => clientContactList, [
    clientContactList,
  ]);

  const getClientContactsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientContactListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

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

  const onSelectUserRecordActionClick = useCallback(() => {}, []);

  const onSelectUserRecord = useCallback(() => {}, []);

  useEffect(() => {
    getClientContactsList();
    dispatch(getClientContactColumnNamesList());
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Contacts</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <Button buttonType="secondary" title="Sync With CRM" />
        </div>
      </div>
      {docs ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              headers={headers}
              recordSelected={onSelectUserRecord}
              recordActionClick={onSelectUserRecordActionClick}
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
        />
      )}
    </>
  );
};

export default ClientContactsTab;

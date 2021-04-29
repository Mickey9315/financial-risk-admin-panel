import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import {
  changeInsurerContactColumnListStatus,
  getInsurerContactColumnNamesList,
  getInsurerContactListData,
  saveInsurerContactColumnListName,
  syncInsurerContactListData,
} from '../redux/InsurerAction';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';

const InsurerContactTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const insurerContactListData = useSelector(({ insurer }) => insurer?.contact?.contactList ?? {});
  const insurerContactColumnList = useSelector(({ insurer }) => insurer?.contact?.columnList ?? {});
  const { docs, headers, pages, page, total, limit } = useMemo(() => insurerContactListData, [
    insurerContactListData,
  ]);
  const getInsurerContactsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getInsurerContactListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerContactsList({ page, limit: newLimit });
    },
    [getInsurerContactsList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerContactsList({ page: newPage, limit });
    },
    [limit, getInsurerContactsList]
  );

  const { defaultFields, customFields } = useMemo(
    () => insurerContactColumnList || { defaultFields: [], customFields: [] },
    [insurerContactColumnList]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerContactColumnListName({ isReset: true }));
    getInsurerContactsList();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getInsurerContactsList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveInsurerContactColumnListName({ insurerContactColumnList }));
      getInsurerContactsList();
    } catch (e) {
      /***/
    }
    toggleCustomField();
  }, [dispatch, toggleCustomField, insurerContactColumnList, getInsurerContactsList]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeInsurerContactColumnListStatus(data));
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
    [toggleCustomField, onClickResetDefaultColumnSelection, onClickSaveColumnSelection]
  );

  const checkIfEnterKeyPressed = useCallback(
    e => {
      const searchKeyword = searchInputRef?.current?.value;
      if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
        getInsurerContactsList();
      } else if (e.key === 'Enter') {
        if (searchKeyword?.trim()?.toString()?.length !== 0) {
          getInsurerContactsList({ search: searchKeyword?.trim()?.toString() });
        } else {
          errorNotification('Please enter any value than press enter');
        }
      }
    },
    [getInsurerContactsList]
  );

  const syncInsurerContactData = useCallback(() => {
    dispatch(syncInsurerContactListData(id));
  }, [id]);

  useEffect(() => {
    getInsurerContactsList();
    dispatch(getInsurerContactColumnNamesList());
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
          <Button buttonType="secondary" title="Sync With CRM" onClick={syncInsurerContactData} />
        </div>
      </div>
      {docs ? (
        <>
          <div className="tab-table-container">
            <Table
              align="left"
              valign="center"
              tableClass="white-header-table"
              data={docs}
              headers={headers}
              refreshData={getInsurerContactsList}
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
export default InsurerContactTab;

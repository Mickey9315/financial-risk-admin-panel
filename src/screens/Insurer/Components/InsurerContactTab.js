import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import {
  changeInsurerContactColumnListStatus,
  getInsurerContactColumnNameList,
  getInsurerContactListData,
  saveInsurerContactColumnNameList,
  syncInsurerContactListData,
} from '../redux/InsurerAction';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { INSURER_VIEW_REDUX_CONSTANT } from '../redux/InsurerReduxConstants';

const InsurerContactTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const {
    contactList,
    insurerContactColumnNameList,
    insurerContactDefaultColumnNameList,
  } = useSelector(({ insurer }) => insurer?.contact ?? {});

  const {
    viewInsurerContactColumnSaveButtonLoaderAction,
    viewInsurerContactColumnResetButtonLoaderAction,
    viewInsurerSyncInsurerContactButtonLoaderAction,
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);

  const { docs, headers, pages, page, total, limit } = useMemo(() => contactList ?? {}, [
    contactList,
  ]);
  const getInsurerContactsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getInsurerContactListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerContactsList({ page: 1, limit: newLimit });
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
    () => insurerContactColumnNameList ?? { defaultFields: [], customFields: [] },
    [insurerContactColumnNameList]
  );

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeInsurerContactColumnListStatus(data));
    },
    [dispatch]
  );
  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        insurerContactColumnNameList,
        insurerContactDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveInsurerContactColumnNameList({ insurerContactColumnNameList }));
        getInsurerContactsList();
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
    insurerContactColumnNameList,
    getInsurerContactsList,
    insurerContactDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerContactColumnNameList({ isReset: true }));
    dispatch(getInsurerContactColumnNameList());
    getInsurerContactsList();
    toggleCustomField();
  }, [toggleCustomField, getInsurerContactsList]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_COLUMN_LIST_ACTION,
      data: insurerContactDefaultColumnNameList,
    });
    toggleCustomField();
  }, [insurerContactDefaultColumnNameList, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewInsurerContactColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewInsurerContactColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewInsurerContactColumnSaveButtonLoaderAction,
      viewInsurerContactColumnResetButtonLoaderAction,
    ]
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
    dispatch(getInsurerContactColumnNameList());
  }, []);

  useEffect(() => {
    getInsurerContactsList();
  }, [id]);

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
            onClick={syncInsurerContactData}
            isLoading={viewInsurerSyncInsurerContactButtonLoaderAction}
          />
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
          buttons={customFieldsModalButtons}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};
export default InsurerContactTab;

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  changeInsurerPoliciesColumnListStatus,
  getInsurerPoliciesColumnNamesList,
  getInsurerPoliciesListData,
  saveInsurerPoliciesColumnListName,
  syncInsurerPolicyListData,
} from '../redux/InsurerAction';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';

const InsurerPoliciesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const insurerPoliciesList = useSelector(({ insurer }) => insurer.policies.policiesList);
  const { total, pages, page, limit, docs, headers } = useMemo(() => insurerPoliciesList, [
    insurerPoliciesList,
  ]);

  const insurerPoliciesColumnList = useSelector(({ insurer }) => insurer.policies.columnList);

  const getInsurerPoliciesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getInsurerPoliciesListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const { defaultFields, customFields } = useMemo(
    () => insurerPoliciesColumnList || { defaultFields: [], customFields: [] },
    [insurerPoliciesColumnList]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveInsurerPoliciesColumnListName({ insurerPoliciesColumnList }));
      getInsurerPoliciesList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [dispatch, toggleCustomField, insurerPoliciesColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerPoliciesColumnListName({ isReset: true }));
    getInsurerPoliciesList();
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeInsurerPoliciesColumnListStatus(data));
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

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerPoliciesList({ page: 1, limit: newLimit });
    },
    [getInsurerPoliciesList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerPoliciesList({ page: newPage, limit });
    },
    [limit, getInsurerPoliciesList]
  );
  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getInsurerPoliciesList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getInsurerPoliciesList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const syncInsurerPoliciesData = useCallback(() => {
    dispatch(syncInsurerPolicyListData(id));
  }, [id]);

  useEffect(() => {
    getInsurerPoliciesList();
    dispatch(getInsurerPoliciesColumnNamesList());
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
          <Button buttonType="secondary" title="Sync With CRM" onClick={syncInsurerPoliciesData} />
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
              refreshData={getInsurerPoliciesList}
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
export default InsurerPoliciesTab;

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  changeInsurerPoliciesColumnListStatus,
  getInsurerPoliciesColumnNamesList,
  getInsurerPoliciesListData,
  getPolicySyncListForCRM,
  saveInsurerPoliciesColumnListName,
} from '../redux/InsurerAction';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification, successNotification } from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { INSURER_VIEW_REDUX_CONSTANT } from '../redux/InsurerReduxConstants';
import InsurerPoliciesApiServices from '../services/InsurerPoliciesApiServices';

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

  const syncListFromCrm = useSelector(({ insurer }) => insurer.policies.policySyncList);

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
  }, [dispatch, toggleCustomField, insurerPoliciesColumnList, getInsurerPoliciesList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerPoliciesColumnListName({ isReset: true }));
    dispatch(getInsurerPoliciesColumnNamesList());
    getInsurerPoliciesList();
    toggleCustomField();
  }, [dispatch, toggleCustomField, getInsurerPoliciesList]);

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

  const [crmIds, setCrmIds] = useState([]);
  const [syncFromCRM, setSyncFromCRM] = useState(false);
  const [searchPolicies, setSearchPolicies] = useState(false);

  const toggleSyncWithCRM = useCallback(() => {
    setCrmIds([]);
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH,
      data: [],
    });
    setSyncFromCRM(e => !e);
  }, [setSyncFromCRM, setCrmIds]);

  const syncDataFromCRM = useCallback(() => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH,
      data: [],
    });
    const data = {
      clientIds: crmIds,
    };
    if (data.clientIds.length > 0) {
      toggleSyncWithCRM();
      InsurerPoliciesApiServices.syncInsurerPolicyList(id, data)
        .then(res => {
          if (res.data.status === 'SUCCESS') {
            successNotification(res.data.message);
            getInsurerPoliciesList();
          }
        })
        .catch(() => {
          errorNotification('Server error');
        });
    } else {
      errorNotification('Select at least one policy to sync');
    }
  }, [crmIds, getInsurerPoliciesList, setSyncFromCRM]);

  const syncWithCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleSyncWithCRM },
      { title: 'Sync', buttonType: 'primary', onClick: syncDataFromCRM },
    ],
    [toggleSyncWithCRM, syncDataFromCRM]
  );

  const checkIfEnterKeyPressed = useCallback(
    e => {
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
    },
    [getInsurerPoliciesList]
  );

  const checkIfEnterKeyPressedForPolicy = useCallback(
    e => {
      if (e.key === 'Enter') {
        const searchKeyword = searchInputRef.current.value;
        if (searchKeyword.trim().toString().length !== 0) {
          dispatch(getPolicySyncListForCRM(id, searchKeyword.trim().toString()));
          setSearchPolicies(true);
        } else {
          errorNotification('Please enter any value than press enter');
        }
      }
    },
    [setSearchPolicies]
  );

  const selectPolicyFromCRMList = useCallback(
    crmId => {
      let arr = [...crmIds];
      if (arr.includes(crmId)) {
        arr = arr.filter(e => e !== crmId);
      } else if (crmIds.length < 10) {
        arr = [...arr, crmId];
      } else {
        errorNotification('Maximum 10 policies can be synced at a time');
      }
      setCrmIds(arr);
    },
    [crmIds]
  );

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
          <Button buttonType="secondary" title="Sync With CRM" onClick={toggleSyncWithCRM} />
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
      {syncFromCRM && (
        <Modal
          header="Sync With CRM"
          className="add-to-crm-modal"
          buttons={syncWithCRMButtons}
          hideModal={toggleSyncWithCRM}
        >
          <BigInput
            ref={searchInputRef}
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search policy"
            type="text"
            onKeyDown={checkIfEnterKeyPressedForPolicy}
          />
          {searchPolicies && (
            <>
              <div className="crm-checkbox-list-container">
                {syncListFromCrm && syncListFromCrm.length > 0 ? (
                  syncListFromCrm.map(crm => (
                    <Checkbox
                      title={crm.name}
                      className="crm-checkbox-list"
                      checked={crmIds.includes(crm._id.toString())}
                      onChange={() => selectPolicyFromCRMList(crm._id.toString())}
                    />
                  ))
                ) : (
                  <div className="no-data-available">No data available</div>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
};
export default InsurerPoliciesTab;

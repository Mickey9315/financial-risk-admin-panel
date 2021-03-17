import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './InsurerList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import IconButton from '../../../common/IconButton/IconButton';
import Table /* TABLE_ROW_ACTIONS */ from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeInsurerColumnListStatus,
  getInsurerColumnNameList,
  getInsurerListByFilter,
  getListFromCrm,
  saveInsurerColumnListName,
} from '../redux/InsurerAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { errorNotification, successNotification } from '../../../common/Toast';
import { INSURER_CRM_REDUX_CONSTANTS } from '../redux/InsurerReduxConstants';
import InsurerApiService from '../services/InsurerApiService';
// import InsurerApiService from '../services/InsurerApiService';

const InsurerList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const insurerListWithPageData = useSelector(({ insurer }) => insurer.insurerList);
  const insurerColumnList = useSelector(({ insurer }) => insurer.insurerColumnNameList);
  const { total, pages, page, limit, docs, headers } = useMemo(() => insurerListWithPageData, [
    insurerListWithPageData,
  ]);

  const getInsurerList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getInsurerListByFilter(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerList({ page: 1, limit: newLimit });
    },
    [dispatch, getInsurerList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerList({ page: newPage, limit });
    },
    [dispatch, limit, getInsurerList]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerColumnListName({ insurerColumnList }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, insurerColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveInsurerColumnListName({ isReset: true }));
    dispatch(getInsurerColumnNameList());
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
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
  const { defaultFields, customFields } = useMemo(
    () => insurerColumnList || { defaultFields: [], customFields: [] },
    [insurerColumnList]
  );

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeInsurerColumnListStatus(data));
    },
    [dispatch]
  );

  const onSelectInsurerRecord = useCallback(
    id => {
      history.push(`/insurer/view/${id}`);
    },
    [history]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };

    getInsurerList({ ...params });
    dispatch(getInsurerColumnNameList());
  }, []);

  useEffect(() => {
    const params = {
      page: page || 1,
      limit: limit || 15,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history.location.pathname}?${url}`);
  }, [history, total, pages, page, limit]);

  /** *
   * CRM Feature
   * * */

  const syncListFromCrm = useSelector(({ insurer }) => insurer.syncInsurerWithCRM);
  const [addFromCRM, setAddFromCRM] = useState(false);
  const [crmIds, setCrmIds] = useState([]);
  const [searchInsurers, setSearchInsurers] = useState(false);
  const onClickAddFromCRM = useCallback(
    value => setAddFromCRM(value !== undefined ? value : e => !e),
    [addFromCRM]
  );

  const addDataFromCrm = () => {
    dispatch({
      type: INSURER_CRM_REDUX_CONSTANTS.INSURER_GET_LIST_FROM_CRM_ACTION,
      data: [],
    });
    const data = {
      crmIds,
    };
    InsurerApiService.addInsurerListFromCrm(data)
      .then(res => {
        if (res.data.status === 'SUCCESS') {
          successNotification('Insurer data successfully synced');
          setAddFromCRM(e => !e);
          dispatch(getInsurerListByFilter());
        }
      })
      .catch(() => {
        /**/
      });
  };

  const toggleAddFromCRM = useCallback(() => {
    setCrmIds([]);
    dispatch({
      type: INSURER_CRM_REDUX_CONSTANTS.INSURER_GET_LIST_FROM_CRM_ACTION,
      data: [],
    });
    setAddFromCRM(e => !e);
  }, [setAddFromCRM, setCrmIds]);

  const addToCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: toggleAddFromCRM },
      { title: 'Add', buttonType: 'primary', onClick: addDataFromCrm },
    ],
    [toggleAddFromCRM, addDataFromCrm]
  );

  const checkIfEnterKeyPressed = e => {
    if (e.key === 'Enter') {
      const searchKeyword = searchInputRef.current.value;
      if (searchKeyword.trim().toString().length !== 0) {
        dispatch(getListFromCrm(searchKeyword.trim().toString()));
        setSearchInsurers(true);
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const selectInsurerFromCrm = crmId => {
    let arr = [...crmIds];
    if (arr.includes(crmId)) {
      arr = arr.filter(e => e !== crmId);
    } else {
      arr = [...arr, crmId];
    }
    setCrmIds(arr);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Insurer List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Add From CRM" buttonType="success" onClick={onClickAddFromCRM} />
        </div>
      </div>
      {docs ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              tableClass="main-list-table"
              data={docs}
              headers={headers}
              recordSelected={onSelectInsurerRecord}
              recordActionClick={() => {}}
              rowClass="cursor-pointer"
              haveActions
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
        />
      )}
      {addFromCRM && (
        <Modal
          header="Add From CRM"
          className="add-to-crm-modal"
          buttons={addToCRMButtons}
          hideModal={onClickAddFromCRM}
        >
          <BigInput
            ref={searchInputRef}
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search clients"
            type="text"
            onKeyDown={checkIfEnterKeyPressed}
          />
          {searchInsurers && (
            <>
              {/* <Checkbox title="Name" className="check-all-crmList" /> */}
              <div className="crm-checkbox-list-container">
                {syncListFromCrm && syncListFromCrm.length > 0 ? (
                  syncListFromCrm.map(crm => (
                    <Checkbox
                      title={crm.name}
                      className="crm-checkbox-list"
                      checked={crmIds.includes(crm.crmId.toString())}
                      onChange={() => selectInsurerFromCrm(crm.crmId.toString())}
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

export default InsurerList;

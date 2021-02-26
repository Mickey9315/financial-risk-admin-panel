/*
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import './InsurerList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table, { TABLE_ROW_ACTIONS } from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import { getInsurerListByFilter } from '../redux/InsurerAction';
import Modal from '../../../common/Modal/Modal';
import Select from '../../../common/Select/Select';
import { USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { processTableDataByType } from '../../../helpers/TableDataProcessHelper';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const initialFilterState = {
  role: '',
  startDate: null,
  endDate: null,
};

const INSURER_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case INSURER_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case INSURER_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const InsurerList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const insurerListWithPageData = useSelector(({ insurerManagementList }) => insurerManagementList);
  const insurerColumnList = useSelector(
    ({ insurerManagementColumnList }) => insurerManagementColumnList
  );

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  // const [deleteId, setDeleteId] = useState(null);
  const { role, startDate, endDate } = useMemo(() => filter, [filter]);
  const { total, pages, page, limit, docs, headers } = useMemo(() => insurerListWithPageData, [
    insurerListWithPageData,
  ]);

  const getInsurerByFilter = useCallback(
    (params = {}, cb) => {
      if (moment(startDate).isAfter(endDate)) {
        errorNotification('Please enter from date before to date');
      } else if (moment(endDate).isBefore(startDate)) {
        errorNotification('Please enter to date after from date');
      } else {
        const data = {
          page: page || 1,
          limit: limit || 15,
          role: role && role.trim().length > 0 ? role : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          ...params,
        };
        dispatch(getInsurerListByFilter(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [page, limit, role, startDate, endDate, filter]
  );

  const handleFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: INSURER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: event.target.name,
        value: event.target.value,
      });
    },
    [dispatchFilter]
  );

  const tableData = useMemo(() => {
    return docs.map(e => {
      const finalObj = {
        id: e.id,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = processTableDataByType(f.type, e[`${f.name}`]);
      });

      return finalObj;
    });
  }, [docs]);

  const onSelectLimit = useCallback(
    newLimit => {
      getInsurerByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getInsurerByFilter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getInsurerByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getInsurerByFilter]
  );

  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: INSURER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: INSURER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'endDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(() => {
    getInsurerByFilter({ page: 1 }, toggleFilterModal);
  }, [getInsurerByFilter]);

  const filterModalButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    // await dispatch(saveInsurerColumnListName({ insurerColumnList }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, insurerColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    // await dispatch(saveInsurerColumnListName({ isReset: true }));
    // dispatch(getInsurerColumnListName());
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

  const openAddInsurer = useCallback(() => {
    history.push('/insurer/add/new');
  }, [history]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      // const data = { type, name, value };
      // dispatch(changeInsurerColumnListStatus(data));
    },
    [dispatch]
  );

  const onSelectInsurerRecord = useCallback(
    id => {
      history.push(`/insurer/view/${id}`);
    },
    [history]
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setDeleteModal(value !== undefined ? value : e => !e),
    [setDeleteModal]
  );
  const deleteInsurerButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal(false) },
    {
      title: 'Delete',
      buttonType: 'danger',
      onClick: async () => {
        toggleConfirmationModal(false);
        const data = {
          page: page || 1,
          limit: limit || 15,
          role: role && role.trim().length > 0 ? role : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };
        // await dispatch(deleteInsurerDetails(deleteId, data));
        // setDeleteId(null);
      },
    },
  ];
  const onSelectInsurerRecordActionClick = useCallback(
    async (type, id) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        history.push(`/insurer/edit/${id}`);
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        // setDeleteId(id);
        toggleConfirmationModal();
      }
    },
    [history]
  );

  const {
    page: paramPage,
    limit: paramLimit,
    role: paramRole,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };

    const filters = {
      role: paramRole && paramRole.trim().length > 0 ? paramRole : undefined,
      startDate: paramStartDate || undefined,
      endDate: paramEndDate || undefined,
    };

    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: INSURER_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    dispatch(getInsurerListByFilter());
    getInsurerByFilter({ ...params, ...filters });
  }, []);

  useEffect(() => {
    const params = {
      page: page || 1,
      limit: limit || 15,
      role: role && role.trim().length > 0 ? role : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history.location.pathname}?${url}`);
  }, [history, total, pages, page, limit, role, startDate, endDate]);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Insurer List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            onClick={() => toggleFilterModal()}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            onClick={() => toggleCustomField()}
          />
          <Button title="Add Insurer" buttonType="success" onClick={openAddInsurer()} />
        </div>
      </div>
      {tableData ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              data={tableData}
              headers={headers}
              recordSelected={onSelectInsurerRecord}
              recordActionClick={onSelectInsurerRecordActionClick}
              rowClass="cursor-pointer"
              rowTitle="Click to view insurer details"
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

      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Role</div>
            <Select
              className="filter-select"
              placeholder="Select"
              name="role"
              options={USER_ROLES}
              value={role}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
                onChange={handleStartDateChange}
                placeholderText="Select date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
                className="filter-date-picker"
                selected={endDate}
                onChange={handleEndDateChange}
                placeholderText="Select date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
          </div>
        </Modal>
      )}
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldsModalButtons}
        />
      )}
      {deleteModal && (
        <Modal header="Delete Insurer" buttons={deleteInsurerButtons}>
          <span className="confirmation-message">
            Are you sure you want to delete this insurer?
          </span>
        </Modal>
      )}
    </>
  );
};

export default InsurerList;
*/

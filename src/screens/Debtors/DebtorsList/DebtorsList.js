import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeDebtorsColumnListStatus,
  getDebtorDropdownData,
  getDebtorsColumnNameList,
  getDebtorsList,
  resetDebtorListPaginationData,
  saveDebtorsColumnListName,
} from '../redux/DebtorsAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const initialFilterState = {
  entityType: '',
};
const DEBTORS_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case DEBTORS_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case DEBTORS_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const DebtorsList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const debtorListWithPageData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.debtorsList ?? {}
  );
  const debtorsColumnNameListData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.debtorsColumnNameList ?? {}
  );
  const { docs, headers, page, pages, limit, total, isLoading } = useMemo(
    () => debtorListWithPageData,
    [debtorListWithPageData]
  );

  const debtorDropDownData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.dropdownData ?? {}
  );

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { entityType } = useMemo(() => filter, [filter]);

  const handleEntityTypeFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: DEBTORS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'entityType',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );

  const getDebtorsListByFilter = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        entityType: (entityType?.trim()?.length ?? -1) > 0 ? entityType : undefined,
        ...params,
      };
      dispatch(getDebtorsList(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, entityType, filter]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorsListByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getDebtorsListByFilter]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorsListByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getDebtorsListByFilter]
  );

  const { defaultFields, customFields } = useMemo(
    () => debtorsColumnNameListData ?? { defaultFields: [], customFields: [] },
    [debtorsColumnNameListData]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveDebtorsColumnListName({ debtorsColumnNameListData }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, debtorsColumnNameListData]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveDebtorsColumnListName({ isReset: true }));
    dispatch(getDebtorsColumnNameList());
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

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeDebtorsColumnListStatus(data));
    },
    [dispatch]
  );

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const onClickApplyFilter = useCallback(() => {
    getDebtorsListByFilter({}, toggleFilterModal);
  }, [getDebtorsListByFilter]);

  const onClickResetFilter = useCallback(() => {
    dispatchFilter({
      type: DEBTORS_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );
  const entityTypeSelectedValue = useMemo(() => {
    const foundValue = debtorDropDownData?.entityType?.find(e => {
      return e.value === entityType;
    });
    return foundValue ? [foundValue] : [];
  }, [entityType, debtorDropDownData]);

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      entityType: (entityType?.trim()?.length ?? -1) > 0 ? entityType : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit, entityType]);

  const { page: paramPage, limit: paramLimit, entityType: paramEntity } = useQueryParams();
  useEffect(() => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      entityType: (paramEntity?.trim()?.length ?? -1) > 0 ? paramEntity : undefined,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: DEBTORS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getDebtorsListByFilter({ ...params, ...filters });
    dispatch(getDebtorsColumnNameList());
    dispatch(getDebtorDropdownData());
  }, []);

  const onClickViewDebtor = useCallback(id => history.replace(`debtors/debtor/view/${id}`), [
    history,
  ]);

  useEffect(() => {
    return dispatch(resetDebtorListPaginationData(page, pages, total, limit));
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Debtor List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on user list"
            onClick={() => toggleFilterModal()}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs.length > 0 ? (
          <>
            <div className="common-list-container">
              <Table
                align="left"
                valign="center"
                tableClass="main-list-table"
                data={docs}
                headers={headers}
                recordSelected={onClickViewDebtor}
                rowClass="cursor-pointer"
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
          buttons={customFieldsModalButtons}
          toggleCustomField={toggleCustomField}
        />
      )}
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="filter"
          buttons={filterModalButtons}
          className="filter-modal application-filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Entity Type</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={debtorDropDownData?.entityType}
              values={entityTypeSelectedValue}
              onChange={handleEntityTypeFilterChange}
              searchable={false}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default DebtorsList;

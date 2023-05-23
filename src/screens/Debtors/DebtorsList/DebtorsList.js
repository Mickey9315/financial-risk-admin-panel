import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeDebtorsColumnListStatus,
  debtorDownloadAction,
  getDebtorDropdownData,
  getDebtorsColumnNameList,
  getDebtorsList,
  resetDebtorListPaginationData,
  saveDebtorsColumnListName,
  updateEditDebtorField,
} from '../redux/DebtorsAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Modal from '../../../common/Modal/Modal';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import { errorNotification } from '../../../common/Toast';
import { DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const DebtorsList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const debtorListWithPageData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.debtorsList ?? {}
  );
  const { debtorsColumnNameList, debtorsDefaultColumnNameList } = useSelector(
    ({ debtorsManagement }) => debtorsManagement ?? {}
  );
  const { docs, headers, page, pages, limit, total } = useMemo(() => debtorListWithPageData ?? {}, [
    debtorListWithPageData,
  ]);

  const debtorDropDownData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.dropdownData ?? {}
  );

  const { debtorListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const isDebtorUpdatable = useModulePrivileges(SIDEBAR_NAMES.DEBTOR).hasWriteAccess;

  const {
    DebtorListColumnSaveButtonLoaderAction,
    DebtorListColumnResetButtonLoaderAction,
    debtorListLoader,
    debtorDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const appliedFilters = useMemo(() => {
    return {
      entityType:
        (tempFilter?.entityType?.toString()?.trim()?.length ?? -1) > 0
          ? tempFilter?.entityType
          : undefined,
    };
  }, [{ ...tempFilter }]);

  const handleEntityTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'entityType',
      value: event?.value,
    });
  }, []);

  const getDebtorsListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...appliedFilters,
        ...params,
      };
      await dispatch(getDebtorsList(data));
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
      });
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, { ...appliedFilters }]
  );

  const pageActionClick = useCallback(
    async newPage => {
      await getDebtorsListByFilter({ page: newPage, limit });
    },
    [limit, getDebtorsListByFilter]
  );
  const onSelectLimit = useCallback(
    async newLimit => {
      await getDebtorsListByFilter({ page: 1, limit: newLimit });
    },
    [getDebtorsListByFilter]
  );

  const { defaultFields, customFields } = useMemo(
    () => debtorsColumnNameList ?? { defaultFields: [], customFields: [] },
    [debtorsColumnNameList]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION,
      data: debtorsDefaultColumnNameList,
    });
    toggleCustomField();
  }, [debtorsDefaultColumnNameList, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(debtorsColumnNameList, debtorsDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveDebtorsColumnListName({ debtorsColumnNameList }));
        await getDebtorsListByFilter();
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
    debtorsColumnNameList,
    getDebtorsListByFilter,
    debtorsDefaultColumnNameList,
  ]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorsColumnListName({ isReset: true }));
      dispatch(getDebtorsColumnNameList());
      await getDebtorsListByFilter();
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [dispatch, toggleCustomField, getDebtorsListByFilter]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: DebtorListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: DebtorListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      DebtorListColumnSaveButtonLoaderAction,
      DebtorListColumnResetButtonLoaderAction,
    ]
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

  const onClickApplyFilter = useCallback(async () => {
    toggleFilterModal();
    await getDebtorsListByFilter({ page: 1, limit });
  }, [getDebtorsListByFilter, toggleFilterModal]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );
  const entityTypeSelectedValue = useMemo(() => {
    return debtorDropDownData?.entityType?.filter(entity => entity?.value === tempFilter?.entityType);
  }, [tempFilter?.entityType]);
  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      entityType:
        (finalFilter?.entityType?.toString()?.trim()?.length ?? -1) > 0
          ? finalFilter?.entityType
          : undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  const { page: paramPage, limit: paramLimit, entityType: paramEntity } = useQueryParams();
  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      entityType:
        (paramEntity?.trim()?.length ?? -1) > 0
          ? paramEntity
          : debtorListFilters?.entityType,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getDebtorsListByFilter({ ...params, ...filters });
    dispatch(getDebtorsColumnNameList());
    dispatch(getDebtorDropdownData());
  }, []);

  const onClickViewDebtor = useCallback(
    (id, data) => {
      if (data?.status === 'DRAFT') {
        history.replace(`debtors/generate/?debtorId=${id}`);
      } else {
        history.replace(`debtors/debtor/view/${id}`);
      }
    },
    [history],
  );

  const downloadDebtor = useCallback(async () => {
    if (docs?.length > 0) {
      try {
        const response = await debtorDownloadAction(appliedFilters);
        if (response) downloadAll(response);
      } catch (e) {
        /**/
      }
    } else {
      errorNotification('No records to download');
    }
  }, [docs?.length, { ...appliedFilters }]);

  useEffect(() => {
    dispatch(saveAppliedFilters('debtorListFilters', finalFilter));
  }, [finalFilter]);

  useEffect(() => {
    dispatch(resetDebtorListPaginationData(page, pages, total, limit));
  }, []);

  const generateDebtorClick = useCallback(() => {
    dispatch(
      updateEditDebtorField('company', 'country', {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      }),
    );
    history.push(`/debtors/generate/`);
  }, []);

  return (
    <>
      {!debtorListLoader ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Debtor List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                className="mr-10"
                buttonTitle="Click to download Debtor List"
                onClick={downloadDebtor}
                isLoading={debtorDownloadButtonLoaderAction}
              />
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
              {isDebtorUpdatable && <Button title="Add Debtor" buttonType="success" onClick={generateDebtorClick} />}
            </div>
          </div>

          {docs?.length > 0 ? (
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
            <div className="no-record-found">No record found</div>
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
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal application-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Entity Type</div>
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="role"
                  options={debtorDropDownData?.entityType}
                  value={entityTypeSelectedValue}
                  onChange={handleEntityTypeFilterChange}
                  isSearchable
                />
              </div>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DebtorsList;

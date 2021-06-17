import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeClaimsColumnList,
  getClaimsColumnsList,
  getClaimsDefaultColumnsList,
  getClaimsEntityList,
  getClaimsListByFilter,
  saveClaimsColumnsList,
} from '../redux/ClaimsAction';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { CLAIMS_REDUX_CONSTANTS } from '../redux/ClaimsReduxConstants';
import Modal from '../../../common/Modal/Modal';

const initialFilterState = { clientId: '' };

const CLAIMS_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case CLAIMS_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        [`${action.name}`]: action.value,
      };

    case CLAIMS_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return {
        ...initialFilterState,
      };

    default:
      return state;
  }
}

const ClaimsList = () => {
  const dispatch = useDispatch();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { clientId } = useMemo(() => filter, [filter]);
  const handleEntityNameFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: CLAIMS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'clientId',
        value: event.value,
      });
    },
    [dispatchFilter]
  );
  const claimsList = useSelector(({ claims }) => claims?.claimsList ?? {});
  const claimsColumnList = useSelector(({ claims }) => claims?.claimsColumnList ?? {});
  const claimsDefaultColumnList = useSelector(
    ({ claims }) => claims?.claimsDefaultColumnList ?? {}
  );
  const { claimsListColumnSaveButtonLoaderAction, claimsListColumnResetButtonLoaderAction } =
    useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);
  const filterDropdownClient = useSelector(({ claims }) => claims?.claimsEntityList ?? []);
  const { total, pages, page, limit, docs, headers, isLoading } = useMemo(
    () => claimsList,
    [claimsList]
  );

  const { defaultFields, customFields } = useMemo(
    () =>
      claimsColumnList || {
        defaultFields: [],
        customFields: [],
      },
    [claimsColumnList]
  );

  const { page: paramPage, limit: paramLimit, clientId: paramClientId } = useQueryParams();

  const getClaimsByFilter = useCallback(
    (initialParams = { page: 1, limit: 15 }) => {
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        clientId: (clientId?.trim()?.length ?? -1) > 0 ? clientId : undefined,
        ...initialParams,
      };
      dispatch(getClaimsListByFilter(params));
    },
    [page, limit, clientId, filter]
  );

  const onClickApplyFilter = useCallback(() => {
    toggleFilterModal();
    getClaimsByFilter({ page: 1, limit });
  }, [getClaimsByFilter, toggleFilterModal]);

  const onClickResetFilter = useCallback(() => {
    dispatchFilter({
      type: CLAIMS_FILTER_REDUCER_ACTIONS.RESET_STATE,
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

  const entityNameSelectedValue = useMemo(() => {
    const foundValue = filterDropdownClient?.find(e => {
      return e.value === clientId;
    });
    return foundValue || '';
  }, [clientId, filterDropdownClient]);

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClaimsColumnsList({ isReset: true }));
    dispatch(getClaimsColumnsList());
    getClaimsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getClaimsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_COLUMNS_LIST,
      data: claimsDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, claimsDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(claimsColumnList, claimsDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveClaimsColumnsList({ claimsColumnList }));
        getClaimsByFilter();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, claimsDefaultColumnList, getClaimsByFilter, claimsColumnList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: claimsListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: claimsListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      claimsListColumnSaveButtonLoaderAction,
      claimsListColumnResetButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClaimsColumnList(data));
  }, []);

  useEffect(() => {
    const data = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
      clientId: (paramClientId?.trim().length ?? -1) > 0 ? paramClientId : undefined,
    };
    Object.entries(filter).forEach(([name, value]) => {
      dispatchFilter({
        type: CLAIMS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getClaimsByFilter(data);
    dispatch(getClaimsColumnsList());
    dispatch(getClaimsDefaultColumnsList());
    dispatch(getClaimsEntityList());
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Claims List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on claim list"
            onClick={() => toggleFilterModal()}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Add" buttonType="success" />
        </div>
      </div>

      {!isLoading && docs ? (
        (() =>
          docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  data={docs}
                  headers={headers}
                  tableClass="main-list-table"
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination className="common-list-pagination" total={total} pages={pages} />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}

      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          buttons={customFieldsModalButtons}
          onChangeSelectedColumn={onChangeSelectedColumn}
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
            <ReactSelect
              className="filter-select react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              name="role"
              options={filterDropdownClient}
              value={entityNameSelectedValue}
              onChange={handleEntityNameFilterChange}
              isSearchable={false}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ClaimsList;

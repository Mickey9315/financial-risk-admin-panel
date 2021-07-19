import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';
import IconButton from '../../../common/IconButton/IconButton';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Button from '../../../common/Button/Button';
import {
  changeClientClaimsColumnList,
  getClientClaimsColumnsList,
  getClientClaimsListByFilter,
  resetClientClaimListData,
  saveClientClaimsColumnsList,
} from '../redux/ClientAction';
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';

const ClientClaimsTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const searchInputRef = useRef();

  const { claimsList, claimsColumnList, claimsDefaultColumnList } = useSelector(
    ({ clientManagement }) => clientManagement?.claims ?? {}
  );

  const {
    clientClaimsListColumnSaveButtonLoaderAction,
    clientClaimsListColumnResetButtonLoaderAction,
    clientClaimListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, pages, page, limit, docs, headers } = useMemo(() => claimsList ?? {}, [
    claimsList,
  ]);

  const { defaultFields, customFields } = useMemo(
    () =>
      claimsColumnList || {
        defaultFields: [],
        customFields: [],
      },
    [claimsColumnList]
  );

  const getClaimsByFilter = useCallback(
    async (initialParams = { page: 1, limit: 15 }) => {
      const params = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...initialParams,
      };
      await dispatch(getClientClaimsListByFilter(params, id));
    },
    [page, limit, id]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientClaimsColumnsList({ isReset: true }));
    dispatch(getClientClaimsColumnsList());
    await getClaimsByFilter();
    toggleCustomField();
  }, [toggleCustomField, getClaimsByFilter]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CLIENT_CLAIMS.GET_CLIENT_CLAIMS_COLUMNS_LIST,
      data: claimsDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, claimsDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(claimsColumnList, claimsDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveClientClaimsColumnsList({ claimsColumnList }));
        await getClaimsByFilter();
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
        isLoading: clientClaimsListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: clientClaimsListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      clientClaimsListColumnSaveButtonLoaderAction,
      clientClaimsListColumnResetButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClientClaimsColumnList(data));
  }, []);

  const onSelectLimit = useCallback(
    async newLimit => {
      await getClaimsByFilter({ page: 1, limit: newLimit });
    },
    [getClaimsByFilter]
  );

  const pageActionClick = useCallback(
    async newPage => {
      await getClaimsByFilter({ page: newPage, limit });
    },
    [limit, getClaimsByFilter]
  );

  const addClaims = useCallback(() => {
    history.replace('/claims/add', { isRedirected: true, redirectedFrom: 'client', fromId: id });
  }, [history, id]);

  useEffect(async () => {
    await getClaimsByFilter();
    dispatch(getClientClaimsColumnsList());
    return () => {
      dispatch(resetClientClaimListData());
    };
  }, []);

  const checkIfEnterKeyPressed = async e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      await getClaimsByFilter();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        await getClaimsByFilter({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Claims</div>
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
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={toggleCustomField}
          />
          <Button title="Add" buttonType="success" onClick={addClaims} />
        </div>
      </div>
      {!clientClaimListLoader ? (
        (() =>
          docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  data={docs}
                  headers={headers}
                  tableClass="white-header-table"
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                onSelectLimit={onSelectLimit}
                pageActionClick={pageActionClick}
              />

              {customFieldModal && (
                <CustomFieldModal
                  defaultFields={defaultFields}
                  customFields={customFields}
                  buttons={customFieldsModalButtons}
                  onChangeSelectedColumn={onChangeSelectedColumn}
                  toggleCustomField={toggleCustomField}
                />
              )}
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ClientClaimsTab;

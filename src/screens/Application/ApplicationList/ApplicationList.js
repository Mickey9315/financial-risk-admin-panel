import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Loader from '../../../common/Loader/Loader';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeApplicationColumnNameList,
  getApplicationColumnNameList,
  getApplicationsListByFilter,
} from '../redux/ApplicationAction';

import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';

const ApplicationList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const applicationListWithPageData = useSelector(({ application }) => application.applicationList);
  const applicationColumnNameList = useSelector(
    ({ application }) => application.applicationColumnNameList
  );
  const { total, pages, page, limit, docs, headers } = useMemo(() => applicationListWithPageData, [
    applicationListWithPageData,
  ]);

  // for pagination and limit of records
  const getApplicationsByFilter = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 10,
        ...params,
      };
      dispatch(getApplicationsListByFilter(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );
  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getApplicationsByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getApplicationsByFilter]
  );
  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getApplicationsByFilter({ page: newPage, limit });
    },
    [dispatch, getApplicationsByFilter, limit]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );
  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: () => console.log('Reset default clicked'),
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleCustomField() },
      { title: 'Save', buttonType: 'primary', onClick: () => console.log('Save clicked') },
    ],
    [toggleCustomField]
  );

  const { defaultFields, customFields } = useMemo(
    () => applicationColumnNameList || { defaultFields: [], customFields: [] },
    [applicationColumnNameList]
  );
  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };

      dispatch(changeApplicationColumnNameList(data));
    },
    [dispatch]
  );

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    getApplicationsByFilter({ ...params });
    dispatch(getApplicationColumnNameList());
  }, []);

  const generateApplicationClick = useCallback(() => {
    history.push(`/applications/application/generate/`);
  }, []);

  // for params in url
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

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Application List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on application list"
            onClick={() => console.log('Filter Clicked')}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            buttonTitle="Click to select custom fields"
            onClick={() => toggleCustomField()}
          />
          <Button title="Generate" buttonType="success" onClick={generateApplicationClick} />
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
              recordSelected={() => console.log('Record Selected')}
              recordActionClick={() => console.log('Record Action Clicked')}
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
    </>
  );
};

export default ApplicationList;

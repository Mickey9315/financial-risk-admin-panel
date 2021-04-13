import React, { useCallback, useEffect, useMemo } from 'react';
import '../Settings.scss';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../common/IconButton/IconButton';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { getAuditLogsList } from '../redux/SettingAction';

const SettingsAuditLogTab = () => {
  const getAuditLogList = useSelector(({ settingReducer }) => settingReducer.auditLogList);
  const dispatch = useDispatch();
  const { isLoading, total, pages, page, limit, docs, headers } = useMemo(() => getAuditLogList, [
    getAuditLogList,
  ]);
  const getAuditLogListByFilter = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getAuditLogsList(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );
  const { page: paramPage, limit: paramLimit } = useQueryParams();
  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    getAuditLogListByFilter(params);
  }, []);
  return (
    <>
      <div className="settings-title-row">
        <div className="title">Audit Logs List</div>
        <div className="buttons-row">
          <IconButton buttonType="secondary" title="filter_list" />
          <IconButton buttonType="primary" title="format_line_spacing" />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading ? (
        docs && docs.length > 0 ? (
          <>
            <div className="common-list-container settings-audit-log-list-container">
              <Table data={docs} tableClass="main-list-table" headers={headers} />
            </div>
            <Pagination
              className="common-list-pagination"
              total={total}
              pages={pages}
              page={page}
              limit={limit}
            />
          </>
        ) : (
          <div className="no-data-available">No data available</div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SettingsAuditLogTab;

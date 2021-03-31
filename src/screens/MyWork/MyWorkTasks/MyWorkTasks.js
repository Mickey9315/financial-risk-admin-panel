import React, { useCallback, useEffect, useMemo } from 'react';
import './MyWorkTasks.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Table from '../../../common/Table/Table';
import { getTaskListByFilter, resetPageData } from '../redux/MyWorkAction';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const MyWorkTasks = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const taskListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.taskList);
  const { total, pages, page, limit, headers, docs } = useMemo(() => taskListData, [taskListData]);

  const getTaskList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getTaskListByFilter(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const pageActionClick = useCallback(
    newPage => {
      getTaskList({ page: newPage, limit });
    },
    [getTaskList, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getTaskList({ page: 1, limit: newLimit });
    },
    [getTaskList]
  );

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
  }, [total, pages, page, limit]);

  const { page: paramPage, limit: paramLimit } = useQueryParams();

  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    getTaskList({ ...params });
    return () => dispatch(resetPageData());
  }, []);

  const setSelectedCheckBoxData = useCallback(data => {
    console.log(data);
  }, []);

  return (
    <>
      {docs?.length ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              tableClass="main-list-table"
              data={docs}
              headers={headers}
              rowClass="cursor-pointer task-row"
              showCheckbox
              onChangeRowSelection={data => setSelectedCheckBoxData(data)}
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
    </>
  );
};

export default MyWorkTasks;

import React, { useCallback, useEffect } from 'react';
import './MyWorkTasks.scss';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { resetPageData } from '../redux/MyWorkAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const MyWorkTasks = props => {
  const dispatch = useDispatch();
  const {
    total,
    pages,
    page,
    limit,
    headers,
    docs,
    pageActionClick,
    onSelectLimit,
    getTaskList,
    dispatchFilter,
    TASK_FILTER_REDUCER_ACTIONS,
  } = props;
  // const history = useHistory();
  // const dispatch = useDispatch();
  // const taskListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.taskList);
  // const { total, pages, page, limit, headers, docs } = useMemo(() => taskListData, [taskListData]);
  //
  // const getTaskList = useCallback(
  //   (params = {}, cb) => {
  //     const data = {
  //       page: page || 1,
  //       limit: limit || 15,
  //       ...params,
  //     };
  //     dispatch(getTaskListByFilter(data));
  //     if (cb && typeof cb === 'function') {
  //       cb();
  //     }
  //   },
  //   [page, limit]
  // );
  //
  // const pageActionClick = useCallback(
  //   newPage => {
  //     getTaskList({ page: newPage, limit });
  //   },
  //   [getTaskList, limit]
  // );
  //
  // const onSelectLimit = useCallback(
  //   newLimit => {
  //     getTaskList({ page: 1, limit: newLimit });
  //   },
  //   [getTaskList]
  // );
  //
  // useEffect(() => {
  //   const params = {
  //     page: page || 1,
  //     limit: limit || 15,
  //   };
  //   const url = Object.entries(params)
  //     .filter(arr => arr[1] !== undefined)
  //     .map(([k, v]) => `${k}=${v}`)
  //     .join('&');
  //
  //   history.replace(`${history.location.pathname}?${url}`);
  // }, [total, pages, page, limit]);
  //
  // const { page: paramPage, limit: paramLimit } = useQueryParams();
  //
  // useEffect(() => {
  //   const params = {
  //     page: paramPage || 1,
  //     limit: paramLimit || 15,
  //   };
  //   getTaskList({ ...params });
  //   return () => dispatch(resetPageData());
  // }, []);
  //
  // const setSelectedCheckBoxData = useCallback(data => {
  //   console.log(data);
  // }, []);

  const {
    page: paramPage,
    limit: paramLimit,
    priority: paramPriotity,
    isCompleted: paramIsCompleted,
    assigneeId: paramAssigneeId,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();
  useEffect(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    const filters = {
      priority: paramPriotity && paramPriotity.trim().length > 0 ? paramPriotity : undefined,
      isCompleted: paramIsCompleted && paramIsCompleted ? paramIsCompleted : undefined,
      assigneeId:
        paramAssigneeId && paramAssigneeId.trim().length > 0 ? paramAssigneeId : undefined,
      startDate: paramStartDate ? new Date(paramStartDate) : undefined,
      endDate: paramEndDate ? new Date(paramEndDate) : undefined,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getTaskList({ ...params, ...filters });
    return () => dispatch(resetPageData());
  }, []);

  const setSelectedCheckBoxData = useCallback(data => {
    console.log(data);
  }, []);

  return (
    <>
      {docs ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              tableClass="main-list-table"
              data={docs}
              headers={headers}
              rowClass="cursor-pointer task-row"
              refreshData={getTaskList}
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

MyWorkTasks.defaultProps = {
  total: 0,
  pages: 1,
  page: 1,
  limit: 15,
  headers: [],
  pageActionClick: () => {},
  onSelectLimit: () => {},
  getTaskList: () => {},
  docs: [],
  dispatchFilter: () => {},
  TASK_FILTER_REDUCER_ACTIONS: {},
};
MyWorkTasks.propTypes = {
  docs: propTypes.object,
  total: propTypes.number,
  pages: propTypes.number,
  page: propTypes.number,
  limit: propTypes.number,
  headers: propTypes.object,
  pageActionClick: propTypes.func,
  onSelectLimit: propTypes.func,
  getTaskList: propTypes.func,
  dispatchFilter: propTypes.func,
  TASK_FILTER_REDUCER_ACTIONS: propTypes.object,
};
export default MyWorkTasks;

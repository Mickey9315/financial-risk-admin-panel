import React, { useEffect } from 'react';
import './MyWorkTasks.scss';
import { useDispatch } from 'react-redux';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { resetPageData } from '../redux/MyWorkAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

const MyWorkTasks = props => {
  const dispatch = useDispatch();
  const {
    // eslint-disable-next-line react/prop-types
    total,
    // eslint-disable-next-line react/prop-types
    pages,
    // eslint-disable-next-line react/prop-types
    page,
    // eslint-disable-next-line react/prop-types
    limit,
    // eslint-disable-next-line react/prop-types
    headers,
    // eslint-disable-next-line react/prop-types
    docs,
    // eslint-disable-next-line react/prop-types
    pageActionClick,
    // eslint-disable-next-line react/prop-types
    onSelectLimit,
    // eslint-disable-next-line react/prop-types
    getTaskList,
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
      startDate: paramStartDate || undefined,
      endDate: paramEndDate || undefined,
    };
    getTaskList({ ...params, ...filters });
    return () => dispatch(resetPageData());
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
              onRefresh={getTaskList}
              showCheckbox
              // onChangeRowSelection={data => setSelectedCheckBoxData(data)}
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

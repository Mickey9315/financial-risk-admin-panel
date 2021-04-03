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

  const getTaskListOnRefresh = useCallback(() => {
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
  }, []);

  return (
    <>
      {docs.length ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              tableClass="main-list-table"
              data={docs}
              headers={headers}
              rowClass="cursor-pointer task-row"
              refreshData={getTaskListOnRefresh}
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

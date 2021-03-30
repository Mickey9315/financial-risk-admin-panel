import React, { useCallback, useEffect, useMemo } from 'react';
import './MyWorkTasks.scss';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../common/Table/Table';
import { getTaskListByFilter } from '../redux/MyWorkAction';
import Pagination from '../../../common/Pagination/Pagination';

const MyWorkTasks = () => {
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
  useEffect(() => {
    getTaskList();
  }, []);
  return (
    <>
      <div className="common-list-container">
        <Table
          align="left"
          valign="center"
          tableClass="main-list-table"
          data={docs}
          headers={headers}
          recordSelected={() => console.log('Record selected')}
          recordActionClick={() => console.log('Record action clicked')}
          rowClass="cursor-pointer"
        />
      </div>
      <Pagination
        className="common-list-pagination"
        total={total}
        pages={pages}
        page={page}
        limit={limit}
        // pageActionClick={pageActionClick}
        // onSelectLimit={onSelectLimit}
      />
    </>
  );
};

export default MyWorkTasks;

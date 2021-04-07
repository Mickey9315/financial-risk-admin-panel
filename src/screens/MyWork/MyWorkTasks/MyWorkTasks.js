import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './MyWorkTasks.scss';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
// import Loader from '../../../common/Loader/Loader';
import { deleteTaskAction, resetPageData } from '../redux/MyWorkAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Modal from '../../../common/Modal/Modal';

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
    onSelectTaskRecord,
  } = props;

  const {
    page: paramPage,
    limit: paramLimit,
    priority: paramPriority,
    isCompleted: paramIsCompleted,
    assigneeId: paramAssigneeId,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  const getTaskListOnRefresh = useCallback(() => {
    const params = {
      page: paramPage || 1,
      limit: paramLimit || 15,
    };
    const filters = {
      priority: paramPriority && paramPriority.trim().length > 0 ? paramPriority : undefined,
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
  }, [
    dispatchFilter,
    paramLimit,
    paramPage,
    paramEndDate,
    paramStartDate,
    paramAssigneeId,
    paramIsCompleted,
    paramPriority,
    getTaskList,
  ]);

  const [deleteTaskData, setDeleteTaskData] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const deleteTask = useCallback(
    data => {
      setDeleteTaskData(data);
      setShowConfirmModal(true);
    },
    [showConfirmModal, setDeleteTaskData]
  );

  const deleteTaskColumn = useMemo(
    () => [
      data => (
        <span
          className="material-icons-round font-danger"
          onClick={e => {
            e.stopPropagation();
            deleteTask(data);
          }}
        >
          delete_outline
        </span>
      ),
    ],
    [deleteTask]
  );
  const callBack = useCallback(() => {
    toggleConfirmationModal();
    getTaskListOnRefresh();
  }, [toggleConfirmationModal, getTaskListOnRefresh]);

  const deleteTaskButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteTaskAction(deleteTaskData.id, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, deleteTaskData, callBack]
  );

  useEffect(() => {
    getTaskListOnRefresh();
    return () => dispatch(resetPageData());
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
              extraColumns={deleteTaskColumn}
              refreshData={getTaskListOnRefresh}
              recordSelected={onSelectTaskRecord}
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
        <>
          <center>No Record Found</center>
        </>
      )}
      {showConfirmModal && (
        <Modal header="Delete Task" buttons={deleteTaskButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this Task?</span>
        </Modal>
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
  onSelectTaskRecord: () => {},
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
  onSelectTaskRecord: propTypes.func,
};
export default MyWorkTasks;

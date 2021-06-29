import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import moment from 'moment';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeTaskListColumnStatus,
  deleteTaskAction,
  getTaskFilter,
  getTaskListByFilter,
  getTaskListColumnList,
  resetMyWorkPaginationData,
  resetMyWorkTaskData,
  saveTaskListColumnListName,
} from '../redux/MyWorkAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Modal from '../../../common/Modal/Modal';
import Loader from '../../../common/Loader/Loader';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Checkbox from '../../../common/Checkbox/Checkbox';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import { MY_WORK_REDUX_CONSTANTS } from '../redux/MyWorkReduxConstants';
import { errorNotification } from '../../../common/Toast';

const initialFilterState = {
  priority: '',
  isCompleted: null,
  startDate: null,
  endDate: null,
  assigneeId: '',
};

const TASK_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function filterReducer(state, action) {
  switch (action.type) {
    case TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case TASK_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const priorityListData = [
  { value: 'low', label: 'Low', name: 'priority' },
  { value: 'high', label: 'High', name: 'priority' },
  { value: 'urgent', label: 'Urgent', name: 'priority' },
];

const MyWorkTasks = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const taskData = useSelector(({ myWorkReducer }) => myWorkReducer?.task ?? {});
  const taskListData = useMemo(() => taskData?.taskList ?? {}, [taskData]);
  const { total, pages, page, limit, headers, docs } = useMemo(() => taskListData ?? {}, [
    taskListData,
  ]);

  const { taskColumnNameList, taskDefaultColumnNameList } = useMemo(() => taskData ?? {}, [
    taskData,
  ]);
  const { assigneeList } = useMemo(() => taskData?.filterDropDownData ?? [], [taskData]);

  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { priority, isCompleted, startDate, endDate, assigneeId } = useMemo(() => filter ?? {}, [
    filter,
  ]);

  const {
    myWorkTaskColumnsSaveButtonLoaderAction,
    myWorkTaskColumnsResetButtonLoaderAction,
    myWorkTaskDeleteTaskButtonLoaderAction,
    myWorkTasksListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const handlePriorityFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'priority',
        value: event?.value,
      });
    },
    [dispatchFilter]
  );
  const handleAssigneeFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'assigneeId',
        value: event?.value,
      });
    },
    [dispatchFilter]
  );
  const handleIsCompletedFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'isCompleted',
        value: event.target.checked,
      });
    },
    [dispatchFilter, isCompleted]
  );

  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date,
      });
    },
    [dispatchFilter]
  );
  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'endDate',
        value: date,
      });
    },
    [dispatchFilter]
  );

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getTaskList = useCallback(
    async (params = {}, cb) => {
      if (startDate && endDate && moment(endDate).isBefore(startDate)) {
        errorNotification('Please enter a valid date range');
        resetFilterDates();
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          priority: (priority?.length ?? -1) > 0 ? priority : undefined,
          isCompleted: isCompleted || undefined,
          assigneeId: (assigneeId?.length ?? -1) > 0 ? assigneeId : undefined,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          columnFor: 'task',
          ...params,
        };
        try {
          await dispatch(getTaskListByFilter(data));
          if (cb && typeof cb === 'function') {
            cb();
          }
        } catch (e) {
          /**/
        }
      }
    },
    [total, pages, page, limit, priority, isCompleted, assigneeId, startDate, endDate, filter]
  );

  const getSelectedValue = useMemo(() => {
    const selectedPriority = priorityListData?.filter(e => e?.value === priority) ?? {};
    const selectedAssignee = assigneeList?.filter(e => e?.value === assigneeId) ?? {};
    return { selectedPriority, selectedAssignee };
  }, [priorityListData, assigneeList, priority, assigneeId]);

  const onSelectTaskRecord = useCallback(
    id => {
      history.push(`/my-work/edit/${id}`);
    },
    [history]
  );

  const {
    page: paramPage,
    limit: paramLimit,
    priority: paramPriority,
    isCompleted: paramIsCompleted,
    assigneeId: paramAssigneeId,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      priority: priority?.length > 0 ?? -1 ? priority : undefined,
      isCompleted: isCompleted || undefined,
      assigneeId: assigneeId?.length > 0 ?? -1 ? assigneeId : undefined,
      startDate: startDate ? new Date(startDate)?.toUTCString() : undefined,
      endDate: endDate ? new Date(endDate)?.toUTCString() : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.push(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit, priority, isCompleted, assigneeId, startDate, endDate]);

  const getTaskListOnRefresh = useCallback(() => {
    const params = {
      page: page ?? paramPage ?? 1,
      limit: limit ?? paramLimit ?? 15,
    };
    const filters = {
      priority: (paramPriority?.trim()?.length ?? -1) > 0 ? paramPriority : undefined,
      isCompleted: paramIsCompleted || undefined,
      assigneeId: (paramAssigneeId?.trim()?.length ?? -1) > 0 ? paramAssigneeId : undefined,
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
          className="material-icons-round font-danger cursor-pointer"
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
            await dispatch(deleteTaskAction(deleteTaskData?.id, () => callBack()));
          } catch (e) {
            /**/
          }
        },
        isLoading: myWorkTaskDeleteTaskButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, deleteTaskData, callBack, myWorkTaskDeleteTaskButtonLoaderAction]
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

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickCloseColumnSelection = useCallback(async () => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_COLUMN_NAME_LIST_ACTION,
      data: taskDefaultColumnNameList,
    });
    toggleCustomField();
  }, [toggleCustomField, taskDefaultColumnNameList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveTaskListColumnListName({ isReset: true }));
      dispatch(getTaskListColumnList());
      getTaskList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [toggleCustomField, getTaskList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(taskColumnNameList, taskDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveTaskListColumnListName({ taskColumnNameList }));
        getTaskList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, taskColumnNameList, getTaskList, taskDefaultColumnNameList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: myWorkTaskColumnsResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: myWorkTaskColumnsSaveButtonLoaderAction,
      },
    ],
    [
      toggleCustomField,
      onClickSaveColumnSelection,
      onClickResetDefaultColumnSelection,
      myWorkTaskColumnsSaveButtonLoaderAction,
      myWorkTaskColumnsResetButtonLoaderAction,
    ]
  );

  const { defaultFields, customFields } = useMemo(
    () => taskColumnNameList ?? { defaultFields: [], customFields: [] },
    [taskColumnNameList]
  );
  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeTaskListColumnStatus(data));
  }, []);

  // filter
  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );

  const closeFilterOnClick = useCallback(() => {
    toggleFilterModal();
  }, [toggleFilterModal]);

  const applyFilterOnClick = useCallback(() => {
    toggleFilterModal();
    getTaskList({ page: 1, limit });
  }, [getTaskList, limit, toggleFilterModal]);

  const resetFilterOnClick = useCallback(() => {
    dispatchFilter({
      type: TASK_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    applyFilterOnClick();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: resetFilterOnClick,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: closeFilterOnClick },
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: applyFilterOnClick,
      },
    ],
    [resetFilterOnClick, toggleFilterModal, applyFilterOnClick, applyFilterOnClick]
  );

  useEffect(() => {
    dispatch(getTaskListColumnList());
    dispatch(getTaskFilter());
  }, []);

  useEffect(() => {
    getTaskListOnRefresh();
    return () => {
      dispatch(resetMyWorkPaginationData(page, pages, limit, total));
      dispatch(resetMyWorkTaskData());
    };
  }, []);

  const addTask = useCallback(() => {
    history.push('/my-work/add');
  }, [history]);

  return (
    <>
      {!myWorkTasksListLoader ? (
        <>
          <div className="my-work-task-action-row">
            <IconButton
              buttonType="secondary"
              title="filter_list"
              className="mr-10"
              buttonTitle="Click to apply filters on task list"
              onClick={toggleFilterModal}
            />
            <IconButton
              buttonType="primary"
              title="format_line_spacing"
              className="mr-10"
              buttonTitle="Click to select custom fields"
              onClick={toggleCustomField}
            />
            <Button buttonType="success" title="Add" onClick={addTask} />
          </div>
          {docs?.length > 0 ? (
            <>
              <div
                className="common-list-container"
                style={{ maxHeight: 'calc(100vh - 15.75rem)' }}
              >
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
            <div className="no-record-found">No record found</div>
          )}
          {showConfirmModal && (
            <Modal
              header="Delete Task"
              buttons={deleteTaskButtons}
              hideModal={toggleConfirmationModal}
            >
              <span className="confirmation-message">
                Are you sure you want to delete this Task?
              </span>
            </Modal>
          )}
          {customFieldModal && (
            <CustomFieldModal
              defaultFields={defaultFields}
              customFields={customFields}
              onChangeSelectedColumn={onChangeSelectedColumn}
              buttons={customFieldsModalButtons}
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
                <div className="form-title">Priority</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select"
                  name="role"
                  options={priorityListData}
                  value={getSelectedValue?.selectedPriority ?? {}}
                  onChange={handlePriorityFilterChange}
                  isSearchable={false}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Completed Task</div>
                <Checkbox checked={isCompleted} onChange={e => handleIsCompletedFilterChange(e)} />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Due Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    className="filter-date-picker"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    className="filter-date-picker"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
              </div>
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.USER}>
                <div className="filter-modal-row">
                  <div className="form-title">Assignee</div>
                  <ReactSelect
                    className="filter-select react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select"
                    name="role"
                    options={assigneeList}
                    value={getSelectedValue?.selectedAssignee ?? {}}
                    onChange={handleAssigneeFilterChange}
                    isSearchable={false}
                  />
                </div>
              </UserPrivilegeWrapper>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyWorkTasks;

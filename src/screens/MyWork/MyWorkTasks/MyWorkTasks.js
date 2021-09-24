import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';

const priorityListData = [
  { value: 'low', label: 'Low', name: 'priority' },
  { value: 'high', label: 'High', name: 'priority' },
  { value: 'urgent', label: 'Urgent', name: 'priority' },
];

const MyWorkTasks = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const taskData = useSelector(({ myWorkReducer }) => myWorkReducer?.task ?? {});
  const userId = useSelector(({ loggedUserProfile }) => loggedUserProfile?._id ?? '');
  const isTaskUpdatable = useModulePrivileges('task').hasWriteAccess;
  const taskListData = useMemo(() => taskData?.taskList ?? {}, [taskData]);
  const { total, pages, page, limit, headers, docs } = useMemo(
    () => taskListData ?? {},
    [taskListData]
  );

  const { taskColumnNameList, taskDefaultColumnNameList } = useMemo(
    () => taskData ?? {},
    [taskData]
  );
  const { assigneeList } = useMemo(() => taskData?.filterDropDownData ?? [], [taskData]);

  const { taskListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });
  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const {
    myWorkTaskColumnsSaveButtonLoaderAction,
    myWorkTaskColumnsResetButtonLoaderAction,
    myWorkTaskDeleteTaskButtonLoaderAction,
    myWorkTasksListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const handlePriorityFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'priority',
      value: event?.value,
    });
  }, []);
  const handleAssigneeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'assigneeId',
      value: event?.value,
    });
  }, []);
  const handleIsCompletedFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'isCompleted',
        value: event.target.checked,
      });
    },
    [tempFilter?.isCompleted]
  );

  const handleStartDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);
  const handleEndDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const getTaskList = useCallback(
    async (params = {}, cb) => {
      if (
        tempFilter?.startDate &&
        tempFilter?.endDate &&
        moment(tempFilter?.endDate).isBefore(tempFilter?.startDate)
      ) {
        errorNotification('Please enter a valid date range');
        resetFilterDates();
      } else {
        const endDate = tempFilter?.endDate
          ? moment(tempFilter?.endDate)?.set({ hour: 23, minute: 59, second: 59 }).toDate()
          : undefined;

        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          priority: (tempFilter?.priority?.length ?? -1) > 0 ? tempFilter?.priority : undefined,
          isCompleted: tempFilter?.isCompleted || undefined,
          assigneeId: (tempFilter?.assigneeId?.length ?? -1) > 0 ? tempFilter?.assigneeId : userId,
          startDate: tempFilter?.startDate ?? undefined,
          endDate,
          columnFor: 'task',
          ...params,
        };
        try {
          await dispatch(getTaskListByFilter(data));
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
          });
          if (cb && typeof cb === 'function') {
            cb();
          }
        } catch (e) {
          /**/
        }
      }
    },
    [total, pages, page, limit, { ...tempFilter }, userId]
  );

  const getSelectedValue = useMemo(() => {
    const selectedPriority = priorityListData?.filter(e => e?.value === tempFilter?.priority) ?? {};
    const selectedAssignee = assigneeList?.filter(e => e?.value === tempFilter?.assigneeId);
    return { selectedPriority, selectedAssignee };
  }, [priorityListData, assigneeList, tempFilter?.priority, tempFilter?.assigneeId]);

  const onSelectTaskRecord = useCallback(
    id => {
      if (isTaskUpdatable) {
        history.push(`/my-work/edit/${id}`);
      } else {
        history.push(`/my-work/view/${id}`);
      }
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

  const getTaskListOnRefresh = useCallback(() => {
    const params = {
      page: page ?? paramPage ?? 1,
      limit: limit ?? paramLimit ?? 15,
    };
    const filters = {
      priority:
        (paramPriority?.trim()?.length ?? -1) > 0 ? paramPriority : taskListFilters?.priority,
      isCompleted: paramIsCompleted || taskListFilters?.isCompleted || undefined,
      assigneeId:
        (paramAssigneeId?.trim()?.length ?? -1) > 0
          ? paramAssigneeId
          : taskListFilters?.assigneeId || userId,
      startDate: paramStartDate ?? taskListFilters?.start,
      endDate: paramEndDate ?? taskListFilters?.endDate,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getTaskList({ ...params, ...filters });
  }, [
    paramLimit,
    paramPage,
    paramEndDate,
    paramStartDate,
    paramAssigneeId,
    paramIsCompleted,
    paramPriority,
    getTaskList,
    userId,
  ]);

  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      priority: finalFilter?.priority?.length > 0 ?? -1 ? finalFilter?.priority : undefined,
      isCompleted: finalFilter?.isCompleted || undefined,
      assigneeId: finalFilter?.assigneeId?.length > 0 ?? -1 ? finalFilter?.assigneeId : undefined,
      startDate: finalFilter?.startDate ?? undefined,
      endDate: finalFilter?.endDate ?? undefined,
    },
    [{ ...finalFilter }, page, limit]
  );

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
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
    });
    toggleFilterModal();
  }, [toggleFilterModal]);

  const applyFilterOnClick = useCallback(() => {
    toggleFilterModal();
    getTaskList({ page: 1, limit });
  }, [getTaskList, limit, toggleFilterModal]);

  const resetFilterOnClick = useCallback(() => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'assigneeId',
      value: userId,
    });

    applyFilterOnClick();
  }, [userId]);

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
    dispatch(resetMyWorkPaginationData(page, pages, limit, total));
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('taskListFilters', finalFilter));
  }, [finalFilter]);

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
            {isTaskUpdatable && <Button buttonType="success" title="Add" onClick={addTask} />}
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
                  listFor={{ module: 'task' }}
                  extraColumns={deleteTaskColumn}
                  refreshData={getTaskListOnRefresh}
                  recordSelected={onSelectTaskRecord}
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
                <Select
                  className="filter-select"
                  placeholder="Select"
                  name="role"
                  options={priorityListData}
                  value={getSelectedValue?.selectedPriority ?? {}}
                  onChange={handlePriorityFilterChange}
                  isSearchable
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Completed Task</div>
                <Checkbox
                  checked={tempFilter?.isCompleted}
                  onChange={e => handleIsCompletedFilterChange(e)}
                />
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
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                  />
                  <span className="material-icons-round">event</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    className="filter-date-picker"
                    selected={tempFilter?.endDate ? new Date(tempFilter?.endDate) : null}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                  />
                  <span className="material-icons-round">event</span>
                </div>
              </div>
              <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.USER}>
                <div className="filter-modal-row">
                  <div className="form-title">Assignee</div>
                  <Select
                    className="filter-select"
                    placeholder="Select"
                    name="role"
                    options={assigneeList}
                    value={getSelectedValue?.selectedAssignee}
                    onChange={handleAssigneeFilterChange}
                    isSearchable
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

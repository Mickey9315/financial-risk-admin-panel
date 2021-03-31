import React, { useState, useCallback, useMemo, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-dropdown-select';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '../../common/Tab/Tab';
import './MyWork.scss';
import IconButton from '../../common/IconButton/IconButton';
import Button from '../../common/Button/Button';
import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';
import CustomFieldModal from '../../common/Modal/CustomFieldModal/CustomFieldModal';
import {
  changeTaskListColumnStatus,
  getTaskFilter,
  getTaskListByFilter,
  getTaskListColumnList,
  saveTaskListColumnListName,
} from './redux/MyWorkAction';
import Modal from '../../common/Modal/Modal';
import Checkbox from '../../common/Checkbox/Checkbox';
import { errorNotification } from '../../common/Toast';
import { SIDEBAR_NAMES } from '../../constants/SidebarConstants';
import UserPrivilegeWrapper from '../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';

const initialFilterState = {
  priority: '',
  isCompleted: false,
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

const MyWork = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const myWorkTabs = ['Tasks', 'Notifications'];

  const taskListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.taskList);
  const { total, pages, page, limit, headers, docs } = useMemo(() => taskListData, [taskListData]);

  const taskColumnListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.columnList);
  const { assigneeList } = useSelector(
    ({ myWorkReducer }) => myWorkReducer.task.filterDropDownData
  );
  const priorityListData = [
    { value: 'low', label: 'Low', name: 'priority' },
    { value: 'high', label: 'High', name: 'priority' },
    { value: 'urgent', label: 'Urgent', name: 'priority' },
  ];
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { priority, isCompleted, startDate, endDate, assigneeId } = useMemo(() => filter, [filter]);
  console.log(priority, isCompleted, startDate, endDate, assigneeId);

  const handlePriorityFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'priority',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );
  const handleAssigneeFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'assigneeId',
        value: event[0].value,
      });
    },
    [dispatchFilter]
  );
  const handleIsCompletedFilterChange = useCallback(() => {
    dispatchFilter({
      type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'isCompleted',
      value: !isCompleted,
    });
  }, [dispatchFilter, isCompleted]);

  const handleStartDateChange = useCallback(
    date => {
      console.log(date);
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
    (params = {}, cb) => {
      if (moment(startDate).isAfter(endDate)) {
        errorNotification('From date should be greater than to date');
        resetFilterDates();
      } else if (moment(endDate).isBefore(startDate)) {
        errorNotification('To Date should be smaller than from date');
        resetFilterDates();
      } else {
        const data = {
          page: page || 1,
          limit: limit || 15,
          priority: priority && priority.trim().length > 0 ? priority : undefined,
          isCompleted: isCompleted && isCompleted ? isCompleted : undefined,
          assigneeId: assigneeId && assigneeId.trim().length > 0 ? assigneeId : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          ...params,
        };
        console.log(data);
        dispatch(getTaskListByFilter(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      }
    },
    [total, pages, page, limit, priority, isCompleted, assigneeId, startDate, endDate, filter]
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
      priority: priority && priority.trim().length > 0 ? priority : undefined,
      isCompleted: isCompleted && isCompleted ? isCompleted : undefined,
      assigneeId: assigneeId && assigneeId.trim().length > 0 ? assigneeId : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.replace(`${history.location.pathname}?${url}`);
  }, [history, total, pages, page, limit, priority, isCompleted, assigneeId, startDate, endDate]);

  // useEffect(() => {
  //   const params = {
  //     page: paramPage || 1,
  //     limit: paramLimit || 15,
  //   };
  //   getTaskList({ ...params });
  //   return () => dispatch(resetPageData());
  // }, []);

  // const setSelectedCheckBoxData = useCallback(data => {
  //   console.log(data);
  // }, []);

  const myWorkTabContent = [
    <MyWorkTasks
      docs={docs}
      headers={headers}
      page={page}
      pages={pages}
      limit={limit}
      total={total}
      getTaskList={getTaskList}
      pageActionClick={pageActionClick}
      onSelectLimit={onSelectLimit}
      dispatchFilter={dispatchFilter}
      TASK_FILTER_REDUCER_ACTIONS={TASK_FILTER_REDUCER_ACTIONS}
    />,
    <MyWorkNotifications />,
  ];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const addTask = useCallback(() => {
    history.push('/my-work/add');
  }, [history]);

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickCloseColumnSelection = useCallback(async () => {
    await dispatch(getTaskListColumnList());
    toggleCustomField();
  }, [toggleCustomField]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveTaskListColumnListName({ isReset: true }));
    dispatch(getTaskListColumnList());
    toggleCustomField();
  }, [toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveTaskListColumnListName({ taskColumnListData }));
    toggleCustomField();
  }, [toggleCustomField, taskColumnListData]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [toggleCustomField, onClickSaveColumnSelection, onClickResetDefaultColumnSelection]
  );

  const { defaultFields, customFields } = useMemo(
    () => taskColumnListData || { defaultFields: [], customFields: [] },
    [taskColumnListData]
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

  const applyFilterOnClick = useCallback(() => {
    getTaskList({ page: 1 }, toggleFilterModal);
  }, [getTaskList]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: applyFilterOnClick },
    ],
    [toggleFilterModal, applyFilterOnClick]
  );

  useEffect(() => {
    dispatch(getTaskListColumnList());
    dispatch(getTaskFilter());
  }, []);

  return (
    <>
      <div className="my-work-tab-button-row">
        <Tab
          tabs={myWorkTabs}
          tabActive={tabActive}
          activeTabIndex={activeTabIndex}
          className="my-work-tab"
        />
        <div className="d-flex">
          {activeTabIndex === 0 ? (
            <>
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
            </>
          ) : (
            <div className="date-picker-container">
              <DatePicker placeholderText="Select date..." />
              <span className="material-icons-round">event_available</span>
            </div>
          )}
        </div>
      </div>
      <div className="my-work-tab-content-container">{myWorkTabContent[activeTabIndex]}</div>
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
          header="filter"
          buttons={filterModalButtons}
          className="filter-modal application-filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Priority</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              options={priorityListData}
              value={priority}
              onChange={handlePriorityFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Completed Task</div>
            <Checkbox checked={isCompleted} onChange={handleIsCompletedFilterChange} />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Due Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
                onChange={handleStartDateChange}
                placeholderText="From Date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
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
                className="filter-select"
                placeholder="Select"
                name="role"
                options={assigneeList}
                value={assigneeId}
                onChange={handleAssigneeFilterChange}
                searchable={false}
              />
            </div>
          </UserPrivilegeWrapper>
        </Modal>
      )}
    </>
  );
};

export default MyWork;

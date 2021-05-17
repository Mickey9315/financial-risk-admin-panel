import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Tab from '../../common/Tab/Tab';
import IconButton from '../../common/IconButton/IconButton';
import Button from '../../common/Button/Button';
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
import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import { MY_WORK_REDUX_CONSTANTS } from './redux/MyWorkReduxConstants';

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

const MyWork = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const myWorkTabs = ['Tasks', 'Notifications'];

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const taskData = useSelector(({ myWorkReducer }) => myWorkReducer?.task ?? {});
  const taskListData = useMemo(() => taskData?.taskList ?? {}, [taskData]);
  const { total, pages, page, limit, headers, docs, isLoading } = useMemo(
    () => taskListData ?? {},
    [taskListData]
  );

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
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);

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

  const myWorkTabContent = [
    <MyWorkTasks
      docs={docs}
      isLoading={isLoading}
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
      onSelectTaskRecord={onSelectTaskRecord}
    />,
    <MyWorkNotifications />,
  ];

  const tabActive = useCallback(
    index => {
      setActiveTabIndex(index);
    },
    [setActiveTabIndex]
  );

  const addTask = useCallback(() => {
    history.push('/my-work/add');
  }, [history]);

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
          {activeTabIndex === 0 && !isLoading && docs && (
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
          )}
          {activeTabIndex === 1 && (
            <div className="date-picker-container">
              <DatePicker
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                placeholderText="Select date..."
                dateFormat="dd/MM/yyyy"
                popperProps={{ positionFixed: true }}
              />
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
  );
};

export default MyWork;

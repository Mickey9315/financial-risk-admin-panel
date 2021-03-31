import React, { useState, useCallback, useMemo, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-dropdown-select';
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
  getTaskListColumnList,
  saveTaskListColumnListName,
} from './redux/MyWorkAction';
import Modal from '../../common/Modal/Modal';
import Checkbox from '../../common/Checkbox/Checkbox';

const initialFilterState = {
  priority: '',
  completedTask: true,
  dueDate: '',
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

  const taskColumnListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.columnList);
  const { assigneeList } = useSelector(
    ({ myWorkReducer }) => myWorkReducer.task.filterDropDownData
  );
  console.log(assigneeList);
  const priorityListData = [
    { value: 'low', label: 'Low', name: 'priority' },
    { value: 'high', label: 'High', name: 'priority' },
    { value: 'urgent', label: 'Urgent', name: 'priority' },
  ];
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);
  const { priority, completedTask, dueDate, assigneeId } = useMemo(() => filter, [filter]);

  const myWorkTabContent = [<MyWorkTasks />, <MyWorkNotifications />];
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

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: () => {} },
    ],
    [toggleFilterModal]
  );

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
  const handleCompletedTaskFilterChange = useCallback(() => {
    dispatchFilter({
      type: TASK_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'completedTask',
      value: !completedTask,
    });
  }, [dispatchFilter, completedTask]);

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
            <Checkbox checked={completedTask} onChange={handleCompletedTaskFilterChange} />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Due Date</div>
            <ReactSelect
              className="filter-select"
              placeholder="Select"
              name="role"
              // options={dropdownData.debtors}
              value={dueDate}
              // onChange={handleDebtorIdFilterChange}
              searchable={false}
            />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Asssignee</div>
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
        </Modal>
      )}
    </>
  );
};

export default MyWork;

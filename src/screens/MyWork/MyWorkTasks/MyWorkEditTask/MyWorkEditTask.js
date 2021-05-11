import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  editTaskData,
  getAssigneeDropDownData,
  getEntityDropDownData,
  getTaskById,
  removeUpdateTaskEntityId,
  // removeUpdateTaskEntityId,
  updateEditTaskStateFields,
} from '../../redux/MyWorkAction';
import { errorNotification } from '../../../../common/Toast';
import { MY_WORK_REDUX_CONSTANTS } from '../../redux/MyWorkReduxConstants';

const priorityData = [
  { value: 'low', label: 'Low', name: 'priority' },
  { value: 'high', label: 'High', name: 'priority' },
  { value: 'urgent', label: 'Urgent', name: 'priority' },
];

const entityTypeData = [
  { value: 'application', label: 'Application', name: 'entityType' },
  { value: 'client', label: 'Client', name: 'entityType' },
  { value: 'debtor', label: 'Debtor', name: 'entityType' },
  // { value: 'claim', label: 'Claim', name: 'entityType' },
  // { value: 'overdue', label: 'Overdue', name: 'entityType' },
];

const MyWorkAddTask = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const backToTaskList = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
    });
    history.push('/my-work');
  }, []);

  const { entityType, ...taskDetails } = useSelector(
    ({ myWorkReducer }) => myWorkReducer?.task?.taskDetail ?? {}
  );
  const dropDownData = useSelector(
    ({ myWorkReducer }) => myWorkReducer?.task?.myWorkDropDownData ?? {}
  );

  const { assigneeList, entityList } = useMemo(() => dropDownData, [dropDownData]);

  const INPUTS = useMemo(
    () => [
      {
        label: 'Title',
        placeholder: 'Enter title',
        type: 'text',
        name: 'title',
        data: [],
      },
      {
        label: 'Assignee',
        placeholder: 'Select Assignee',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
      },
      {
        label: 'Priority',
        placeholder: 'Select Priority',
        type: 'select',
        name: 'priority',
        data: priorityData,
      },
      {
        label: 'Due Date',
        placeholder: 'Select Date',
        type: 'date',
        name: 'dueDate',
        data: [],
      },
      {
        label: 'Task For',
        placeholder: 'Select Task For',
        type: 'select',
        name: 'entityType',
        data: entityTypeData,
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Select Entity',
        type: 'select',
        name: 'entityId',
        data: entityList,
      },
      {
        type: 'blank',
      },
      {
        label: 'Description',
        placeholder: 'Enter Description',
        type: 'text',
        name: 'description',
      },
    ],
    [assigneeList, entityList, taskDetails, priorityData, entityTypeData]
  );

  const updateEditTaskState = useCallback((name, value) => {
    dispatch(updateEditTaskStateFields(name, value));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateEditTaskState(name, value);
    },
    [updateEditTaskState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      if (data?.name === 'entityType') {
        dispatch(removeUpdateTaskEntityId());
      }
      updateEditTaskState(data?.name, data);
    },
    [updateEditTaskState]
  );

  useEffect(() => {
    if (entityType?.[0]?.value ?? entityType?.value)
      dispatch(getEntityDropDownData({ entityName: entityType?.[0]?.value ?? entityType?.value }));
  }, [entityType]);

  const handleDateChange = useCallback(
    (name, value) => {
      updateEditTaskState(name, value);
    },
    [updateEditTaskState]
  );

  const selectedValuesForDropDown = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'assigneeId': {
          return taskDetails?.assigneeId ?? [];
        }
        case 'priority': {
          return taskDetails?.priority ?? [];
        }
        case 'entityType': {
          return entityType ?? [];
        }
        case 'entityId': {
          return taskDetails?.entityId ?? [];
        }
        default:
          return [];
      }
    },
    [taskDetails, entityType]
  );

  const onCloseEditTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      title: taskDetails?.title?.trim() ?? '',
      dueDate: taskDetails?.dueDate || new Date().toISOString(),
      assigneeId: taskDetails?.assigneeId?.value ?? '',
      taskFrom: 'task',
      priority: taskDetails?.priority?.value ?? undefined,
      entityType: entityType?.value ?? undefined,
      entityId: taskDetails?.entityId?.value ?? undefined,
      description: taskDetails?.description?.trim() ?? undefined,
    };

    if (!data?.title && data?.title?.length === 0) {
      errorNotification('Please add title');
    } else {
      try {
        dispatch(editTaskData(id, data, backToTaskList));
      } catch (e) {
        errorNotification('Failed to add try again');
      }
    }
  }, [taskDetails, id, backToTaskList]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      const selectedValues =
        selectedValuesForDropDown(input?.name)?.label === ''
          ? []
          : selectedValuesForDropDown(input?.name);
      switch (input.type) {
        case 'text':
          component = (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={taskDetails?.[input.name]}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;

        case 'select': {
          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                isSearchale={false}
                value={input.name === 'entityType' ? entityType : selectedValues || []}
                onChange={handleSelectInputChange}
              />
            </>
          );
          break;
        }
        case 'date':
          component = (
            <>
              <span>{input.label}</span>
              <div className="date-picker-container">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  placeholderText={input.placeholder}
                  value={
                    taskDetails?.[input.name]
                      ? new Date(taskDetails?.[input.name]).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }
                  onChange={date => handleDateChange(input.name, new Date(date).toISOString())}
                  minDate={new Date()}
                />
                <span className="material-icons-round">event_available</span>
              </div>
            </>
          );
          break;
        case 'blank': {
          component = (
            <>
              <div />
              <div />
            </>
          );
          break;
        }
        default:
          return null;
      }
      return <>{component}</>;
    },
    [
      INPUTS,
      taskDetails,
      handleTextInputChange,
      entityType,
      handleSelectInputChange,
      handleDateChange,
      selectedValuesForDropDown,
      entityList,
      assigneeList,
    ]
  );
  useEffect(() => {
    dispatch(getAssigneeDropDownData());
    dispatch(getTaskById(id));
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToTaskList}>Task List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Edit Task</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="primary-1" title="Close" onClick={onCloseEditTask} />
          <Button buttonType="primary" title="Save" onClick={onSaveTask} />
        </div>
      </div>
      <div className="common-white-container my-work-add-task-container">
        {INPUTS.map(getComponentFromType)}
      </div>
    </>
  );
};

export default MyWorkAddTask;

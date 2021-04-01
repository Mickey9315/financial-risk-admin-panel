import React, { useCallback, useEffect, useMemo } from 'react';
import './MyWorkAddTask.scss';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  getAssigneeDropDownData,
  getEntityDropDownData,
  saveTaskData,
  updateAddTaskStateFields,
} from '../../redux/MyWorkAction';
import { errorNotification } from '../../../../common/Toast';
import { MY_WORK_REDUX_CONSTANTS } from '../../redux/MyWorkReduxConstants';

const MyWorkAddTask = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const backToTaskList = () => {
    history.replace('/my-work');
  };

  const addTaskState = useSelector(({ myWorkReducer }) => myWorkReducer.task.addTask);
  const { assigneeList, entityList } = useSelector(
    ({ myWorkReducer }) => myWorkReducer.task.dropDownData
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Title',
        placeholder: 'Enter title',
        type: 'text',
        name: 'title',
        value: addTaskState?.title,
      },
      {
        label: 'Assignee',
        placeholder: 'Select',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
        value: addTaskState?.assigneeId,
      },
      {
        label: 'Priority',
        placeholder: 'Select',
        type: 'select',
        name: 'priority',
        data: [
          { value: 'low', label: 'Low', name: 'priority' },
          { value: 'high', label: 'High', name: 'priority' },
          { value: 'urgent', label: 'Urgent', name: 'priority' },
        ],
        value: addTaskState?.priority,
      },
      {
        label: 'Due Date',
        placeholder: 'Select Date',
        type: 'date',
        name: 'dueDate',
        value: addTaskState?.dueDate,
      },
      {
        label: 'Task For',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: [
          { value: 'application', label: 'Application', name: 'entityType' },
          { value: 'client', label: 'Client', name: 'entityType' },
          { value: 'debtor', label: 'Debtor', name: 'entityType' },
          { value: 'claim', label: 'Claim', name: 'entityType' },
          { value: 'overdue', label: 'Overdue', name: 'entityType' },
        ],
        value: addTaskState?.entityType,
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Enter Entity',
        type: 'search',
        name: 'entityId',
        data: entityList || [],
        value: addTaskState?.entityType && addTaskState?.entityId,
      },
      {
        type: 'blank',
      },
      {
        label: 'Description',
        placeholder: 'Enter Description',
        type: 'text',
        name: 'description',
        value: addTaskState?.description,
      },
    ],
    [assigneeList, entityList, addTaskState]
  );

  const updateAddTaskState = useCallback((name, value) => {
    dispatch(updateAddTaskStateFields(name, value));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateAddTaskState(data[0]?.name, data[0]?.value);
    },
    [updateAddTaskState]
  );

  const handleEntityTypeSelectInputChange = useCallback(
    data => {
      try {
        handleSelectInputChange(data);
        const params = { entityName: data[0]?.value };
        dispatch(getEntityDropDownData(params));
      } catch (e) {
        /**/
      }
    },
    [handleSelectInputChange, addTaskState]
  );

  const handleDateChange = useCallback(
    (name, value) => {
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const onCloseAddTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    if (!addTaskState.title && addTaskState?.title.length <= 0) {
      errorNotification('Please add title');
    }
    if (!addTaskState.assigneeId && addTaskState?.assigneeId.length <= 0) {
      errorNotification('Please select assignee');
    }
    if (!addTaskState.priority && addTaskState?.priority.length <= 0) {
      errorNotification('Please select priority');
    }
    if (!addTaskState.dueDate && addTaskState?.dueDate.length <= 0) {
      errorNotification('Please select DueDate');
    }
    if (!addTaskState.entityType && addTaskState?.entityType.length <= 0) {
      errorNotification('Please select task for ');
    }
    if (!addTaskState.entityId && addTaskState?.entityId.length <= 0) {
      errorNotification('Please select entityLabel ');
    }
    if (!addTaskState.description && addTaskState?.description.length <= 0) {
      errorNotification('Please select description');
    } else {
      try {
        const data = addTaskState;
        dispatch(saveTaskData(data, backToTaskList));
      } catch (e) {
        errorNotification('Something went wrong please try again');
      }
    }
  }, [addTaskState]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={input.value}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;
        case 'search':
          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                searchable
                value={input?.value}
                onChange={handleSelectInputChange}
              />
            </>
          );

          break;

        case 'select': {
          let handleOnChange = handleSelectInputChange;
          if (input.name === 'entityType') {
            handleOnChange = handleEntityTypeSelectInputChange;
          }
          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                searchable={false}
                value={input.value}
                onChange={handleOnChange}
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
                  placeholderText={input.placeholder}
                  value={input.value && new Date(input.value).toLocaleDateString()}
                  onChange={date => handleDateChange(input.name, new Date(date).toISOString())}
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
      addTaskState,
      handleTextInputChange,
      handleSelectInputChange,
      handleDateChange,
      handleEntityTypeSelectInputChange,
    ]
  );
  useEffect(() => {
    dispatch(getAssigneeDropDownData());
  }, []);
  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToTaskList}>Task List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Add Task</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="primary-1" title="close" onClick={onCloseAddTask} />
          <Button buttonType="primary" title="save" onClick={onSaveTask} />
        </div>
      </div>
      <div className="common-white-container my-work-add-task-container">
        {INPUTS.map(getComponentFromType)}
      </div>
    </>
  );
};

export default MyWorkAddTask;

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
  const backToTaskList = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    history.replace('/my-work');
  }, []);

  const addTaskState = useSelector(({ myWorkReducer }) => myWorkReducer.task.addTask);
  const { assigneeList, entityList } = useSelector(
    ({ myWorkReducer }) => myWorkReducer.task.dropDownData
  );

  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile);
  const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);
  console.log(_id);

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
        placeholder: 'Select',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
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
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: [
          { value: 'application', label: 'Application', name: 'entityType' },
          { value: 'client', label: 'Client', name: 'entityType' },
          { value: 'debtor', label: 'Debtor', name: 'entityType' },
          // { value: 'claim', label: 'Claim', name: 'entityType' },
          // { value: 'overdue', label: 'Overdue', name: 'entityType' },
        ],
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Select Entity',
        type: 'search',
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
      updateAddTaskState(data[0]?.name, data);
    },
    [updateAddTaskState]
  );

  const handleEntityTypeSelectInputChange = useCallback(
    data => {
      try {
        handleSelectInputChange(data);
        const params = { entityName: data[0]?.value };
        if (data[0]?.value) {
          dispatch(getEntityDropDownData(params));
        }
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

  const getAssigneeSelectedValue = useMemo(() => {
    const assigneeSelected = addTaskState?.assigneeId[0]?.value
      ? assigneeList.find(e => {
          return e.value === addTaskState?.assigneeId[0]?.value;
        })
      : assigneeList.find(e => {
          return e.value === _id;
        });
    return (assigneeSelected && [assigneeSelected]) || [];
  }, [addTaskState, _id, assigneeList]);

  const onCloseAddTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      title: addTaskState?.title?.trim(),
      priority: addTaskState?.priority[0]?.value,
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      taskFrom: 'task',
    };
    if (addTaskState?.entityType[0]?.value) data.entityType = addTaskState?.entityType[0]?.value;
    if (addTaskState?.entityId[0]?.value) data.entityId = addTaskState?.entityId[0]?.value;
    if (addTaskState?.assigneeId[0]?.value) data.assigneeId = addTaskState?.assigneeId[0]?.value;
    if (addTaskState?.description) data.description = addTaskState?.description?.trim();

    if (!data.title && data.title.length === 0) {
      errorNotification('Please add title');
    }
    if (!data.priority || data.priority.length <= 0) {
      errorNotification('Please select priority');
    } else {
      try {
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
                value={addTaskState[input.name]}
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
                // searchable
                // changed from value to values
                values={addTaskState[input.name] || []}
                onChange={handleSelectInputChange}
              />
            </>
          );

          break;

        case 'select': {
          let handleOnChange = handleSelectInputChange;
          let selectedValues = addTaskState[input.name];
          if (input.name === 'entityType') {
            handleOnChange = handleEntityTypeSelectInputChange;
            selectedValues = addTaskState[input.name];
          }
          if (input.name === 'assigneeId') {
            selectedValues = getAssigneeSelectedValue;
          }
          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                searchable={false}
                values={selectedValues}
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
                  value={
                    addTaskState[input.name]
                      ? new Date(addTaskState[input.name]).toLocaleDateString()
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
    [INPUTS, addTaskState, updateAddTaskState, entityList, getAssigneeSelectedValue]
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
          <Button buttonType="primary-1" title="Close" onClick={onCloseAddTask} />
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

import React, { useCallback, useEffect, useMemo } from 'react';
import '../MyWorkAddTask/MyWorkAddTask.scss';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  editTaskData,
  getAssigneeDropDownData,
  getEntityDropDownData,
  getTaskById,
  updateEditTaskStateFields,
} from '../../redux/MyWorkAction';
import { errorNotification } from '../../../../common/Toast';
import { MY_WORK_REDUX_CONSTANTS } from '../../redux/MyWorkReduxConstants';

const priorityData = [
  { value: 'low', label: 'LOW', name: 'priority' },
  { value: 'high', label: 'HIGH', name: 'priority' },
  { value: 'urgent', label: 'URGENT', name: 'priority' },
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

  const taskDetails = useSelector(({ myWorkReducer }) => myWorkReducer.task.taskDetail);
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
      updateEditTaskState(data[0]?.name, data);
    },
    [updateEditTaskState]
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
    [handleSelectInputChange, taskDetails]
  );

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
          return taskDetails.assigneeId || [];
        }
        case 'priority': {
          return taskDetails.priority || [];
        }
        case 'entityType': {
          // if (typeof taskDetails.entityType === 'object') {
          //   return [taskDetails.entityType[0]];
          // }
          //   console.log(taskDetails)
          // const entityType = taskDetails &&
          //   taskDetails.entityType ?
          //   entityTypeData.filter(e => {
          //     return e.value === taskDetails.entityType;
          //   }) : [];
          return [];
        }
        case 'entityId': {
          return taskDetails.entityId || [];
        }
        default:
          return [];
      }
    },
    [taskDetails, assigneeList, priorityData, entityList, entityTypeData]
  );

  const onCloseEditTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      title: taskDetails.title.trim(),
      // priority: taskDetails.priority && taskDetails.priority[0].value,
      dueDate: taskDetails.dueDate || new Date().toISOString(),
      assigneeId: taskDetails.assigneeId[0].value,
      taskFrom: 'task',
    };
    if (taskDetails.priority && taskDetails.priority[0].value)
      data.priority = taskDetails.priority[0].value;
    if (taskDetails.entityType && taskDetails.entityType[0].value)
      data.entityType = taskDetails.entityType[0].value;
    if (taskDetails.entityId && taskDetails.entityId[0].value)
      data.entityId = taskDetails.entityId[0].value;
    if (taskDetails.description && taskDetails.description)
      data.description = taskDetails?.description.trim();

    if (!data.title && data.title.length === 0) {
      errorNotification('Please add title');
    } else {
      try {
        dispatch(editTaskData(id, data, backToTaskList));
      } catch (e) {
        errorNotification('Something went wrong please add again');
      }
    }
  }, [taskDetails]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      const selectedValues = selectedValuesForDropDown(input.name);
      switch (input.type) {
        case 'text':
          component = (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={taskDetails[input.name]}
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
                values={selectedValues}
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
                    taskDetails[input.name]
                      ? new Date(taskDetails[input.name]).toLocaleDateString()
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
      updateEditTaskState,
      entityList,
      selectedValuesForDropDown,
      assigneeList,
      priorityData,
      handleEntityTypeSelectInputChange,
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

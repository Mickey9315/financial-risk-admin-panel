import React, { useCallback, useEffect, useMemo } from 'react';
import './MyWorkAddTask.scss';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  getAssigneeDropDownData,
  getEntityDropDownData,
  removeAddTaskEntityId,
  saveTaskData,
  updateAddTaskStateFields,
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
  const backToTaskList = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    history.push('/my-work');
  }, []);

  const taskData = useSelector(({ myWorkReducer }) => myWorkReducer?.task ?? {});
  const userId = useSelector(({ loggedUserProfile }) => loggedUserProfile?._id ?? '');
  const { entityType, ...addTaskState } = useMemo(() => taskData?.addTask ?? {}, [taskData]);
  const { assigneeList, entityList } = useMemo(() => taskData?.myWorkDropDownData ?? {}, [
    taskData,
  ]);

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
    [assigneeList, entityList, addTaskState, priorityData, entityTypeData]
  );

  const updateAddTaskState = useCallback((name, value) => {
    dispatch(updateAddTaskStateFields(name, value));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e?.target ?? {};
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      const { label, value } = data;
      updateAddTaskState(data?.name ?? '', { label, value });
      if (data?.name === 'entityType') {
        dispatch(removeAddTaskEntityId());
      }
    },
    [updateAddTaskState]
  );

  const handleDateChange = useCallback(
    (name, value) => {
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  useEffect(() => {
    if (entityType?.[0]?.value ?? entityType?.value)
      dispatch(getEntityDropDownData({ entityName: entityType?.[0]?.value ?? entityType?.value }));
  }, [entityType]);

  useEffect(() => {
    dispatch(
      updateAddTaskStateFields(
        'assigneeId',
        assigneeList?.find(e => e?.value === userId)
      )
    );
  }, [assigneeList]);

  const onCloseAddTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      title: addTaskState?.title?.trim(),
      // priority: addTaskState?.priority[0]?.value,
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId?.value,
      taskFrom: 'task',
      priority: addTaskState?.priority?.value ?? undefined,
      entityType: entityType?.value ?? undefined,
      entityId: addTaskState?.entityId?.value ?? undefined,
      description: addTaskState?.description?.trim() ?? undefined,
    };

    if (!data?.title && (data?.title?.length ?? -1) === 0) {
      errorNotification('Please add title');
    } else {
      try {
        dispatch(saveTaskData(data, backToTaskList));
      } catch (e) {
        errorNotification('Something went wrong please add again');
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
                value={addTaskState?.[input.name]}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;

        case 'select': {
          const selectedValues = addTaskState?.[input.name];

          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                searchable={false}
                value={selectedValues}
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
                    addTaskState[input.name]
                      ? new Date(addTaskState?.[input.name]).toLocaleDateString()
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
    [INPUTS, addTaskState, updateAddTaskState, entityList]
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

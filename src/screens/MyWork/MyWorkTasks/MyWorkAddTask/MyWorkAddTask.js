import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  getAssigneeDropDownData,
  getEntityDropDownData,
  getTaskDropDownDataBySearch,
  removeAddTaskEntityId,
  saveTaskData,
  updateAddTaskStateFields,
} from '../../redux/MyWorkAction';
import { errorNotification } from '../../../../common/Toast';
import { MY_WORK_REDUX_CONSTANTS } from '../../redux/MyWorkReduxConstants';
import Select from '../../../../common/Select/Select';

const priorityData = [
  { value: 'low', label: 'Low', name: 'priority' },
  { value: 'high', label: 'High', name: 'priority' },
  { value: 'urgent', label: 'Urgent', name: 'priority' },
];

const entityTypeData = [
  { value: 'application', label: 'Application', name: 'entityType' },
  { value: 'client', label: 'Client', name: 'entityType' },
  { value: 'debtor', label: 'Debtor', name: 'entityType' },
  { value: 'insurer', label: 'Insurer', name: 'entityType' },
  // { value: 'claim', label: 'Claim', name: 'entityType' },
  // { value: 'overdue', label: 'Overdue', name: 'entityType' },
];

const SEARCH_ENTITIES = {
  client: 'clients',
  debtor: 'debtors',
  application: 'applications',
};

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
  const addTaskState = useMemo(() => taskData?.addTask ?? {}, [taskData]);
  const { assigneeList, entityList } = useMemo(() => taskData?.myWorkDropDownData ?? {}, [
    taskData,
  ]);

  const { myWorkSaveNewTaskLoaderButtonAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
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
      updateAddTaskState(data?.name ?? '', data);
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
    if (addTaskState?.entityType?.[0]?.value ?? addTaskState?.entityType?.value)
      dispatch(
        getEntityDropDownData({
          entityName: addTaskState?.entityType?.[0]?.value ?? addTaskState?.entityType?.value,
        })
      );
  }, [addTaskState?.entityType]);

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

  const onSaveTask = useCallback(async () => {
    const data = {
      description: addTaskState?.description?.trim(),
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId?.value,
      assigneeType: addTaskState?.assigneeId?.type,
      taskFrom: 'task',
      priority: addTaskState?.priority?.value ?? undefined,
      entityType: addTaskState?.entityType?.value ?? undefined,
      entityId: addTaskState?.entityId?.value ?? undefined,
      comments: addTaskState?.comments?.trim() ?? undefined,
    };

    if (!data?.description && (data?.description?.length ?? -1) === 0) {
      errorNotification('Please add description');
    } else if (
      addTaskState?.assigneeId?.type === 'client-user' &&
      addTaskState?.entityType?.value === 'insurer'
    ) {
      errorNotification('Cannot assign task on insurer to client');
    } else if (
      addTaskState?.assigneeId?.type === 'client-user' &&
      addTaskState?.assigneeId?.value !== addTaskState?.entityId?.value &&
      addTaskState?.entityType?.value === 'client'
    ) {
      errorNotification("Entity label and Assignee don't relate");
    } else {
      try {
        await dispatch(saveTaskData(data, backToTaskList));
      } catch (e) {
        errorNotification('Something went wrong please add again');
      }
    }
  }, [addTaskState]);

  const handleOnSelectSearchInputChange = useCallback((searchEntity, text) => {
    const options = {
      searchString: text,
      entityType: SEARCH_ENTITIES[searchEntity],
      requestFrom: 'task',
    };
    dispatch(getTaskDropDownDataBySearch(options));
  }, []);

  const INPUTS = useMemo(
    () => [
      {
        label: 'Description',
        placeholder: 'Enter description',
        type: 'text',
        name: 'description',
        data: [],
      },
      {
        label: 'Assignee',
        placeholder: 'Select Assignee',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
        onSelectChange: handleSelectInputChange,
      },
      {
        label: 'Priority',
        placeholder: 'Select Priority',
        type: 'select',
        name: 'priority',
        data: priorityData,
        onSelectChange: handleSelectInputChange,
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
        onSelectChange: handleSelectInputChange,
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
        onSelectChange: handleSelectInputChange,
        onInputChange: text =>
          handleOnSelectSearchInputChange(
            addTaskState?.entityType?.[0]?.value ?? addTaskState?.entityType?.value,
            text
          ),
      },
      {
        type: 'blank',
      },
      {
        label: 'Comments',
        placeholder: 'Enter comments',
        type: 'textarea',
        name: 'comments',
      },
    ],
    [
      assigneeList,
      entityList,
      addTaskState,
      priorityData,
      entityTypeData,
      handleSelectInputChange,
      handleOnSelectSearchInputChange,
      addTaskState?.entityType,
    ]
  );

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
              <Select
                placeholder={input.placeholder}
                name={input.name}
                options={input.data ?? []}
                isSearchable
                value={selectedValues}
                onChange={input?.onSelectChange}
                onInputChange={input?.onInputChange}
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
                  popperProps={{ positionFixed: true }}
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
        case 'textarea': {
          component = (
            <>
              <span>{input.label}</span>
              <textarea
                name={input.name}
                value={addTaskState?.[input.name]}
                rows={4}
                className={input?.class}
                placeholder={input.placeholder}
                onChange={handleTextInputChange}
              />
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
          <Button
            buttonType="primary"
            title="Save"
            onClick={onSaveTask}
            isLoading={myWorkSaveNewTaskLoaderButtonAction}
          />
        </div>
      </div>
      <div className="common-white-container my-work-add-task-container">
        {INPUTS.map(getComponentFromType)}
      </div>
    </>
  );
};

export default MyWorkAddTask;

import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';
import {
  editTaskData,
  getAssigneeDropDownData,
  getEntityDropDownData,
  getTaskById,
  getTaskDropDownDataBySearch,
  removeUpdateTaskEntityId,
  updateEditTaskStateFields,
} from '../../redux/MyWorkAction';
import { errorNotification } from '../../../../common/Toast';
import { MY_WORK_REDUX_CONSTANTS } from '../../redux/MyWorkReduxConstants';
import Loader from '../../../../common/Loader/Loader';
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
  const { id } = useParams();
  const backToTaskList = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
    });
    history.push('/my-work');
  }, []);

  const taskDetails = useSelector(({ myWorkReducer }) => myWorkReducer?.task?.taskDetail ?? {});
  const dropDownData = useSelector(
    ({ myWorkReducer }) => myWorkReducer?.task?.myWorkDropDownData ?? {}
  );

  const { assigneeList, entityList } = useMemo(() => dropDownData, [dropDownData]);

  const { myWorkEditTaskLoaderButtonAction, myWorkViewTaskLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
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
          return taskDetails?.entityType ?? [];
        }
        case 'entityId': {
          return taskDetails?.entityId ?? [];
        }
        default:
          return [];
      }
    },
    [taskDetails, taskDetails?.entityType]
  );

  const onCloseEditTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
    });
    backToTaskList();
  }, [backToTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      description: taskDetails?.description?.trim() ?? '',
      dueDate: taskDetails?.dueDate || new Date().toISOString(),
      assigneeId: taskDetails?.assigneeId?.value ?? '',
      assigneeType: taskDetails?.assigneeId?.type ?? taskDetails?.assigneeType,
      taskFrom: 'task',
      priority: taskDetails?.priority?.value ?? undefined,
      entityType: taskDetails?.entityType?.value ?? undefined,
      entityId: taskDetails?.entityId?.value ?? undefined,
      comments: taskDetails?.comments?.trim() ?? undefined,
    };

    if (!data?.description && data?.description?.length === 0) {
      errorNotification('Please add description');
    } else {
      try {
        dispatch(editTaskData(id, data, backToTaskList));
      } catch (e) {
        errorNotification('Failed to add try again');
      }
    }
  }, [taskDetails, id, backToTaskList]);

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
        placeholder: 'Select assignee',
        type: 'select',
        name: 'assigneeId',
        data: assigneeList,
        onSelectChange: handleSelectInputChange,
      },
      {
        label: 'Priority',
        placeholder: 'Select priority',
        type: 'select',
        name: 'priority',
        data: priorityData,
        onSelectChange: handleSelectInputChange,
      },
      {
        label: 'Due Date',
        placeholder: 'Select date',
        type: 'date',
        name: 'dueDate',
        data: [],
      },
      {
        label: 'Task For',
        placeholder: 'Select task for',
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
        placeholder: 'Select entity',
        type: 'select',
        name: 'entityId',
        data: entityList,
        onSelectChange: handleSelectInputChange,
        onInputChange: text =>
          handleOnSelectSearchInputChange(
            taskDetails?.entityType?.[0]?.value ?? taskDetails?.entityType?.value,
            text
          ),
      },
      {
        type: 'blank',
      },
      {
        label: 'Comments',
        placeholder: 'Enter comment',
        type: 'textarea',
        name: 'comments',
      },
    ],
    [
      assigneeList,
      entityList,
      taskDetails,
      priorityData,
      entityTypeData,
      handleSelectInputChange,
      handleOnSelectSearchInputChange,
    ]
  );

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
                    taskDetails?.[input.name]
                      ? new Date(taskDetails?.[input.name]).toLocaleDateString()
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
                value={taskDetails?.[input.name]}
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
    [
      INPUTS,
      taskDetails,
      handleTextInputChange,
      taskDetails?.entityType,
      handleSelectInputChange,
      handleDateChange,
      selectedValuesForDropDown,
      entityList,
      assigneeList,
    ]
  );

  useEffect(() => {
    if (taskDetails?.entityType?.[0]?.value ?? taskDetails?.entityType?.value)
      dispatch(
        getEntityDropDownData({
          entityName: taskDetails?.entityType?.[0]?.value ?? taskDetails?.entityType?.value,
        })
      );
  }, [taskDetails?.entityType]);

  useEffect(() => {
    dispatch(getAssigneeDropDownData());
    dispatch(getTaskById(id));
  }, []);

  return (
    <>
      {!myWorkViewTaskLoaderAction ? (
        (() =>
          !_.isEmpty(taskDetails) ? (
            <>
              <div className="breadcrumb-button-row">
                <div className="breadcrumb">
                  <span onClick={backToTaskList}>Task List</span>
                  <span className="material-icons-round">navigate_next</span>
                  <span>Edit Task</span>
                </div>
                <div className="buttons-row">
                  <Button buttonType="primary-1" title="Close" onClick={onCloseEditTask} />
                  <Button
                    buttonType="primary"
                    title="Save"
                    onClick={onSaveTask}
                    isLoading={myWorkEditTaskLoaderButtonAction}
                  />
                </div>
              </div>
              <div className="common-white-container my-work-add-task-container">
                {INPUTS.map(getComponentFromType)}
              </div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyWorkAddTask;

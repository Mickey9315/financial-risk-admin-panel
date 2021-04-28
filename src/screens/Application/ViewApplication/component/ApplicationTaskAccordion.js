import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import Checkbox from '../../../../common/Checkbox/Checkbox';
import {
  deleteApplicationTaskAction,
  getApplicationTaskDefaultEntityDropDownData,
  getApplicationTaskDetail,
  getApplicationTaskEntityDropDownData,
  getApplicationTaskList,
  getAssigneeDropDownData,
  saveApplicationTaskData,
  updateApplicationTaskData,
  updateApplicationTaskStateFields,
} from '../../redux/ApplicationAction';
import TableApiService from '../../../../common/Table/TableApiService';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import { errorNotification } from '../../../../common/Toast';
import { APPLICATION_REDUX_CONSTANTS } from '../../redux/ApplicationReduxConstants';
import DropdownMenu from '../../../../common/DropdownMenu/DropdownMenu';

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

const ApplicationTaskAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId, index } = props;

  const applicationTaskList = useSelector(
    ({ application }) => application?.viewApplication?.task?.taskList || []
  );

  const getTaskList = useCallback(() => {
    dispatch(getApplicationTaskList(applicationId));
  }, [applicationId]);

  const handleTaskCheckbox = useCallback(
    async (taskId, value) => {
      try {
        await TableApiService.tableActions({
          url: 'task',
          method: 'put',
          id: taskId,
          data: {
            isCompleted: value,
          },
        });
        getTaskList();
      } catch (e) {
        /**/
      }
    },
    [getTaskList]
  );

  // edit task
  const [isEdit, setIsEdit] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState('');

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const onClickActionToggleButton = useCallback(
    (e, taskId) => {
      e.persist();
      e.stopPropagation();
      const menuTop = e.clientY + 10;
      const menuLeft = e.clientX - 90;
      setShowActionMenu(prev => !prev);
      setMenuPosition({ top: menuTop, left: menuLeft });
      setCurrentTaskId(taskId);
      //    const remainingBottomDistance = window.outerHeight - e.screenY;
      //    const remainingRightDistance = window.outerWidth - e.screenX;
    },
    [setShowActionMenu, setMenuPosition]
  );

  const [editTaskModal, setEditTaskModal] = useState(false);

  const toggleEditTaskModal = useCallback(
    value => setEditTaskModal(value !== undefined ? value : e => !e),
    [setEditTaskModal]
  );

  // Add New Task
  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile || []);
  const addTaskState = useSelector(
    ({ application }) => application?.viewApplication?.task?.addTask || []
  );
  const taskDropDownData = useSelector(
    ({ application }) => application?.viewApplication?.dropDownData || []
  );

  const { assigneeList, entityList, defaultEntityList } = useMemo(() => taskDropDownData, [
    taskDropDownData,
  ]);
  const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);

  const [addTaskModal, setAddTaskModal] = useState(false);

  const toggleAddTaskModal = useCallback(
    value => setAddTaskModal(value !== undefined ? value : e => !e),
    [setAddTaskModal]
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const backToTaskList = useCallback(() => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK.RESET_ADD_TASK_STATE_ACTION,
    });
    if (addTaskModal) toggleAddTaskModal();
    if (editTaskModal) toggleEditTaskModal();
    if (showConfirmModal) toggleConfirmationModal();
    getTaskList();
  }, [
    toggleAddTaskModal,
    toggleEditTaskModal,
    addTaskModal,
    editTaskModal,
    showConfirmModal,
    toggleConfirmationModal,
    getTaskList,
  ]);

  const onCloseAddTaskClick = useCallback(() => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK.RESET_ADD_TASK_STATE_ACTION,
    });
    toggleAddTaskModal();
  }, [toggleAddTaskModal]);

  const onCloseEditTaskClick = useCallback(() => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK.RESET_ADD_TASK_STATE_ACTION,
    });
    toggleEditTaskModal();
  }, [toggleEditTaskModal]);

  const onAddTaskClick = useCallback(() => {
    dispatch(
      updateApplicationTaskStateFields(
        'assigneeId',
        assigneeList && assigneeList.filter(e => e.value === _id)
      )
    );
    dispatch(
      updateApplicationTaskStateFields(
        'entityId',
        defaultEntityList && defaultEntityList.filter(e => e.value === applicationId)
      )
    );
    dispatch(
      updateApplicationTaskStateFields(
        'entityType',
        entityTypeData && entityTypeData.filter(e => e.value === 'application')
      )
    );
    toggleAddTaskModal();
  }, [assigneeList, _id, defaultEntityList, applicationId, toggleAddTaskModal]);

  const onEditTaskClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    dispatch(getApplicationTaskDetail(currentTaskId));
    setIsEdit(true);
    toggleEditTaskModal();
  }, [toggleEditTaskModal, setShowActionMenu, showActionMenu, currentTaskId, setIsEdit]);

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
    [assigneeList, entityList, priorityData, entityTypeData, addTaskState]
  );

  const updateAddTaskState = useCallback((name, value) => {
    dispatch(updateApplicationTaskStateFields(name, value));
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
        if (data[0].value && !isEdit) {
          dispatch(getApplicationTaskEntityDropDownData(params));
          updateAddTaskState('entityId', []);
        }
        setIsEdit(false);
      } catch (e) {
        /**/
      }
    },
    [handleSelectInputChange, updateAddTaskState, isEdit, setIsEdit]
  );

  const handleDateChange = useCallback(
    (name, value) => {
      updateAddTaskState(name, value);
    },
    [updateAddTaskState]
  );

  const getSelectedValues = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'title': {
          return addTaskState?.title || '';
        }
        case 'assigneeId': {
          return addTaskState?.assigneeId || [];
        }
        case 'priority': {
          return addTaskState?.priority || [];
        }
        case 'entityType': {
          return addTaskState?.entityType || [];
        }
        case 'entityId': {
          return addTaskState?.entityId || [];
        }
        case 'description': {
          return addTaskState?.description || '';
        }
        default:
          return [];
      }
    },
    [addTaskState, assigneeList, priorityData, entityList, entityTypeData]
  );

  const onSaveTaskClick = useCallback(() => {
    const data = {
      title: addTaskState?.title?.trim() || '',
      // priority: addTaskState?.priority[0]?.value,
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId[0]?.value,
      taskFrom: 'application',
    };
    if (addTaskState?.priority?.[0]?.value) data.priority = addTaskState.priority[0].value;
    if (addTaskState?.entityType?.[0]?.value) data.entityType = addTaskState.entityType[0].value;
    if (addTaskState?.entityId?.[0]?.value) data.entityId = addTaskState.entityId[0].value;
    if (addTaskState?.description) data.description = addTaskState.description.trim();

    if (!data.title && data.title.length === 0) {
      errorNotification('Please add title');
    } else {
      try {
        if (editTaskModal) {
          dispatch(updateApplicationTaskData(currentTaskId, data, backToTaskList));
        } else {
          dispatch(saveApplicationTaskData(data, backToTaskList));
        }
      } catch (e) {
        errorNotification('Something went wrong please add again');
      }
    }
  }, [addTaskState]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      const selectedValues = getSelectedValues(input.name);
      switch (input.type) {
        case 'text':
          component = (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={selectedValues}
                onChange={handleTextInputChange}
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
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
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
    [INPUTS, addTaskState, entityList]
  );

  const addTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseAddTaskClick },
      { title: 'Add', buttonType: 'primary', onClick: onSaveTaskClick },
    ],
    [onSaveTaskClick, onCloseAddTaskClick]
  );

  const editTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseEditTaskClick },
      { title: 'Save', buttonType: 'primary', onClick: onSaveTaskClick },
    ],
    [onSaveTaskClick, onCloseEditTaskClick]
  );

  const onDeleteTaskClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    toggleConfirmationModal();
  }, [toggleConfirmationModal, setShowActionMenu, showActionMenu]);

  const deleteTaskButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: () => dispatch(deleteApplicationTaskAction(currentTaskId, backToTaskList())),
      },
    ],
    [toggleConfirmationModal, currentTaskId, backToTaskList]
  );

  useEffect(() => {
    dispatch(getAssigneeDropDownData());
    dispatch(getApplicationTaskDefaultEntityDropDownData({ entityName: 'application' }));
    getTaskList();
  }, []);

  return (
    <>
      {applicationTaskList !== undefined && (
        <AccordionItem
          index={index}
          accordionBodyClass="application-active-accordion-scroll"
          header="Tasks"
          count={
            applicationTaskList?.docs?.length < 10
              ? `0${applicationTaskList?.docs?.length}`
              : applicationTaskList?.docs?.length
          }
          suffix="expand_more"
        >
          <Button
            buttonType="primary-1"
            title="Add Task"
            className="add-task-button"
            onClick={onAddTaskClick}
          />
          {applicationTaskList?.docs?.length > 0 ? (
            applicationTaskList.docs.map(task => (
              <div className="common-accordion-item-content-box" key={task._id}>
                <div className="d-flex align-center just-bet">
                  <div className="document-title-row">
                    <div className="document-title">{task.title || '-'}</div>
                  </div>
                  <div className="d-flex">
                    <Checkbox
                      checked={task.isCompleted}
                      onClick={() => handleTaskCheckbox(task._id, !task.isCompleted)}
                    />
                    <span
                      className="material-icons-round font-placeholder cursor-pointer"
                      onClick={e => onClickActionToggleButton(e, task._id)}
                    >
                      more_vert
                    </span>
                  </div>
                </div>
                <div className={`task-priority-${task.priority}`}>{task.priority}</div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(task.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <span className="details">{task.createdById}</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">{task.description || '-'}</div>
              </div>
            ))
          ) : (
            <div className="no-data-available">Nothing To Show</div>
          )}
        </AccordionItem>
      )}
      {addTaskModal && (
        <Modal
          header="Add Task"
          className="add-task-modal"
          buttons={addTaskModalButton}
          // hideModal={toggleAddTaskModal}
        >
          <div className="common-white-container my-work-add-task-container">
            {INPUTS.map(getComponentFromType)}
          </div>
        </Modal>
      )}
      {editTaskModal && (
        <Modal
          header="Edit Task"
          className="add-task-modal"
          buttons={editTaskModalButton}
          // hideModal={toggleEditTaskModal}
        >
          <div className="common-white-container my-work-add-task-container">
            {INPUTS.map(getComponentFromType)}
          </div>
        </Modal>
      )}
      {showActionMenu && (
        <DropdownMenu style={menuPosition} toggleMenu={setShowActionMenu}>
          <div className="menu-name" onClick={onEditTaskClick}>
            <span className="material-icons-round">edit</span> Edit
          </div>
          <div className="menu-name" onClick={onDeleteTaskClick}>
            <span className="material-icons-round">delete_outline</span> Delete
          </div>
        </DropdownMenu>
      )}
      {showConfirmModal && (
        <Modal header="Delete Task" buttons={deleteTaskButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this Task?</span>
        </Modal>
      )}
    </>
  );
};

export default React.memo(ApplicationTaskAccordion);

ApplicationTaskAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

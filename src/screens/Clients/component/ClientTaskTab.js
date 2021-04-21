import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import {
  changeClientTaskColumnNameListStatus,
  getAssigneeDropDownData,
  getClientTaskColumnList,
  getClientTaskDetail,
  getClientTaskListData,
  getDefaultEntityDropDownData,
  getEntityDropDownData,
  saveClientTaskColumnNameListSelection,
  saveTaskData,
  updateAddTaskStateFields,
  updateTaskData,
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { errorNotification } from '../../../common/Toast';
import { deleteTaskAction } from '../../MyWork/redux/MyWorkAction';
import { MY_WORK_REDUX_CONSTANTS } from '../../MyWork/redux/MyWorkReduxConstants';

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

const ClientTaskTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const clientTaskListData = useSelector(({ clientManagement }) => clientManagement.task.taskList);
  const clientTaskColumnNameListData = useSelector(
    ({ clientManagement }) => clientManagement.task.columnList
  );
  const addTaskState = useSelector(({ clientManagement }) => clientManagement.task.addTask);
  const taskDropDownData = useSelector(
    ({ clientManagement }) => clientManagement.task.dropDownData
  );

  const { page, pages, total, limit, docs, headers } = useMemo(() => clientTaskListData, [
    clientTaskListData,
  ]);
  const { assigneeList, entityList, defaultEntityList } = useMemo(() => taskDropDownData, [
    taskDropDownData,
  ]);
  const [isCompletedChecked, setIsCompletedChecked] = useState(false);

  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile);
  const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);

  const getClientTaskList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        isCompleted: isCompletedChecked && isCompletedChecked ? isCompletedChecked : undefined,
        columnFor: 'client-task',
        ...params,
      };
      dispatch(getClientTaskListData(data, id));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, isCompletedChecked]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getClientTaskList({ page: 1, limit: newLimit });
    },
    [getClientTaskList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientTaskList({ page: newPage, limit });
    },
    [limit, getClientTaskList]
  );

  const { defaultFields, customFields } = useMemo(
    () => clientTaskColumnNameListData || { defaultFields: [], customFields: [] },
    [clientTaskColumnNameListData]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientTaskColumnNameListSelection({ isReset: true }));
      getClientTaskList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [getClientTaskList, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveClientTaskColumnNameListSelection({ clientTaskColumnNameListData }));
      getClientTaskList();
    } catch (e) {
      /**/
    }
    toggleCustomField();
  }, [getClientTaskList, toggleCustomField, clientTaskColumnNameListData]);

  const onCloseCustomFieldModal = useCallback(() => {
    dispatch(getClientTaskColumnList());
    toggleCustomField();
  }, [toggleCustomField]);

  const buttonsCustomFields = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseCustomFieldModal },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [toggleCustomField]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeClientTaskColumnNameListStatus(data));
  }, []);

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
    [assigneeList, entityList, addTaskState, priorityData, entityTypeData]
  );

  const [editTaskModal, setEditTaskModal] = useState(false);

  const toggleEditTaskModal = useCallback(
    value => setEditTaskModal(value !== undefined ? value : e => !e),
    [setEditTaskModal]
  );

  const [addTaskModal, setAddTaskModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const toggleAddTaskModal = useCallback(
    value => setAddTaskModal(value !== undefined ? value : e => !e),
    [setAddTaskModal]
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
        const params = { entityName: data[0].value };
        if (data[0].value && !isEdit) {
          dispatch(getEntityDropDownData(params));
          updateAddTaskState('entityId', []);
        }
        setIsEdit(false);
      } catch (e) {
        /**/
      }
    },
    [handleSelectInputChange, addTaskState, updateAddTaskState, isEdit, setIsEdit]
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
    toggleAddTaskModal();
  }, [toggleAddTaskModal]);

  const onCloseEditTask = useCallback(() => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
    });
    toggleEditTaskModal();
  }, [toggleEditTaskModal]);

  const getSelectedValues = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'assigneeId': {
          return addTaskState.assigneeId || [];
        }
        case 'priority': {
          return addTaskState.priority || [];
        }
        case 'entityType': {
          return addTaskState.entityType || [];
        }
        case 'entityId': {
          return addTaskState.entityId;
        }
        default:
          return [];
      }
    },
    [addTaskState, assigneeList, priorityData, entityList, entityTypeData]
  );

  const callBackOnTaskAdd = useCallback(() => {
    toggleAddTaskModal();
    getClientTaskList();
  }, [toggleAddTaskModal, getClientTaskList]);

  const callBackOnTaskEdit = useCallback(() => {
    toggleEditTaskModal();
    getClientTaskList();
  }, [toggleEditTaskModal, getClientTaskList]);

  const onSaveTask = useCallback(() => {
    const data = {
      title: addTaskState.title.trim(),
      // priority: addTaskState?.priority[0]?.value,
      dueDate: addTaskState.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId[0]?.value,
      taskFrom: 'client-task',
    };
    if (addTaskState?.priority[0]?.value) data.priority = addTaskState?.priority[0].value;
    if (addTaskState?.entityType[0]?.value) data.entityType = addTaskState?.entityType[0].value;
    if (addTaskState?.entityId[0]?.value) data.entityId = addTaskState?.entityId[0].value;
    if (addTaskState?.description) data.description = addTaskState?.description.trim();

    if (!data.title && data.title.length === 0) {
      errorNotification('Please add title');
    } else {
      try {
        if (editTaskModal) {
          dispatch(updateTaskData(addTaskState._id, data, callBackOnTaskEdit));
        } else {
          dispatch(saveTaskData(data, callBackOnTaskAdd));
        }
      } catch (e) {
        errorNotification('Something went wrong please add again');
      }
    }
  }, [addTaskState, toggleAddTaskModal, callBackOnTaskAdd, callBackOnTaskEdit]);

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
                isSearchable={false}
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
                  dateFormat="dd/MM/yyyy"
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
    [INPUTS, addTaskState, updateAddTaskState, entityList]
  );

  const addTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseAddTask },
      { title: 'Add', buttonType: 'primary', onClick: onSaveTask },
    ],
    [onCloseAddTask, onSaveTask]
  );

  const editTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseEditTask },
      { title: 'Save', buttonType: 'primary', onClick: onSaveTask },
    ],
    [onCloseAddTask, onSaveTask]
  );

  const [deleteTaskData, setDeleteTaskData] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const deleteTask = useCallback(
    data => {
      setDeleteTaskData(data);
      setShowConfirmModal(true);
    },
    [showConfirmModal, setDeleteTaskData]
  );

  const deleteTaskColumn = useMemo(
    () => [
      data => (
        <span
          className="material-icons-round font-danger cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            deleteTask(data);
          }}
        >
          delete_outline
        </span>
      ),
    ],
    [deleteTask]
  );

  const callBack = useCallback(() => {
    toggleConfirmationModal();
    getClientTaskList();
  }, [toggleConfirmationModal, getClientTaskList]);

  const deleteTaskButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteTaskAction(deleteTaskData.id, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, deleteTaskData, callBack]
  );

  useEffect(() => {
    getClientTaskList();
  }, [isCompletedChecked]);

  useEffect(() => {
    dispatch(getClientTaskColumnList());
    dispatch(getAssigneeDropDownData());
  }, []);

  const onSelectTaskRecord = useCallback(
    // eslint-disable-next-line no-shadow
    id => {
      setIsEdit(true);
      dispatch(getClientTaskDetail(id));
      toggleEditTaskModal();
    },
    [toggleEditTaskModal, setIsEdit]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    console.log(searchKeyword);
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getClientTaskList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientTaskList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const setDefaultValuesForAddTask = useCallback(() => {
    dispatch(
      updateAddTaskStateFields(
        'assigneeId',
        assigneeList && assigneeList.filter(e => e.value === _id)
      )
    );
    dispatch(
      updateAddTaskStateFields(
        'entityId',
        defaultEntityList && defaultEntityList.filter(e => e.value === id)
      )
    );
    dispatch(
      updateAddTaskStateFields(
        'entityType',
        entityTypeData && entityTypeData.filter(e => e.value === 'client')
      )
    );
  }, [assigneeList, defaultEntityList, entityTypeData]);

  const onClickAddTask = useCallback(() => {
    setDefaultValuesForAddTask();
    toggleAddTaskModal();
  }, [setDefaultValuesForAddTask, toggleAddTaskModal]);

  useEffect(() => {
    dispatch(getDefaultEntityDropDownData({ entityName: 'client' }));
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Tasks</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search mr-15"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <Checkbox
            title="Show Completed"
            checked={isCompletedChecked}
            onChange={() => setIsCompletedChecked(!isCompletedChecked)}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <Button buttonType="success" title="Add" onClick={onClickAddTask} />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                tableClass="white-header-table"
                valign="center"
                rowClass="cursor-pointer task-row"
                data={docs}
                headers={headers}
                refreshData={getClientTaskList}
                recordSelected={onSelectTaskRecord}
                extraColumns={deleteTaskColumn}
              />
            </div>
            <Pagination
              className="common-list-pagination"
              total={total}
              pages={pages}
              page={page}
              limit={limit}
              pageActionClick={pageActionClick}
              onSelectLimit={onSelectLimit}
            />
          </>
        ) : (
          <div className="no-data-available">No data available</div>
        )
      ) : (
        <Loader />
      )}
      {customFieldModal && (
        <CustomFieldModal
          buttons={buttonsCustomFields}
          toggleCustomField={toggleCustomField}
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
        />
      )}
      {showConfirmModal && (
        <Modal header="Delete Task" buttons={deleteTaskButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this Task?</span>
        </Modal>
      )}
      {addTaskModal && (
        <Modal
          header="Add Task"
          className="add-task-modal"
          buttons={addTaskModalButton}
          hideModal={toggleAddTaskModal}
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
          hideModal={toggleEditTaskModal}
        >
          <div className="common-white-container my-work-add-task-container">
            {INPUTS.map(getComponentFromType)}
          </div>
        </Modal>
      )}
    </>
  );
};
export default ClientTaskTab;

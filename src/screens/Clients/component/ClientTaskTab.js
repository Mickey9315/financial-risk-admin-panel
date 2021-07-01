import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import {
  changeClientTaskColumnNameListStatus,
  deleteTaskAction,
  getAssigneeDropDownData,
  getClientTaskColumnList,
  getClientTaskDetail,
  getClientTaskListData,
  getDefaultEntityDropDownData,
  getEntityDropDownData,
  saveClientTaskColumnNameListName,
  saveTaskData,
  updateAddTaskStateFields,
  updateTaskData,
} from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import Modal from '../../../common/Modal/Modal';
import Input from '../../../common/Input/Input';
import { errorNotification } from '../../../common/Toast';
import { CLIENT_REDUX_CONSTANTS } from '../redux/ClientReduxConstants';

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

const ClientTaskTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const {
    taskList,
    dropDownData,
    clientTaskColumnNameList,
    clientTaskDefaultColumnNameList,
  } = useSelector(({ clientManagement }) => clientManagement?.task ?? {});
  const { entityType, ...addTaskState } = useSelector(
    ({ clientManagement }) => clientManagement?.task?.addTask ?? {}
  );

  const {
    viewClientTaskColumnSaveButtonLoaderAction,
    viewClientTaskColumnResetButtonLoaderAction,
    viewClientSaveNewTaskButtonLoaderAction,
    viewClientUpdateTaskButtonLoaderAction,
    viewClientDeleteTaskButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { page, pages, total, limit, docs, headers } = useMemo(() => taskList ?? {}, [taskList]);
  const { assigneeList, entityList, defaultEntityList } = useMemo(() => dropDownData ?? {}, [
    dropDownData,
  ]);
  const [isCompletedChecked, setIsCompletedChecked] = useState(false);

  const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile ?? {});
  const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);

  const getClientTaskList = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        isCompleted: isCompletedChecked && isCompletedChecked ? isCompletedChecked : undefined,
        columnFor: 'client-task',
        ...params,
      };
      try {
        await dispatch(getClientTaskListData(data, id));
      } catch (e) {
        /**/
      }
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, isCompletedChecked, id]
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
    () => clientTaskColumnNameList ?? { defaultFields: [], customFields: [] },
    [clientTaskColumnNameList]
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveClientTaskColumnNameListName({ isReset: true }));
    dispatch(getClientTaskColumnList());
    getClientTaskList();
    toggleCustomField();
  }, [toggleCustomField, getClientTaskList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(clientTaskColumnNameList, clientTaskDefaultColumnNameList);
      if (!isBothEqual) {
        await dispatch(saveClientTaskColumnNameListName({ clientTaskColumnNameList }));
        getClientTaskList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    getClientTaskList,
    toggleCustomField,
    clientTaskColumnNameList,
    clientTaskDefaultColumnNameList,
  ]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_COLUMN_NAME_LIST_ACTION,
      data: clientTaskDefaultColumnNameList,
    });
    toggleCustomField();
  }, [clientTaskDefaultColumnNameList, toggleCustomField]);

  const buttonsCustomFields = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewClientTaskColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewClientTaskColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewClientTaskColumnResetButtonLoaderAction,
      viewClientTaskColumnSaveButtonLoaderAction,
    ]
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
        data: assigneeList ?? [],
      },
      {
        label: 'Priority',
        placeholder: 'Select Priority',
        type: 'select',
        name: 'priority',
        data: priorityData ?? [],
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
        data: entityTypeData ?? [],
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Select Entity',
        type: 'select',
        name: 'entityId',
        data: entityList ?? [],
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
      updateAddTaskState(data?.name, data);
      if (data?.name === 'entityType') {
        dispatch(getEntityDropDownData({ entityName: data?.value }));
        updateAddTaskState('entityId', []);
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

  const onCloseAddTask = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_RESET_ADD_TASK_STATE_ACTION,
    });
    toggleAddTaskModal();
  }, [toggleAddTaskModal]);

  const onCloseEditTask = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_RESET_ADD_TASK_STATE_ACTION,
    });
    toggleEditTaskModal();
  }, [toggleEditTaskModal]);

  const getSelectedValues = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'assigneeId': {
          return addTaskState?.assigneeId || [];
        }
        case 'priority': {
          return addTaskState?.priority || [];
        }
        case 'entityType': {
          return entityType || [];
        }
        case 'entityId': {
          return addTaskState?.entityId || [];
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
      title: addTaskState?.title?.trim(),
      // priority: addTaskState?.priority[0]?.value,
      dueDate: addTaskState?.dueDate || new Date().toISOString(),
      assigneeId: addTaskState?.assigneeId?.value,
      assigneeType: addTaskState?.assigneeId?.type ?? addTaskState?.assigneeType,
      taskFrom: 'client-task',
      priority: addTaskState?.priority?.value ?? undefined,
      entityType: entityType?.value ?? undefined,
      entityId: addTaskState?.entityId?.value ?? undefined,
      description: addTaskState?.description?.trim() ?? undefined,
    };

    if (!data?.title && data?.title?.length === 0) {
      errorNotification('Please add title');
    } else {
      try {
        if (editTaskModal) {
          dispatch(updateTaskData(addTaskState?._id, data, callBackOnTaskEdit));
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
                value={addTaskState?.[input.name]}
                onChange={handleTextInputChange}
              />
            </>
          );
          break;

        case 'select': {
          const handleOnChange = handleSelectInputChange;

          component = (
            <>
              <span>{input.label}</span>
              <ReactSelect
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                isSearchable
                value={selectedValues}
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
                    addTaskState?.[input.name]
                      ? new Date(addTaskState?.[input.name])?.toLocaleDateString()
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
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: onSaveTask,
        isLoading: viewClientSaveNewTaskButtonLoaderAction,
      },
    ],
    [onCloseAddTask, onSaveTask, viewClientSaveNewTaskButtonLoaderAction]
  );

  const editTaskModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onCloseEditTask },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onSaveTask,
        isLoading: viewClientUpdateTaskButtonLoaderAction,
      },
    ],
    [onCloseAddTask, onSaveTask, viewClientUpdateTaskButtonLoaderAction]
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
            await dispatch(deleteTaskAction(deleteTaskData?.id, () => callBack()));
          } catch (e) {
            /**/
          }
        },
        isLoading: viewClientDeleteTaskButtonLoaderAction,
      },
    ],
    [toggleConfirmationModal, deleteTaskData, callBack, viewClientDeleteTaskButtonLoaderAction]
  );

  useEffect(() => {
    getClientTaskList();
  }, [isCompletedChecked, id]);

  useEffect(() => {
    dispatch(getClientTaskColumnList());
    dispatch(getAssigneeDropDownData());
  }, []);

  const onSelectTaskRecord = useCallback(
    // eslint-disable-next-line no-shadow
    id => {
      dispatch(getClientTaskDetail(id));
      toggleEditTaskModal();
    },
    [toggleEditTaskModal]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getClientTaskList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getClientTaskList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const setDefaultValuesForAddTask = useCallback(() => {
    dispatch(
      updateAddTaskStateFields(
        'assigneeId',
        assigneeList?.find(e => e.value === _id)
      )
    );
    dispatch(
      updateAddTaskStateFields(
        'entityId',
        defaultEntityList?.find(e => e.value === id)
      )
    );
    dispatch(
      updateAddTaskStateFields(
        'entityType',
        entityTypeData?.find(e => e.value === 'client')
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
          <div className="no-record-found">No record found</div>
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
            {INPUTS?.map(getComponentFromType)}
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
            {INPUTS?.map(getComponentFromType)}
          </div>
        </Modal>
      )}
    </>
  );
};
export default ClientTaskTab;

import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import { getTaskById, markTaskAsComplete } from '../redux/MyWorkAction';
import Loader from '../../../common/Loader/Loader';

const MyWorkAddTask = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const backToTaskList = useCallback(() => {
    history.push('/my-work');
  }, []);

  const taskDetails = useSelector(({ myWorkReducer }) => myWorkReducer?.task?.taskDetail ?? {});

  const { myWorkCompleteTaskLoaderButtonAction, myWorkViewTaskLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Title',
        placeholder: '-',
        type: 'text',
        name: 'title',
      },
      {
        label: 'Assignee',
        placeholder: '-',
        type: 'text',
        name: 'assigneeId',
      },
      {
        label: 'Priority',
        placeholder: '-',
        type: 'text',
        name: 'priority',
      },
      {
        label: 'Due Date',
        placeholder: '-',
        type: 'text',
        name: 'dueDate',
      },
      {
        label: 'Task For',
        placeholder: '-',
        type: 'text',
        name: 'entityType',
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: '-',
        type: 'text',
        name: 'entityId',
      },
      {
        type: 'blank',
      },
      {
        label: 'Description',
        placeholder: '-',
        type: 'text',
        name: 'description',
      },
    ],
    []
  );

  const taskFieldValues = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'title': {
          return taskDetails?.title ?? '';
        }
        case 'assigneeId': {
          return taskDetails?.assigneeId?.label ?? '';
        }
        case 'priority': {
          return taskDetails?.priority?.label ?? '';
        }
        case 'entityType': {
          return taskDetails?.entityType?.label ?? '';
        }
        case 'entityId': {
          return taskDetails?.entityId?.label ?? [];
        }
        case 'dueDate': {
          return moment(taskDetails?.dueDate).format('MM/DD/YYYY');
        }
        case 'description': {
          return taskDetails?.description ?? '';
        }
        default:
          return '';
      }
    },
    [taskDetails]
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
                value={taskFieldValues(input.name)}
                disabled
                borderClass="disabled-control"
              />
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
    [INPUTS, taskDetails, taskFieldValues]
  );

  const onClickCompleteTask = useCallback(() => {
    if (id) {
      const data = {
        isCompleted: !taskDetails?.isCompleted,
      };
      dispatch(markTaskAsComplete(id, data));
    }
  }, [id, taskDetails?.isCompleted]);

  useEffect(() => {
    dispatch(getTaskById(id));
  }, [id]);

  return (
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!myWorkViewTaskLoaderAction ? (
        taskDetails ? (
          <>
            <div className="breadcrumb-button-row">
              <div className="breadcrumb">
                <span onClick={backToTaskList}>Task List</span>
                <span className="material-icons-round">navigate_next</span>
                <span>View Task</span>
              </div>
              <div className="buttons-row">
                <Button buttonType="primary-1" title="Close" onClick={() => backToTaskList()} />
                <Button
                  buttonType="primary"
                  title={!taskDetails?.isCompleted ? `Complete` : 'Pending'}
                  onClick={onClickCompleteTask}
                  isLoading={myWorkCompleteTaskLoaderButtonAction}
                />
              </div>
            </div>
            <div className="common-white-container my-work-add-task-container">
              {INPUTS.map(getComponentFromType)}
            </div>
          </>
        ) : (
          <div className="no-record-found">No Record Found</div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyWorkAddTask;

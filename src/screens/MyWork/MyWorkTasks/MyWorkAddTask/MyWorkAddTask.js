import React, { useCallback, useMemo } from 'react';
import './MyWorkAddTask.scss';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import Button from '../../../../common/Button/Button';
import Input from '../../../../common/Input/Input';

const MyWorkAddTask = () => {
  const history = useHistory();
  const backToTaskList = () => {
    history.replace('/my-work');
  };

  const INPUTS = useMemo(
    () => [
      {
        label: 'Title',
        placeholder: 'Enter title',
        type: 'text',
        name: 'title',
      },
      {
        label: 'Assignee',
        placeholder: 'Select',
        type: 'select',
        name: 'assignee',
        data: [],
      },
      {
        label: 'Priority',
        placeholder: 'Select',
        type: 'select',
        name: 'priority',
        data: [],
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
        name: 'taskFor',
        data: [],
      },
      {
        type: 'blank',
      },
      {
        label: 'Entity Labels',
        placeholder: 'Enter Entity',
        type: 'search',
        name: 'entityLabel',
        data: [],
      },
      {
        type: 'blank',
      },
      {
        label: 'Description',
        placeholder: 'Enter Description',
        type: 'text',
        name: 'description',
        data: [],
      },
    ],
    []
  );
  const getComponentFromType = useCallback(input => {
    let component = null;
    switch (input.type) {
      case 'text':
        component = (
          <>
            <span>{input.label}</span>
            <Input type="text" name={input.name} placeholder={input.placeholder} />
          </>
        );
        break;
      case 'search':
        component = (
          <>
            <span>{input.label}</span>
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              suffix="search"
              suffixClass="search-icon"
            />
          </>
        );

        break;
      case 'entityName':
        component = (
          <>
            <span>{input.label}</span>
            <Input type="text" placeholder={input.placeholder} />
          </>
        );
        break;
      case 'select':
        component = (
          <>
            <span>{input.label}</span>
            <ReactSelect
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              searchable={false}
            />
          </>
        );
        break;
      case 'date':
        component = (
          <>
            <span>{input.label}</span>
            <div className="date-picker-container">
              <DatePicker placeholderText="Select date..." />
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
          <Button buttonType="primary" title="Edit" />
          <Button buttonType="danger" title="Delete" />
        </div>
      </div>
      <div className="common-white-container my-work-add-task-container">
        {INPUTS.map(getComponentFromType)}
      </div>
    </>
  );
};

export default MyWorkAddTask;

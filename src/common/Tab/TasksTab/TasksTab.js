import React from 'react';
import './TasksTab.scss';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';

const TasksTab = () => {
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const defaultFields = [
    'Name',
    'Job Title',
    'Email',
    'Portal Access',
    'Decision Maker',
    'Left Company',
  ];
  const customFields = [
    'Phone',
    'Trading As',
    'Net of brokerage',
    'Policy Type',
    'Expiry Date',
    'Inception Date',
  ];
  const columnStructure = {
    columns: [
      {
        type: 'checkbox',
        name: 'checkbox',
        value: 'checked',
      },
      {
        type: 'tag',
        name: 'Priority',
        value: 'priority',
      },
      {
        type: 'date',
        name: 'Date',
        value: 'date',
      },
      {
        type: 'text',
        name: 'Type',
        value: 'type',
      },
      {
        type: 'text',
        name: 'Title',
        value: 'title',
      },
      {
        type: 'text',
        name: 'Status',
        value: 'status',
      },
      {
        type: 'text',
        name: 'Assignee',
        value: 'assignee',
      },
    ],
    actions: [
      {
        type: 'edit',
        name: 'Edit',
        icon: 'edit-outline',
      },
      {
        type: 'delete',
        name: 'Delete',
        icon: 'trash-outline',
      },
    ],
  };
  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Tasks</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search mr-15"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <Checkbox title="Show Completed" />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <Button buttonType="success" title="Add" />
        </div>
      </div>
      <Table header={columnStructure} headerClass="tab-table-header" />
      <Pagination />
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default TasksTab;

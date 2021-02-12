import React from 'react';
import './NotesTab.scss';
import BigInput from '../../BigInput/BigInput';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../Button/Button';

const NotesTab = () => {
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
        type: 'text',
        name: 'Description',
        value: 'description',
      },
      {
        type: 'date',
        name: 'Create Date',
        value: 'created_date',
      },
      {
        type: 'date',
        name: 'Modified',
        value: 'modified',
      },
      {
        type: 'text',
        name: 'Created By',
        value: 'created_by',
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
        <div className="tab-content-header">Notes</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
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

export default NotesTab;

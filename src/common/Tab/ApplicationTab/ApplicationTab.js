import React from 'react';
import './ApplicationTab.scss';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';

const ApplicationTab = () => {
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
        type: 'text',
        name: 'Application ID',
        value: 'application_id',
      },
      {
        type: 'text',
        name: 'Status',
        value: 'status',
      },
      {
        type: 'text',
        name: 'Credit Limit',
        value: 'credit_email',
      },
      {
        type: 'text',
        name: 'Debtor Name',
        value: 'debtor_name',
      },
      {
        type: 'date',
        name: 'Request Date',
        value: 'request_date',
      },
      {
        type: 'date',
        name: 'Last Modified Date',
        value: 'last_modified_date',
      },
      {
        type: 'date',
        name: 'Expiry Date',
        value: 'expiry_date',
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
        <div className="tab-content-header">Application</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
        </div>
      </div>
      <div className="tab-table-container">
        <Table
          header={columnStructure}
          tableClass="white-header-table"
          headerClass="tab-table-header"
        />
      </div>
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

export default ApplicationTab;

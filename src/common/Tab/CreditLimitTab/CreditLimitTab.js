import React from 'react';
import './CreditLimitTab.scss';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';

const CreditLimitTab = () => {
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
        name: 'Name',
        value: 'name',
      },
      {
        type: 'text',
        name: 'Type',
        value: 'type',
      },
      {
        type: 'text',
        name: 'ABN',
        value: 'abn',
      },
      {
        type: 'text',
        name: 'Report Expiry Date',
        value: 'report_expiry_date',
      },
      {
        type: 'button',
        name: 'Credit Limit',
        value: 'credit_limit',
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
        <div className="tab-content-header">Credit Limit</div>
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
      <Table headerClass="tab-table-header" header={columnStructure} />
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

export default CreditLimitTab;

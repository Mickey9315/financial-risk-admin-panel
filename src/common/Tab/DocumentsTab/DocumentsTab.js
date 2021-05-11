import React from 'react';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../Button/Button';

const DocumentsTab = () => {
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
        type: 'link',
        name: 'Claim',
        value: 'claim',
      },
      {
        type: 'date',
        name: 'Date Submitted',
        value: 'date_submitted',
      },
      {
        type: 'link',
        name: 'Debtor Name',
        value: 'debtor_name',
      },
      {
        type: 'text',
        name: 'Gross Debt Amount',
        value: 'gross_debt_amount',
      },
      {
        type: 'text',
        name: 'Amount Paid',
        value: 'amount_paid',
      },
      {
        type: 'text',
        name: 'Underwriter',
        value: 'underwriter',
      },
      {
        type: 'text',
        name: 'Stage',
        value: 'stage',
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
        <div className="tab-content-header">Documents</div>
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
          <IconButton buttonType="primary" title="cloud_upload" />
          <IconButton buttonType="primary-1" title="cloud_download" />
          <Button buttonType="secondary" title="Sync With CRM" />
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

export default DocumentsTab;

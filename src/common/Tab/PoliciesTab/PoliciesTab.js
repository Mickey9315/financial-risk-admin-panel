import React from 'react';
import BigInput from '../../BigInput/BigInput';
import IconButton from '../../IconButton/IconButton';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import Button from '../../Button/Button';

const PoliciesTab = () => {
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
        type: 'link',
        name: 'Product',
        value: 'product',
      },
      {
        type: 'text',
        name: 'Policy Number',
        value: 'policy_number',
      },
      {
        type: 'text',
        name: 'Policy Period',
        value: 'policy_period',
      },
      {
        type: 'date',
        name: 'Inception Date',
        value: 'inception_date',
      },
      {
        type: 'date',
        name: 'Expiry Date',
        value: 'expiry_date',
      },
      {
        type: 'text',
        name: 'Product',
        value: 'product',
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
        <div className="tab-content-header">Policies</div>
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

export default PoliciesTab;

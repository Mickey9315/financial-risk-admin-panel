import React from 'react';
import './ContactsTab.scss';
import IconButton from '../../IconButton/IconButton';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import BigInput from '../../BigInput/BigInput';
import Button from '../../Button/Button';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';

const ContactsTab = () => {
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
        name: 'Job Title',
        value: 'jobTitle',
      },
      {
        type: 'email',
        name: 'Email',
        value: 'email',
      },
      {
        type: 'checkbox',
        name: 'Portal Access',
        value: 'portal_access',
      },
      {
        type: 'checkbox',
        name: 'Decision Maker',
        value: 'decision_maker',
      },
      {
        type: 'checkbox',
        name: 'Left Company',
        value: 'left_company',
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
        <div className="tab-content-header">Contacts</div>
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

export default ContactsTab;

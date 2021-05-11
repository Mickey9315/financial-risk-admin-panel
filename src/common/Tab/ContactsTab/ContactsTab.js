import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../../IconButton/IconButton';
import CustomFieldModal from '../../Modal/CustomFieldModal/CustomFieldModal';
import BigInput from '../../BigInput/BigInput';
import Button from '../../Button/Button';
import Table from '../../Table/Table';
import Pagination from '../../Pagination/Pagination';

const ContactsTab = props => {
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const {
    customFields,
    defaultFields,
    buttons,
    onChangeSelectedColumn,
    headers,
    data,
    recordSelected,
    recordActionClick,
  } = props;

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
      <div className="tab-table-container">
        <Table
          data={data}
          headers={headers}
          recordSelected={recordSelected}
          recordActionClick={recordActionClick}
          rowClass="cursor-pointer"
        />
      </div>
      <Pagination />
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={buttons}
        />
      )}
    </>
  );
};

ContactsTab.propTypes = {
  customFields: PropTypes.array,
  defaultFields: PropTypes.array,
  buttons: PropTypes.array,
  onChangeSelectedColumn: PropTypes.func,
  headers: PropTypes.array,
  data: PropTypes.array,
  recordSelected: PropTypes.func,
  recordActionClick: PropTypes.func,
};

ContactsTab.defaultProps = {
  customFields: [],
  defaultFields: [],
  buttons: [],
  onChangeSelectedColumn: () => {},
  headers: [],
  data: [],
  recordSelected: () => {},
  recordActionClick: () => {},
};

export default ContactsTab;

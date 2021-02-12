import React from 'react';
import './CustomFieldModal.scss';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import Checkbox from '../../Checkbox/Checkbox';

const CustomFieldModal = props => {
  const { defaultFields, customFields, toggleCustomField } = props;

  const customFieldsModalButtons = [
    { title: 'Reset Defaults', buttonType: 'outlined-primary' },
    { title: 'Close', buttonType: 'primary-1', onClick: toggleCustomField },
    { title: 'Save', buttonType: 'primary' },
  ];
  return (
    <Modal
      headerIcon="format_line_spacing"
      header="Custom Fields"
      buttons={customFieldsModalButtons}
      className="custom-field-modal"
    >
      <div className="custom-field-content">
        <div>
          <div className="custom-field-title">Default Fields</div>
          {defaultFields.map(e => (
            <Checkbox title={e} />
          ))}
        </div>
        <div>
          <div className="custom-field-title">Custom Fields</div>
          {customFields.map(e => (
            <Checkbox title={e} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

CustomFieldModal.propTypes = {
  customFields: PropTypes.array,
  defaultFields: PropTypes.array,
  toggleCustomField: PropTypes.any,
};

CustomFieldModal.defaultProps = {
  customFields: [],
  defaultFields: [],
  toggleCustomField: '',
};

export default CustomFieldModal;

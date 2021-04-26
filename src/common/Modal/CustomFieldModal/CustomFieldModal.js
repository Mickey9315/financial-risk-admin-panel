import React from 'react';
import './CustomFieldModal.scss';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import Checkbox from '../../Checkbox/Checkbox';

const CustomFieldModal = props => {
  const { defaultFields, customFields, buttons, onChangeSelectedColumn, toggleCustomField } = props;

  return (
    <Modal
      headerIcon="format_line_spacing"
      header="Custom Fields"
      buttons={buttons}
      className="custom-field-modal"
      bodyClassName="custom-filed-modal-body"
      hideModal={toggleCustomField}
    >
      <div className="custom-field-content">
        <div>
          <div className="custom-field-title">Default Fields</div>
          {defaultFields.map((data, index) => (
            <Checkbox
              key={data.label + index.toString()}
              title={data.label}
              name={data.name}
              checked={data.isChecked}
              onChange={e => onChangeSelectedColumn('defaultFields', data.name, e.target.checked)}
            />
          ))}
        </div>
        <div>
          <div className="custom-field-title">Custom Fields</div>
          {customFields.map((data, index) => (
            <Checkbox
              key={data.label + index.toString()}
              title={data.label}
              checked={data.isChecked}
              onChange={e => onChangeSelectedColumn('customFields', data.name, e.target.checked)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

CustomFieldModal.propTypes = {
  customFields: PropTypes.array,
  defaultFields: PropTypes.array,
  buttons: PropTypes.array,
  onChangeSelectedColumn: PropTypes.func,
  toggleCustomField: PropTypes.func,
};

CustomFieldModal.defaultProps = {
  customFields: [],
  defaultFields: [],
  buttons: [],
  onChangeSelectedColumn: () => {},
  toggleCustomField: () => {},
};

export default CustomFieldModal;

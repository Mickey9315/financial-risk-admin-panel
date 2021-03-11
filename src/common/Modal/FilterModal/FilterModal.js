import React from 'react';
import './Filter.scss';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import Checkbox from '../../Checkbox/Checkbox';

const FilterModal = props => {
  const { defaultFields, customFields, buttons, onChangeSelectedColumn, hideModal } = props;

  return (
    <Modal
      headerIcon="format_line_spacing"
      header="Custom Fields"
      buttons={buttons}
      className="custom-field-modal"
      hideModal={hideModal}
    >
      <div className="custom-field-content">
        <div>
          <div className="custom-field-title">Default Fields</div>
          {defaultFields.map(data => (
            <Checkbox
              title={data.label}
              name={data.name}
              checked={data.isChecked}
              onChange={e => onChangeSelectedColumn('defaultFields', data.name, e.target.checked)}
            />
          ))}
        </div>
        <div>
          <div className="custom-field-title">Custom Fields</div>
          {customFields.map(data => (
            <Checkbox
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

FilterModal.propTypes = {
  customFields: PropTypes.array,
  defaultFields: PropTypes.array,
  buttons: PropTypes.array,
  onChangeSelectedColumn: PropTypes.func,
  hideModal: PropTypes.func.isRequired,
};

FilterModal.defaultProps = {
  customFields: [],
  defaultFields: [],
  buttons: [],
  onChangeSelectedColumn: () => {},
};

export default FilterModal;

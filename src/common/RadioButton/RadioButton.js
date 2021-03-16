import React from 'react';
import PropTypes from 'prop-types';
import './RadioButton.scss';

const RadioButton = props => {
  const { id, label, value, name } = props;
  return (
    <>
      <input type="radio" id={id} name={name} value={value} />
      <label htmlFor={id} className="radio-button mr-15">
        {label}
      </label>
    </>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
};

RadioButton.defaultProps = {
  label: '',
};

export default RadioButton;

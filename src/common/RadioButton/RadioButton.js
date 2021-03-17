import React from 'react';
import PropTypes from 'prop-types';
import './RadioButton.scss';

const RadioButton = props => {
  const { id, label, value, name, className, ...restProps } = props;
  return (
    <div className={className}>
      <input type="radio" id={id} name={name} value={value} {...restProps} />
      <label htmlFor={id} className="radio-button mr-15">
        {label}
      </label>
    </div>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
};

RadioButton.defaultProps = {
  label: '',
  className: '',
};

export default RadioButton;

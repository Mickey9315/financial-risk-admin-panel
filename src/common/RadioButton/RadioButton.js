import React from 'react';
import PropTypes from 'prop-types';
import './RadioButton.scss';

const RadioButton = props => {
  const { id, label } = props;
  return (
    <>
      <input type="radio" id={id} name="subscription" value="FREE_TRIAL" />
      <label htmlFor={id} className="radio-button mr-15">
        {label}
      </label>
    </>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
};

RadioButton.defaultProps = {
  label: '',
};

export default RadioButton;

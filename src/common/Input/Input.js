import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = props => {
  const { placeholder, type, className, ...restProps } = props;
  const inputClass = `input ${className}`;

  return (
    <input
      autoComplete="off"
      type={type}
      placeholder={placeholder}
      className={inputClass}
      {...restProps}
    />
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  className: '',
};

export default Input;

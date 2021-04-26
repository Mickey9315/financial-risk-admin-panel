import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = props => {
  const {
    prefix,
    prefixType,
    prefixClass,
    suffix,
    suffixClass,
    placeholder,
    type,
    borderClass,
    className,
    ...restProps
  } = props;
  const inputClass = `input ${className}`;
  const prefixIconClassName = `material-icons-round prefix ${prefixClass}`;
  const prefixClassName = `prefix ${prefixClass}`;
  const suffixClassName = `material-icons-round suffix ${suffixClass}`;
  const inputBorderClass = `input-container ${borderClass}`;

  return (
    <div className={inputBorderClass}>
      {prefix && prefixType === 'icon' && <span className={prefixIconClassName}>{prefix}</span>}
      {prefix && prefixType === 'pincode' && (
        <input className={prefixClassName} placeholder="+01" />
      )}
      <input
        autoComplete="off"
        type={type}
        placeholder={placeholder}
        className={inputClass}
        {...restProps}
      />
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </div>
  );
};

Input.propTypes = {
  prefix: PropTypes.string,
  prefixType: PropTypes.oneOf(['icon', 'pincode', 'chip', '']),
  prefixClass: PropTypes.string,
  suffix: PropTypes.string,
  suffixClass: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  borderClass: PropTypes.string,
};

Input.defaultProps = {
  prefix: '',
  prefixType: '',
  prefixClass: '',
  suffix: '',
  suffixClass: '',
  placeholder: '',
  className: '',
  borderClass: '',
};

export default Input;

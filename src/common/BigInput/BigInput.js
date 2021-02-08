import React from 'react';
import PropTypes from 'prop-types';
import './BigInput.scss';

const BigInput = props => {
  const {
    prefix,
    prefixClass,
    suffix,
    suffixClass,
    placeholder,
    type,
    className,
    ...restProps
  } = props;
  const inputClass = `input ${className}`;
  const prefixClassName = `material-icons-round prefix ${prefixClass}`;
  const suffixClassName = `material-icons-round suffix ${suffixClass}`;

  return (
    <div className="big-input-container">
      {prefix && <span className={prefixClassName}>{prefix}</span>}
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

BigInput.propTypes = {
  prefix: PropTypes.string,
  prefixClass: PropTypes.string,
  suffix: PropTypes.string,
  suffixClass: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
};

BigInput.defaultProps = {
  prefix: '',
  prefixClass: '',
  suffix: '',
  suffixClass: '',
  placeholder: '',
  className: '',
};

export default BigInput;

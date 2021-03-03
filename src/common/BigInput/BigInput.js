import React from 'react';
import PropTypes from 'prop-types';
import './BigInput.scss';

const BigInput = React.forwardRef((props, ref) => {
  const {
    prefix,
    prefixClass,
    suffix,
    suffixClass,
    placeholder,
    type,
    borderClass,
    className,
    ...restProps
  } = props;
  const inputClass = `big-input ${className}`;
  const prefixClassName = `material-icons-round prefix ${prefixClass}`;
  const suffixClassName = `material-icons-round suffix ${suffixClass}`;
  const inputBorderClass = `big-input-container ${borderClass}`;
  return (
    <div className={inputBorderClass}>
      {prefix && <span className={prefixClassName}>{prefix}</span>}
      <input
        ref={ref}
        autoComplete="off"
        type={type}
        placeholder={placeholder}
        className={inputClass}
        {...restProps}
      />
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </div>
  );
});

BigInput.propTypes = {
  prefix: PropTypes.string,
  prefixClass: PropTypes.string,
  suffix: PropTypes.string,
  suffixClass: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  borderClass: PropTypes.string,
};

BigInput.defaultProps = {
  prefix: '',
  prefixClass: '',
  suffix: '',
  suffixClass: '',
  placeholder: '',
  className: '',
  borderClass: '',
};

export default BigInput;

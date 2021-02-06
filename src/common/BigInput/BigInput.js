import React from "react";
import PropTypes from "prop-types";
import "./BigInput.scss";

const BigInput = (props) => {
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
  const prefixClassName = `material-icons prefix ${prefixClass}`;
  const suffixClassName = `material-icons suffix ${suffixClass}`;

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
  type: PropTypes.string,
  className: PropTypes.string,
};
export default BigInput;

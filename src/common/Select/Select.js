import React from 'react';
import './Select.scss';
import PropTypes from 'prop-types';

const Select = props => {
  const { placeholder, options, className, ...restProps } = props;
  const selectClass = `select ${className}`;

  return (
    <select placeholder={placeholder} className={selectClass} {...restProps}>
      {options.map(e => (
        <option className="select-option" value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  placeholder: '',
  options: [],
  className: '',
};

export default Select;

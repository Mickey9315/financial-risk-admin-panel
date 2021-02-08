import React from 'react';
import './Select.scss';
import PropTypes from 'prop-types';

const Select = props => {
  const { selectedValue, placeholder, options, className, ...restProps } = props;
  const selectClass = `select ${className}`;

  return (
    <div className="select-container">
      <select placeholder={placeholder} className={selectClass} {...restProps}>
        {options.map(e => (
          <option className="select-option" value={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.string,
  selectedValue: PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  placeholder: '',
  options: [],
  selectedValue: '',
  className: '',
};

export default Select;

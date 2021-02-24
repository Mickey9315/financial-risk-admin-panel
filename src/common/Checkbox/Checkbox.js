import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = props => {
  const { title, className, ...restProps } = props;
  const checkboxClasses = `d-flex align-center ${className}`;
  return (
    <div className={checkboxClasses}>
      <label className="checkbox-container">
        {title}
        <input type="checkbox" {...restProps} />
        <span className="checkmark" />
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  className: '',
};
export default Checkbox;

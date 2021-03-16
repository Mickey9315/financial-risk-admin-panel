import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = props => {
  const { title, className, ...restProps } = props;
  const checkboxClasses = `d-flex align-center ${className}`;
  return (
    <div className={checkboxClasses}>
      <label className="checkbox-container" style={{ paddingLeft: title ? '35px' : '24px' }}>
        {title}
        <input type="checkbox" {...restProps} />
        <span className="checkmark" />
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  title: '',
  className: '',
};
export default Checkbox;

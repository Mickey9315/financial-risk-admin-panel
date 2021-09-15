import React from 'react';
import PropTypes from 'prop-types';

const Switch = props => {
  const { id, className, labelClass, ...restProps } = props;
  const switchClass = `common-switch ${className}`;
  return (
    <span className="d-flex align-center">
      <input
        type="checkbox"
        id={id}
        className={switchClass}
        {...restProps}
        style={{ height: 0, width: 0 }}
      />
      <label htmlFor={id} className={labelClass}>
        <div />
      </label>
    </span>
  );
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  labelClass: PropTypes.string,
};

Switch.defaultProps = {
  className: 'common-switch ',
  labelClass: '',
};

export default Switch;

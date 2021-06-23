import React from 'react';
import PropTypes from 'prop-types';

const Switch = props => {
  const { id, className, ...restProps } = props;
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
      <label htmlFor={id}>
        <div />
      </label>
    </span>
  );
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Switch.defaultProps = {
  className: 'common-switch ',
};

export default Switch;

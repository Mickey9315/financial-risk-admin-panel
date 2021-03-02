import React from 'react';
import PropTypes from 'prop-types';
import './Switch.scss';

const Switch = props => {
  const { status, ...restProps } = props;
  return (
    <>
      <input
        type="checkbox"
        id="common-switch"
        className="common-switch"
        onClick={status}
        {...restProps}
      />
      <label htmlFor="common-switch" />
    </>
  );
};

Switch.propTypes = {
  status: PropTypes.bool,
};

Switch.defaultProps = {
  status: false,
};

export default Switch;

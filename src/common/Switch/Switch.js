import React from 'react';
import PropTypes from 'prop-types';
import './Switch.scss';

const Switch = props => {
  const { status } = props;
  return (
    <>
      <input type="checkbox" id="switch" onClick={status} />
      <label htmlFor="switch" status />
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

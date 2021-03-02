import React from 'react';
import './Switch.scss';

const Switch = props => {
  return (
    <>
      <input type="checkbox" id="common-switch" className="common-switch" {...props} />
      <label htmlFor="common-switch" />
    </>
  );
};

export default Switch;

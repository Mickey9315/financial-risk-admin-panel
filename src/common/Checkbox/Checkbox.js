import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = props => {
  const { checked, title, ...restProps } = props;
  return (
    <>
      <label className="checkbox-container">
        {title}
        <input type="checkbox" checked={checked} {...restProps} />
        <span className="checkmark" />
      </label>
    </>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Checkbox;

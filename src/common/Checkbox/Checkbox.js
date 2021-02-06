import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = props => {
  const { title, ...restProps } = props;
  return (
    <>
      <label className="checkbox-container">
        {title}
        <input type="checkbox" {...restProps} />
        <span className="checkmark" />
      </label>
    </>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Checkbox;

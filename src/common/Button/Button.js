import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

const Button = props => {
  const { title, buttonType, className, ...restProps } = props;
  const buttonClass = `button ${buttonType}-button ${className}`;

  return (
    <button type="button" className={buttonClass} {...restProps}>
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.func.isRequired,
  buttonType: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'primary-1',
    'outlined-primary',
    'outlined-secondary',
    'outlined-red',
  ]).isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
};

export default Button;

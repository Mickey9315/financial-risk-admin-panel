import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { isLoading, title, buttonType, className, ...restProps } = props;
  const buttonClass = `button ${buttonType}-button ${className}`;

  return (
    <button type="button" className={buttonClass} {...restProps} disabled={isLoading}>
      <div className={isLoading && 'button-loader'}>{!isLoading && title}</div>
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  buttonType: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'primary-1',
    'outlined-primary',
    'outlined-secondary',
    'outlined-primary-small',
    'outlined-red-small',
    'outlined-red',
  ]).isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  isLoading: false,
};

export default Button;

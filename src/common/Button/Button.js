import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { isLoading, isDisabled, title, buttonType, className, children, ...restProps } = props;
  const buttonClass = `button ${buttonType}-button ${className}`;

  return (
    <button type="button" className={buttonClass} {...restProps} disabled={isDisabled || isLoading}>
      <div className={isLoading && 'button-loader'}>{!isLoading && title}</div>
      {children}
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
  isDisabled: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

Button.defaultProps = {
  className: '',
  isLoading: false,
  isDisabled: false,
};

export default Button;

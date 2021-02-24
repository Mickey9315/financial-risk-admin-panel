import React from 'react';
import './IconButton.scss';
import PropTypes from 'prop-types';

const IconButton = props => {
  const { title, buttonType, iconColor, className, buttonTitle, ...restProps } = props;
  const buttonClass = `button ${buttonType}-button icon-button ${className}`;
  // const style = `{{borderColor: "${border}"}}`

  return (
    <button type="button" className={buttonClass} {...restProps} title={buttonTitle}>
      <span className="material-icons-round"> {title} </span>
    </button>
  );
};

IconButton.propTypes = {
  title: PropTypes.string.isRequired,
  buttonType: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'primary-1',
    'outlined-primary',
    'outlined-secondary',
    'outlined-red',
    'outlined-bg',
  ]).isRequired,
  className: PropTypes.string,
  iconColor: PropTypes.string,
  buttonTitle: PropTypes.string,
};

IconButton.defaultProps = {
  className: '',
  iconColor: '',
  buttonTitle: '',
};

export default IconButton;

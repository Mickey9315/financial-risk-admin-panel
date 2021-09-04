import React from 'react';
import PropTypes from 'prop-types';

const IconButton = props => {
  const {
    isLoading,
    isBadge,
    badgeCount,
    title,
    buttonType,
    iconColor,
    className,
    buttonTitle,
    ...restProps
  } = props;
  const buttonClass = `button ${buttonType}-button icon-button ${className}`;

  return (
    <button
      type="button"
      className={buttonClass}
      {...restProps}
      title={buttonTitle}
      disabled={isLoading}
    >
      {isBadge && (
        <span className="notification-badge">{badgeCount < 99 ? badgeCount : '99+'}</span>
      )}
      <span className={`material-icons-round ${isLoading && 'button-loader'}`}>
        {!isLoading && title}
      </span>
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
  isLoading: PropTypes.bool,
  isBadge: PropTypes.bool,
  badgeCount: PropTypes.number,
};

IconButton.defaultProps = {
  className: '',
  iconColor: '',
  buttonTitle: '',
  isLoading: false,
  isBadge: false,
  badgeCount: 0,
};

export default IconButton;

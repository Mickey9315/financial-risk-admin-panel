import React from 'react';
import './Modal.scss';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

const Modal = props => {
  const {
    header,
    headerIcon,
    buttons,
    children,
    headerClassName,
    bodyClassName,
    className,
    ...restProps
  } = props;
  const dialogContentClass = `modal-content ${className}`;
  const dialogHeaderClass = `modal-header ${headerClassName}`;
  const dialogBodyClass = `modal-body ${bodyClassName}`;
  return (
    <div className="modal">
      <div className={dialogContentClass} {...restProps}>
        <div className={dialogHeaderClass}>
          {headerIcon && (
            <div className="d-flex just-center">
              <span className="material-icons-round mr-5">{headerIcon}</span>
              {header}
            </div>
          )}
          {!headerIcon && header}
        </div>
        <div className={dialogBodyClass}>{children}</div>
        <div className="modal-footer">
          {buttons.map(e => (
            <Button
              key={Math.random.toString()}
              type="button"
              className="modal-footer-buttons"
              {...e}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  header: PropTypes.string,
  buttons: PropTypes.array,
  className: PropTypes.string,
  headerIcon: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  children: PropTypes.element,
};

Modal.defaultProps = {
  header: '',
  buttons: [],
  headerIcon: '',
  className: 'modal-content ',
  headerClassName: 'modal-header ',
  bodyClassName: 'modal-body ',
  children: null,
};

export default Modal;

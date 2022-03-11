import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const Modal = props => {
  const {
    header,
    headerIcon,
    buttons,
    children,
    headerClassName,
    bodyClassName,
    className,
    hideModal,
    closeIcon,
    closeClassName,
    ...restProps
  } = props;
  const dialogContentClass = `modal-content ${className}`;
  const dialogHeaderClass = `modal-header ${headerClassName}`;
  const dialogBodyClass = `modal-body ${bodyClassName}`;
  const closeClass = `material-icons-round cursor-pointer ${closeClassName}`;

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => hideModal(false));

  return (
    <div className="modal">
      <div className={dialogContentClass} ref={modalRef} {...restProps}>
        <div className={dialogHeaderClass}>
          <div className={`d-flex align-center ${closeIcon ? 'just-bet' : 'just-center'}`}>
            <div>
              {headerIcon && (
                <div className="d-flex just-center align-center">
                  <span className="material-icons-round mr-5">{headerIcon}</span>
                  {header}
                </div>
              )}
              {!headerIcon && header}
            </div>
            {closeIcon && (
              <span title="Close modal" className={closeClass} onClick={() => hideModal(false)}>
                {closeIcon}
              </span>
            )}
          </div>
        </div>
        <div className={dialogBodyClass}>{children}</div>
        <div className="modal-footer">
          {buttons.map(e => (
            <Button key={e?.title} type="button" className="modal-footer-buttons" {...e} />
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
  hideModal: PropTypes.func,
  closeIcon: PropTypes.string,
  closeClassName: PropTypes.string,
  children: PropTypes.node,
};

Modal.defaultProps = {
  header: '',
  buttons: [],
  headerIcon: '',
  className: '',
  headerClassName: '',
  bodyClassName: '',
  closeIcon: '',
  closeClassName: '',
  children: null,
  hideModal: () => {},
};

export default Modal;

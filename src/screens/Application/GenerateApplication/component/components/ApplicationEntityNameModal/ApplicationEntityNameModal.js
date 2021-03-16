import React, { useRef } from 'react';
import './ApplicationEntityNameModal.scss';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../../../../../hooks/UserClickOutsideHook';

const ApplicationEntityNameModal = props => {
  const {
    header,
    headerIcon,
    buttons,
    children,
    headerClassName,
    bodyClassName,
    className,
    hideModal,
    ...restProps
  } = props;
  const dialogContentClass = `modal-content ${className}`;
  const dialogBodyClass = `modal-body application-entity-name-modal-body ${bodyClassName}`;

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => hideModal(false));

  return (
    <div className="modal">
      <div className={dialogContentClass} ref={modalRef} {...restProps}>
        <div className={dialogBodyClass}>{children}</div>
      </div>
    </div>
  );
};

ApplicationEntityNameModal.propTypes = {
  header: PropTypes.string,
  buttons: PropTypes.array,
  className: PropTypes.string,
  headerIcon: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  hideModal: PropTypes.func,
  children: PropTypes.element,
};

ApplicationEntityNameModal.defaultProps = {
  header: '',
  buttons: [],
  headerIcon: '',
  className: 'modal-content ',
  headerClassName: 'modal-header ',
  bodyClassName: 'modal-body ',
  children: null,
  hideModal: () => {},
};

export default ApplicationEntityNameModal;

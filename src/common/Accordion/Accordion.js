import React from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';

const Accordion = props => {
  const { children, className } = props;
  const accordion = `accordion-container ${className}`;

  return <div className={accordion}>{children}</div>;
};

Accordion.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

Accordion.defaultProps = {
  className: '',
  children: null,
};

export default Accordion;

import React from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';

export const AccordionContext = React.createContext();

const Accordion = props => {
  const { children, className } = props;
  const [openIndex, setIndex] = React.useState(-1);
  const accordion = `accordion-container ${className}`;

  return (
    <div className={accordion}>
      <AccordionContext.Provider
        value={{
          openIndex,
          setIndex,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
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

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';
import Button from '../Button/Button';

const AccordionItem = props => {
  const {
    className,
    headerClass,
    prefix,
    prefixClass,
    suffix,
    suffixClass,
    header,
    count,
    accordionBodyClass,
    children,
  } = props;
  const accordionClass = `accordion-item ${className}`;
  const headerClassName = `accordion-item-header-container ${headerClass}`;
  const prefixClassName = `material-icons-round ${prefixClass}`;
  const suffixClassName = `material-icons-round ${suffixClass}`;
  const accordionBodyClassName = `accordion-body-container ${accordionBodyClass}`;
  const [activeAccordion, setActiveAccordion] = useState(false);

  const content = useRef(null);

  const onClickAccordionItem = () => {
    setActiveAccordion(e => !e);
  };
  return (
    <div className={accordionClass}>
      <div className={headerClassName} onClick={onClickAccordionItem}>
        {prefix && (
          <span
            className={`${prefixClassName} ${
              activeAccordion && prefix === 'expand_more' && 'rotate-icon'
            }`}
          >
            {prefix}
          </span>
        )}
        <label>{header}</label>
        {count && <Button buttonType="primary" title={count} />}
        {suffix && <span className={suffixClassName}>{suffix}</span>}
      </div>
      <div
        ref={content}
        style={{
          height: activeAccordion ? content.current.scrollheight : '0px',
          padding: activeAccordion ? '10px 40px' : '0',
          transition: 'height .5s ease-in-out',
        }}
        className={accordionBodyClassName}
      >
        {children}
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  className: PropTypes.string,
  headerClass: PropTypes.string,
  header: PropTypes.array.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  count: PropTypes.number,
  prefixClass: PropTypes.string,
  suffixClass: PropTypes.string,
  accordionBodyClass: PropTypes.string,
  children: PropTypes.element,
};

AccordionItem.defaultProps = {
  className: '',
  headerClass: '',
  prefix: '',
  suffix: '',
  count: '',
  prefixClass: '',
  suffixClass: '',
  accordionBodyClass: '',
  children: null,
};

export default AccordionItem;

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AccordionContext } from './Accordion';

const AccordionItem = props => {
  const {
    index,
    className,
    headerClass,
    prefix,
    prefixClass,
    suffix,
    isExpanded,
    suffixClass,
    suffixClick,
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

  const content = useRef(null);
  const { openIndex, setIndex } = React.useContext(AccordionContext);
  const activeAccordion = React.useMemo(() => openIndex === index, [openIndex, index]);
  const onClickAccordionItem = React.useCallback(
    () => setIndex(!activeAccordion ? index : -1),
    [activeAccordion, setIndex]
  );
  useEffect(() => {
    setIndex(isExpanded ? 0 : -1);
  }, []);
  return (
    <div className={accordionClass}>
      <div className={headerClassName} onClick={onClickAccordionItem}>
        <div className="d-flex align-center">
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
          {count && <span className="accordion-item-count">{count}</span>}
        </div>
        {suffix && (
          <span
            className={`${suffixClassName} ${
              activeAccordion && suffix === 'expand_more' && 'rotate-icon'
            }`}
            onClick={suffixClick}
          >
            {suffix}
          </span>
        )}
      </div>
      <div
        ref={content}
        className={`${accordionBodyClassName} ${activeAccordion && 'active-accordion'}`}
      >
        {children !== null ? children : <div className="no-record-found">No record found</div>}
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  index: PropTypes.number.isRequired,
  className: PropTypes.string,
  headerClass: PropTypes.string,
  header: PropTypes.array.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  isExpanded: PropTypes.bool,
  count: PropTypes.number,
  prefixClass: PropTypes.string,
  suffixClass: PropTypes.string,
  suffixClick: PropTypes.func,
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
  isExpanded: false,
  accordionBodyClass: '',
  children: null,
  suffixClick: () => {},
};

export default AccordionItem;

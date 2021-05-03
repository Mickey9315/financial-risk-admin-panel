import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationReportAccordion = props => {
  const { index } = props;
  return (
    <AccordionItem index={index} header="Reports" suffix="expand_more">
      <div className="common-accordion-item-content-box">
        <div className="report-row">
          <span className="title">Title:</span>
          <Tooltip
            overlayClassName="tooltip-left-class"
            overlay={'Lorem ipsum dolor sit amet, consetetur' || 'No report title added'}
            placement="left"
          >
            <span className="details">Lorem ipsum dolor sit amet, consetetur</span>
          </Tooltip>
          <span className="title">Date:</span>
          <span className="details">15-Dec-2020</span>
          <span className="title">Link:</span>
          <a className="details" href="http://www.google.com" target="_blank" rel="noreferrer">
            Lorem ipsum
          </a>
        </div>
      </div>
    </AccordionItem>
  );
};
export default ApplicationReportAccordion;

ApplicationReportAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};

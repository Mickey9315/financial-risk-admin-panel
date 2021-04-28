import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationAlertsAccordion = props => {
  const { index } = props;
  return (
    <AccordionItem index={index} header="Alerts" count="04" suffix="expand_more">
      <div className="common-accordion-item-content-box alert">
        <div className="alert-title-row">
          <div className="alert-title">Title of Note</div>
          <span className="material-icons-round font-placeholder">more_vert</span>
        </div>
        <div className="date-owner-row">
          <span className="title mr-5">Date:</span>
          <span className="details">15-Dec-2020</span>

          <span className="title">Owner:</span>
          <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
        </div>
        <div className="font-field">Description:</div>
        <div className="font-primary">
          Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor invidunt ut
          labore et.
        </div>
      </div>
      <div className="common-accordion-item-content-box high-alert">
        <div className="note-title-row">
          <div className="note-title">Title of Note</div>
          <span className="material-icons-round font-placeholder">more_vert</span>
        </div>
        <div className="date-owner-row">
          <span className="title mr-5">Date:</span>
          <span className="details">15-Dec-2020</span>

          <span className="title">Owner:</span>
          <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
        </div>
        <div className="font-field">Description:</div>
        <div className="font-primary">
          Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor invidunt ut
          labore et.
        </div>
      </div>
    </AccordionItem>
  );
};
export default ApplicationAlertsAccordion;

ApplicationAlertsAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};

import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { useSelector } from 'react-redux';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationAlertsAccordion = props => {
  const alertsList = useSelector(
    ({ application }) => application?.viewApplication?.alerts?.alertsList || []
  );

  const { index } = props;
  return (
    <>
      <AccordionItem
        index={index}
        header="Alerts"
        count={alertsList?.length < 10 ? `0${alertsList?.length}` : alertsList?.length}
        suffix="expand_more"
      >
        {alertsList?.length > 0 ? (
          alertsList?.map(alert => (
            <div className="common-accordion-item-content-box alert">
              <div className="alert-title-row">
                <Tooltip
                  overlayClassName="tooltip-left-class"
                  overlay={<span>Title of Alert</span>}
                  placement="left"
                >
                  <div className="alert-title">{alert?.title}</div>
                </Tooltip>

                <span className="material-icons-round font-placeholder">more_vert</span>
              </div>
              <div className="date-owner-row">
                <span className="title mr-5">Date:</span>
                <span className="details">15-Dec-2020</span>

                <span className="title">Owner:</span>
                <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
              </div>
              <div className="font-field">Alert Description:</div>
              <div className="view-application-accordion-description">
                Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                invidunt ut labore et.
              </div>
            </div>
          ))
        ) : (
          <div className="no-record-found">Nothing To Show</div>
        )}
      </AccordionItem>
    </>
  );
};
export default ApplicationAlertsAccordion;

ApplicationAlertsAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};

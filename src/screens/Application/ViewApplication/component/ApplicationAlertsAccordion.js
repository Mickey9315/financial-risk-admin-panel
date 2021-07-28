import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { useSelector } from 'react-redux';
import moment from 'moment';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import { ALERT_TYPE_ROW, ALERT_TYPE_ROW_ICON } from '../../../../constants/AlertConstants';

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
            <div
              className="common-accordion-item-content-box"
              style={{ backgroundColor: `${ALERT_TYPE_ROW[alert?.alertPriority]}` }}
            >
              <div className="alert-title-row">
                <Tooltip
                  overlayClassName="tooltip-left-class"
                  overlay={<span>Alert Priority</span>}
                  placement="left"
                >
                  <div className={`f-12 f-bold ${ALERT_TYPE_ROW_ICON[alert?.alertPriority]}`}>
                    {alert?.alertPriority}
                  </div>
                </Tooltip>
              </div>
              <div className="date-owner-row">
                <span className="title mr-5">Date:</span>
                <span className="details">{moment(alert?.createdAt).format('DD-MM-YYYY')}</span>
                <span className="title mr-5">Type:</span>
                <div className="details">{alert?.alertType}</div>
              </div>
              <div className="font-field">Alert Category:</div>
              <div className="view-application-accordion-description">{alert?.alertCategory}</div>
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

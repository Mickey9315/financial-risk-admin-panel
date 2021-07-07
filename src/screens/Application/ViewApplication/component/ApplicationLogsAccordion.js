import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationLogsAccordion = props => {
  const applicationLogsList = useSelector(
    ({ application }) => application?.viewApplication?.applicationModulesList?.logs || []
  );

  const { index } = props;

  return (
    <>
      {applicationLogsList !== undefined && (
        <AccordionItem
          index={index}
          header="Logs"
          count={
            applicationLogsList?.length < 10
              ? `0${applicationLogsList?.length}`
              : applicationLogsList?.length
          }
          suffix="expand_more"
        >
          {applicationLogsList &&
            applicationLogsList.map(log => (
              <div className="common-accordion-item-content-box" key={log._id}>
                <div className="date-time-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(log.createdAt).format('MMMM Do YYYY')}</span>

                  <span className="title">Time:</span>
                  <span className="details">{moment(log.createdAt).format('h:mm:ss a')}</span>
                </div>
                <div className="d-flex">
                  <div className="font-field">Description:</div>
                  <div className="font-primary ml-10">{log.logDescription || '-'}</div>
                </div>
              </div>
            ))}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationLogsAccordion);

ApplicationLogsAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};

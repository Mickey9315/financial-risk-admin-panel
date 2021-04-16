import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import moment from 'moment';
import PropTypes from 'prop-types';
// import AccordionItem from '../../../../common/Accordion/AccordionItem';
import moment from 'moment';
import { getApplicationModuleList } from '../../redux/ApplicationAction';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationDocumentsAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId } = props;

  const applicationDocsList = useSelector(
    ({ application }) => application?.viewApplication?.applicationModulesList?.documents || []
  );

  useEffect(() => {
    dispatch(getApplicationModuleList(applicationId));
  }, []);

  return (
    <>
      {applicationDocsList !== undefined && (
        <AccordionItem header="Documents" suffix="expand_more">
          {applicationDocsList &&
            applicationDocsList.map(doc => (
              <div className="common-accordion-item-content-box">
                <div className="document-title-row">
                  <div className="document-title">{doc.documentTypeId || '-'}</div>
                  <span className="material-icons-round font-placeholder">more_vert</span>
                </div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(doc.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <span className="details">{doc.uploadById || '-'}</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">{doc.description || '-'}</div>
              </div>
            ))}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationDocumentsAccordion);

ApplicationDocumentsAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import { getApplicationNotesList } from '../../redux/ApplicationAction';

const ApplicationNotesAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId } = props;

  const applicationNoteList = useSelector(
    ({ application }) => application?.viewApplication?.notes?.noteList?.docs || []
  );

  useEffect(() => {
    dispatch(getApplicationNotesList(applicationId));
  }, []);

  return (
    <>
      {applicationNoteList !== undefined && (
        <AccordionItem header="Note" suffix="expand_more">
          <Button buttonType="primary-1" title="Add Note" className="add-note-button" />
          {applicationNoteList &&
            applicationNoteList.map(note => (
              <div className="common-accordion-item-content-box" key={note._id}>
                {/* <div className="alert-title-row"> */}
                {/*  <div className="alert-title">{note.title || '-'}</div> */}
                {/*  <span className="material-icons-round font-placeholder">more_vert</span> */}
                {/* </div> */}
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(note.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <span className="details">{note.createdById || '-'}</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">{note.description || '-'}</div>
              </div>
            ))}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationNotesAccordion);

ApplicationNotesAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

/* import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';

const ApplicationNotesAccordion = () => {
  return (
    <AccordionItem header="Note" suffix="expand_more">
      <Button buttonType="primary-1" title="Add Note" className="add-note-button" />
      <div className="common-accordion-item-content-box">
        <div className="alert-title-row">
          <div className="alert-title">Title of Note</div>
          <span className="material-icons-round font-placeholder">more_vert</span>
        </div>
        <div className="date-owner-row">
          <span className="title mr-5">Date:</span>
          <span className="details">15-Dec-2020</span>

          <span className="title">Owner:</span>
          <span className="details">Lorem Ipsum</span>
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

export default ApplicationNotesAccordion;
*/

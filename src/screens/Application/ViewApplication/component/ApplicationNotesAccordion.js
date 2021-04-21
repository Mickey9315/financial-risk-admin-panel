import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Button from '../../../../common/Button/Button';
import {
  addApplicationNoteAction,
  deleteApplicationNoteAction,
  getApplicationNotesList,
  updateApplicationNoteAction,
} from '../../redux/ApplicationAction';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import Switch from '../../../../common/Switch/Switch';
import DropdownMenu from '../../../../common/DropdownMenu/DropdownMenu';

const NOTE_ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const initialApplicationNoteState = {
  noteId: null,
  description: '',
  isPublic: false,
  type: NOTE_ACTIONS.ADD,
};

const APPLICATION_NOTE_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function applicationNoteReducer(state, action) {
  switch (action.type) {
    case APPLICATION_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case APPLICATION_NOTE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case APPLICATION_NOTE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialApplicationNoteState };
    default:
      return state;
  }
}

const ApplicationNotesAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId } = props;

  const [currentNoteId, setCurrentNoteId] = useState('');
  const [editNoteDetails, setEditNoteDetails] = useState([]);

  console.log(currentNoteId);

  const applicationNoteList = useSelector(
    ({ application }) => application?.viewApplication?.notes?.noteList?.docs || []
  );

  // add task
  const [modifyNoteModal, setModifyNoteModal] = useState(false);

  const toggleModifyNotes = useCallback(
    value => setModifyNoteModal(value !== undefined ? value : e => !e),
    [setModifyNoteModal]
  );

  const [selectedApplicationNote, dispatchSelectedApplicationNote] = useReducer(
    applicationNoteReducer,
    initialApplicationNoteState
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const onClickActionToggleButton = useCallback(
    (e, note) => {
      e.persist();
      e.stopPropagation();
      const menuTop = e.clientY + 10;
      const menuLeft = e.clientX - 90;
      setShowActionMenu(prev => !prev);
      setMenuPosition({ top: menuTop, left: menuLeft });
      setCurrentNoteId(note._id);
      setEditNoteDetails(note);
    },
    [setShowActionMenu, setMenuPosition]
  );

  const callBack = useCallback(() => {
    dispatch(getApplicationNotesList(applicationId));
    toggleConfirmationModal();
  }, [applicationId, toggleConfirmationModal]);

  const onCloseNotePopup = useCallback(() => {
    dispatchSelectedApplicationNote({
      type: APPLICATION_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [toggleModifyNotes, dispatchSelectedApplicationNote]);

  const onChangeSelectedNoteInput = useCallback(
    e => {
      dispatchSelectedApplicationNote({
        type: APPLICATION_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.value,
      });
    },
    [dispatchSelectedApplicationNote]
  );

  const onChangeSelectedNoteSwitch = useCallback(
    e => {
      dispatchSelectedApplicationNote({
        type: APPLICATION_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
        name: e.target.name,
        value: e.target.checked,
      });
    },
    [dispatchSelectedApplicationNote]
  );

  const addOrUpdateNote = useCallback(async () => {
    const noteData = {
      description: selectedApplicationNote.description,
      isPublic: selectedApplicationNote.isPublic,
    };
    if (selectedApplicationNote.type === NOTE_ACTIONS.ADD) {
      await dispatch(addApplicationNoteAction(applicationId, noteData));
    } else {
      noteData.noteId = selectedApplicationNote.noteId;
      await dispatch(updateApplicationNoteAction(applicationId, noteData));
    }
    dispatchSelectedApplicationNote({
      type: APPLICATION_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [selectedApplicationNote, toggleModifyNotes]);

  const onEditNoteClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    const { _id, description, isPublic } = editNoteDetails;
    const data = {
      noteId: _id,
      description,
      isPublic,
      type: NOTE_ACTIONS.EDIT,
    };
    dispatchSelectedApplicationNote({
      type: APPLICATION_NOTE_REDUCER_ACTIONS.UPDATE_DATA,
      data,
    });
    toggleModifyNotes();
  }, [
    setShowActionMenu,
    showActionMenu,
    editNoteDetails,
    dispatchSelectedApplicationNote,
    toggleModifyNotes,
  ]);

  const onDeleteNoteClick = useCallback(() => {
    setShowActionMenu(!showActionMenu);
    toggleConfirmationModal();
  }, [toggleConfirmationModal, setShowActionMenu, showActionMenu]);

  const noteCRUDButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseNotePopup() },
      {
        title: `${selectedApplicationNote.type === 'EDIT' ? 'Edit' : 'Add'} `,
        buttonType: 'primary',
        onClick: addOrUpdateNote,
      },
    ],
    [onCloseNotePopup, addOrUpdateNote, selectedApplicationNote]
  );
  const deleteNoteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: () => dispatch(deleteApplicationNoteAction(currentNoteId, () => callBack())),
      },
    ],
    [toggleConfirmationModal, currentNoteId, callBack]
  );

  useEffect(() => {
    dispatch(getApplicationNotesList(applicationId));
  }, []);

  return (
    <>
      {applicationNoteList !== undefined && (
        <AccordionItem
          header="Note"
          count={
            applicationNoteList?.length < 10
              ? `0${applicationNoteList?.length}`
              : applicationNoteList?.length
          }
          suffix="expand_more"
        >
          <Button
            buttonType="primary-1"
            title="Add Note"
            className="add-note-button"
            onClick={toggleModifyNotes}
          />
          {applicationNoteList?.length > 0 ? (
            applicationNoteList.map(note => (
              <div className="common-accordion-item-content-box" key={note._id}>
                <div className="alert-title-row">
                  <div className="alert-title">{note.title || ''}</div>
                  <span
                    className="material-icons-round font-placeholder just-end"
                    onClick={e => onClickActionToggleButton(e, note)}
                  >
                    more_vert
                  </span>
                </div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(note.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <span className="details">{note.createdById || '-'}</span>
                </div>
                <div className="font-field">Description:</div>
                <div className="font-primary">{note.description || '-'}</div>
              </div>
            ))
          ) : (
            <div className="no-data-available">Nothing To Show</div>
          )}
        </AccordionItem>
      )}
      {modifyNoteModal && (
        <Modal
          header={`${selectedApplicationNote.type === 'EDIT' ? 'Edit Note' : 'Add Note'} `}
          className="add-to-crm-modal"
          buttons={noteCRUDButtons}
          // hideModal={toggleModifyNotes}
        >
          <div className="add-notes-popup-container">
            <span>Description</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Note description"
              name="description"
              type="text"
              value={selectedApplicationNote.description}
              onChange={onChangeSelectedNoteInput}
            />
            <span>Private/Public</span>
            <Switch
              id="selected-note"
              name="isPublic"
              checked={selectedApplicationNote.isPublic}
              onChange={onChangeSelectedNoteSwitch}
            />
          </div>
        </Modal>
      )}
      {showActionMenu && (
        <DropdownMenu style={menuPosition} toggleMenu={setShowActionMenu}>
          <div className="menu-name" onClick={onEditNoteClick}>
            <span className="material-icons-round">edit</span> Edit
          </div>
          <div className="menu-name" onClick={onDeleteNoteClick}>
            <span className="material-icons-round">delete_outline</span> Delete
          </div>
        </DropdownMenu>
      )}
      {showConfirmModal && (
        <Modal header="Delete Note" buttons={deleteNoteButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this Note?</span>
        </Modal>
      )}
    </>
  );
};

export default React.memo(ApplicationNotesAccordion);

ApplicationNotesAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
};
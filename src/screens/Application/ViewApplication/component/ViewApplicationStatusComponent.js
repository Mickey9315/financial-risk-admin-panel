import ReactSelect from 'react-select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Button from '../../../../common/Button/Button';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import Switch from '../../../../common/Switch/Switch';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';
import { errorNotification } from '../../../../common/Toast';
import { NUMBER_REGEX } from '../../../../constants/RegexConstants';
import { changeApplicationStatus, getApplicationNotesList } from '../../redux/ApplicationAction';

const ViewApplicationStatusComponent = props => {
  const { isApprovedOrDeclined } = props;
  console.log(isApprovedOrDeclined);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { creditLimit, isAllowToUpdate, status, _id } = useMemo(() => applicationDetail ?? {}, [
    applicationDetail,
  ]);
  const [declinedNoteData, setDeclinedNoteData] = useState({ description: '', isPublic: false });
  const [showConfirmModal, setShowConfirmationModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState({});
  const toggleConfirmationModal = useCallback(() => {
    setShowConfirmationModal(!showConfirmModal);
  }, [showConfirmModal]);

  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const [isLimitNote, setIsLimitNote] = useState(false);
  const [approveNoteData, setApproveNoteData] = useState({ description: '', isPublic: false });
  const toggleModifyLimitModal = useCallback(() => {
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal]);

  const onChangeCreditLimit = useCallback(
    e => {
      const val = e?.target?.value?.toString()?.replaceAll(',', '');
      setNewCreditLimit(val);
      if (val < creditLimit) {
        setIsLimitNote(true);
      } else {
        setIsLimitNote(false);
      }
    },
    [creditLimit]
  );

  const modifyLimit = useCallback(async () => {
    if (newCreditLimit?.toString()?.trim().length <= 0) {
      errorNotification('Please provide credit limit');
    } else if (newCreditLimit && !newCreditLimit?.toString()?.trim()?.match(NUMBER_REGEX)) {
      errorNotification('Please provide valid credit limit');
    } else if (newCreditLimit > creditLimit) {
      errorNotification("Can't approve more credit limit than requested");
    } else {
      try {
        if (!isLimitNote) {
          const data = {
            creditLimit: newCreditLimit?.toString()?.trim(),
            status: statusToChange?.value,
          };
          await dispatch(changeApplicationStatus(id, data, statusToChange));
          toggleModifyLimitModal();
        } else if (isLimitNote) {
          if (approveNoteData?.description?.trim()?.length > 0) {
            const data = {
              creditLimit: newCreditLimit?.toString()?.trim(),
              description: approveNoteData?.description,
              isPublic: approveNoteData?.isPublic,
              status: statusToChange?.value,
            };
            await dispatch(changeApplicationStatus(id, data, statusToChange));
            dispatch(getApplicationNotesList(id));
            toggleModifyLimitModal();
          } else {
            errorNotification('Please Enter Description');
          }
        }
      } catch (e) {
        /**/
      }
    }
  }, [
    newCreditLimit,
    toggleModifyLimitModal,
    statusToChange,
    id,
    creditLimit,
    approveNoteData,
    isLimitNote,
  ]);

  const modifyLimitButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleModifyLimitModal();
          setNewCreditLimit(creditLimit);
          setApproveNoteData({ description: '', isPublic: false });
          setIsLimitNote(false);
        },
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: modifyLimit,
      },
    ],
    [toggleModifyLimitModal, modifyLimit, creditLimit]
  );

  const handleApplicationStatusChange = useCallback(
    async e => {
      if (['CANCELLED', 'SURRENDERED', 'WITHDRAWN'].includes(e?.value)) {
        setStatusToChange(e);
        toggleConfirmationModal();
      } else {
        try {
          await dispatch(changeApplicationStatus(_id, { status: e?.value }, e));
        } catch (err) {
          /**/
        }
      }
    },
    [toggleConfirmationModal, _id, setStatusToChange, statusToChange]
  );

  const handleDeclinedStatusWithNote = useCallback(async () => {
    try {
      if (declinedNoteData?.description?.trim()?.length > 0) {
        const data = {
          description: declinedNoteData?.description,
          isPublic: declinedNoteData?.isPublic,
          status: statusToChange?.value,
        };
        await dispatch(changeApplicationStatus(id, data, statusToChange));
        dispatch(getApplicationNotesList(id));
        toggleConfirmationModal();
      } else {
        errorNotification('Please Enter Description');
      }
    } catch (e) {
      /**/
    }
  }, [declinedNoteData, statusToChange?.value, id, toggleConfirmationModal]);

  const changeStatusButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Save',
        buttonType: 'danger',
        onClick: async () => {
          try {
            if (statusToChange?.value !== 'DECLINED') {
              await dispatch(
                changeApplicationStatus(_id, { status: statusToChange?.value }, statusToChange)
              );
              toggleConfirmationModal();
            } else {
              await handleDeclinedStatusWithNote();
            }
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, statusToChange, _id, handleDeclinedStatusWithNote]
  );

  useEffect(() => {
    setNewCreditLimit(creditLimit);
  }, [creditLimit]);

  const rightSideStatusButtons = useMemo(() => {
    if (!['DECLINED', 'APPROVED'].includes(status?.value)) {
      return (
        <div className="right-side-status">
          <Button
            buttonType="success"
            className="small-button"
            title="Approve"
            onClick={() => {
              setStatusToChange({ label: 'Approved', value: 'APPROVED' });
              toggleModifyLimitModal();
            }}
          />
          <Button
            buttonType="danger"
            className="small-button"
            title="Decline"
            onClick={() => {
              setStatusToChange({ label: 'Declined', value: 'DECLINED' });
              toggleConfirmationModal();
            }}
          />
        </div>
      );
    }

    return <></>;
  }, [status, toggleModifyLimitModal, setStatusToChange, toggleConfirmationModal]);

  return (
    <div className="application-status-grid">
      <div>
        <div className="view-application-status">
          {isApprovedOrDeclined ? (
            <div>
              {['APPROVED'].includes(status?.value) && (
                <div className="application-status approved-application-status">
                  {status?.label}
                </div>
              )}
              {['DECLINED'].includes(status?.value) && (
                <div className="application-status declined-application-status">
                  {status?.label}
                </div>
              )}
            </div>
          ) : (
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Status"
              name="applicationStatus"
              value={!isApprovedOrDeclined ? status : []}
              options={applicationDetail?.applicationStatus}
              isDisabled={!isAllowToUpdate || isApprovedOrDeclined}
              onChange={handleApplicationStatusChange}
            />
          )}

          {!isAllowToUpdate && !isApprovedOrDeclined && (
            <div className="ui-state-error">
              You don&apos;t have access to approve application, please contact admin that.
            </div>
          )}
        </div>
      </div>
      {isAllowToUpdate && rightSideStatusButtons}
      {showConfirmModal && (
        <Modal
          className="add-to-crm-modal"
          header="Application Status"
          buttons={changeStatusButton}
          hideModal={toggleConfirmationModal}
        >
          {statusToChange?.value !== 'DECLINED' ? (
            <span className="confirmation-message">
              Are you sure you want to {statusToChange?.label} this application? Dont forget to put
              add a Note.
            </span>
          ) : (
            <>
              <div className="font-field mb-30">
                Are you sure you want to decline this application?
              </div>
              <div className="add-notes-popup-container">
                <span>Description</span>
                <Input
                  prefixClass="font-placeholder"
                  placeholder="Note description"
                  name="description"
                  type="text"
                  value={declinedNoteData?.description}
                  onChange={e => {
                    setDeclinedNoteData({
                      ...declinedNoteData,
                      description: e?.target?.value,
                    });
                  }}
                />
                <span>Private/Public</span>
                <Switch
                  id="selected-note"
                  name="isPublic"
                  checked={declinedNoteData.isPublic}
                  onChange={e => {
                    setDeclinedNoteData({
                      ...declinedNoteData,
                      isPublic: e.target.checked,
                    });
                  }}
                />
              </div>
            </>
          )}
        </Modal>
      )}
      {modifyLimitModal && (
        <Modal
          className="add-to-crm-modal"
          header="Approve Application"
          buttons={modifyLimitButtons}
          hideModal={toggleModifyLimitModal}
        >
          <div className="modify-credit-limit-container align-center">
            <span>Credit Limit</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="New Credit Limit"
              name="creditLimit"
              type="text"
              value={newCreditLimit ? NumberCommaSeparator(newCreditLimit) : ''}
              onChange={onChangeCreditLimit}
            />
          </div>
          {isLimitNote && (
            <div className="add-notes-popup-container mt-15">
              <span>Description</span>
              <Input
                prefixClass="font-placeholder"
                placeholder="Note description"
                name="description"
                type="text"
                value={approveNoteData?.description}
                onChange={e => {
                  setApproveNoteData({
                    ...approveNoteData,
                    description: e?.target?.value,
                  });
                }}
              />
              <span>Private/Public</span>
              <Switch
                id="selected-note"
                name="isPublic"
                checked={approveNoteData.isPublic}
                onChange={e => {
                  setApproveNoteData({
                    ...approveNoteData,
                    isPublic: e.target.checked,
                  });
                }}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

ViewApplicationStatusComponent.propTypes = {
  isApprovedOrDeclined: PropTypes.string.isRequired,
};

export default ViewApplicationStatusComponent;

import ReactSelect from 'react-select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Button from '../../../../common/Button/Button';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';
import { errorNotification } from '../../../../common/Toast';
import { NUMBER_REGEX } from '../../../../constants/RegexConstants';
import { changeApplicationStatus } from '../../redux/ApplicationAction';

const APPLICATION_STATUS = {
  WITHDRAWN: 'Withdraw',
  CANCELLED: 'Cancel',
  APPROVED: 'Approve',
  DECLINED: 'Decline',
};

const ViewApplicationStatusComponent = props => {
  const { isApprovedOrDeclined } = props;
  const { id } = useParams();
  const dispatch = useDispatch();

  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { creditLimit, isAllowToUpdate, status, _id, comments } = useMemo(
    () => applicationDetail ?? {},
    [applicationDetail]
  );

  const [showConfirmModal, setShowConfirmationModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState({});
  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  const toggleConfirmationModal = useCallback(() => {
    setShowConfirmationModal(!showConfirmModal);
  }, [showConfirmModal]);

  const toggleModifyLimitModal = useCallback(() => {
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal]);

  const onChangeCreditLimit = useCallback(e => {
    const val = e?.target?.value?.toString()?.replaceAll(',', '');
    setNewCreditLimit(val);
  }, []);

  const statusChangeCallback = useCallback(() => {
    if (statusToChange?.value === 'APPROVED') {
      toggleModifyLimitModal();
      setNewCreditLimit('');
    } else {
      toggleConfirmationModal();
    }
    setStatusToChange({});
    setCommentText('');
  }, [statusToChange]);

  const modifyLimit = useCallback(async () => {
    if (statusToChange?.value === 'APPROVED' && newCreditLimit?.toString()?.trim().length <= 0) {
      errorNotification('Please provide credit limit');
    } else if (
      statusToChange?.value === 'APPROVED' &&
      newCreditLimit &&
      !newCreditLimit?.toString()?.trim()?.match(NUMBER_REGEX)
    ) {
      errorNotification('Please provide valid credit limit');
    } else if (statusToChange?.value === 'APPROVED' && newCreditLimit > creditLimit) {
      errorNotification("Can't approve more credit limit than requested");
    } else if (
      statusToChange?.value === 'APPROVED' &&
      (!commentText || commentText?.toString()?.trim()?.length <= 0) &&
      newCreditLimit < creditLimit
    ) {
      errorNotification('Please enter comment to continue!');
    } else if (
      statusToChange?.value === 'DECLINED' &&
      (!commentText || commentText?.toString()?.trim()?.length <= 0)
    ) {
      errorNotification('Please enter comment to continue!');
    } else {
      try {
        const data = {
          update: 'credit-limit',
          status: statusToChange?.value,
          comments: commentText,
        };
        if (statusToChange?.value === 'APPROVED')
          data.creditLimit = newCreditLimit?.toString()?.trim();
        await dispatch(changeApplicationStatus(id, data, statusToChange));
        statusChangeCallback();
      } catch (e) {
        /**/
      }
    }
  }, [newCreditLimit, toggleModifyLimitModal, statusToChange, id, creditLimit, commentText]);

  const modifyLimitButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleModifyLimitModal();
          setNewCreditLimit(creditLimit);
        },
      },
      {
        title: 'Approve',
        buttonType: 'primary',
        onClick: modifyLimit,
      },
    ],
    [toggleModifyLimitModal, modifyLimit, creditLimit]
  );

  const handleStatusChange = useCallback(async () => {
    try {
      await dispatch(
        changeApplicationStatus(
          _id,
          { update: 'credit-limit', status: statusToChange?.value },
          statusToChange
        )
      );
      toggleConfirmationModal();
      setStatusToChange([]);
    } catch (err) {
      /**/
    }
  }, [statusToChange]);

  const handleApplicationStatusChange = useCallback(
    async e => {
      if (['CANCELLED', 'WITHDRAWN'].includes(e?.value)) {
        setStatusToChange(e);
        toggleConfirmationModal();
      } else {
        try {
          await dispatch(
            changeApplicationStatus(_id, { update: 'credit-limit', status: e?.value }, e)
          );
        } catch (err) {
          /**/
        }
      }
    },
    [toggleConfirmationModal, _id, setStatusToChange, statusToChange]
  );
  const changeStatusButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: APPLICATION_STATUS[statusToChange?.value],
        buttonType: 'danger',
        onClick: ['DECLINED', 'APPROVED'].includes(statusToChange?.value)
          ? modifyLimit
          : handleStatusChange,
      },
    ],
    [toggleConfirmationModal, statusToChange, _id, modifyLimit]
  );

  useEffect(() => {
    setNewCreditLimit(creditLimit);
    setCommentText(comments);
  }, [creditLimit, comments]);

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
              placeholder={isAllowToUpdate ? 'Select Status' : '-'}
              name="applicationStatus"
              value={!isApprovedOrDeclined ? status : []}
              options={applicationDetail?.applicationStatus}
              isDisabled={!isAllowToUpdate || isApprovedOrDeclined}
              onChange={handleApplicationStatusChange}
            />
          )}

          {!isAllowToUpdate && !isApprovedOrDeclined && (
            <div className="ui-state-error">
              You don&apos;t have access to approve application, please contact admin for that.
            </div>
          )}
        </div>
      </div>
      {isAllowToUpdate && rightSideStatusButtons}
      {showConfirmModal && (
        <Modal
          className="add-to-crm-modal"
          header={`${APPLICATION_STATUS[statusToChange?.value]} Application`}
          buttons={changeStatusButton}
          hideModal={toggleConfirmationModal}
        >
          <>
            <div className="f-16 font-field mb-30">
              {`Are you sure you want to ${APPLICATION_STATUS[statusToChange?.value]
                .toString()
                .toLowerCase()} this application?`}
            </div>
            {statusToChange?.value === 'DECLINED' && (
              <div className="add-notes-popup-container">
                <span>Comment</span>
                <textarea
                  prefixClass="font-placeholder"
                  placeholder="Enter Comment"
                  name="comment"
                  type="text"
                  rows={5}
                  value={commentText}
                  onChange={e => setCommentText(e?.target?.value)}
                />
              </div>
            )}
          </>
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
            <span>Comment</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Enter Comment"
              name="comment"
              type="text"
              value={commentText}
              onChange={e => setCommentText(e?.target?.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

ViewApplicationStatusComponent.propTypes = {
  isApprovedOrDeclined: PropTypes.string.isRequired,
};

export default ViewApplicationStatusComponent;

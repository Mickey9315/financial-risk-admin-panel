import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../common/Button/Button';
import {
  changeOverdueAction,
  getOverdueDetailsById,
  saveOverdueList,
} from '../../redux/OverduesAction';
import Modal from '../../../../common/Modal/Modal';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';

const overdueActionButtons = [
  { status: 'MARK_AS_PAID', title: 'Mark as Paid' },
  { status: 'UNCHANGED', title: 'Unchanged' },
  { status: 'AMEND', title: 'Amend' },
];
const AddOverdueTable = props => {
  const dispatch = useDispatch();
  const { setIsAmendOverdueModal, toggleOverdueFormModal } = props;
  const { overdueListByDate } = useSelector(({ overdue }) => overdue ?? {});
  const { docs } = useMemo(() => overdueListByDate ?? [], [overdueListByDate]);

  const [showActionConfirmModal, setShowActionConfirmModal] = useState(false);
  const toggleActionConfirmModal = useCallback(
    value => setShowActionConfirmModal(value !== undefined ? value : e => !e),
    [setShowActionConfirmModal]
  );

  const { saveOverdueToBackEndPageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const [showSaveAlertModal, setShowSaveAlertModal] = useState(false);
  const toggleSaveAlertModal = useCallback(
    value => setShowSaveAlertModal(value !== undefined ? value : e => !e),
    [setShowSaveAlertModal]
  );

  const [actionToSet, setActionToSet] = useState({});

  const onClickMarkAsPaid = useCallback(
    async (id, currentAction) => {
      try {
        if (currentAction === 'AMEND') {
          setActionToSet({ id, action: 'MARK_AS_PAID' });
          toggleActionConfirmModal();
        } else await dispatch(changeOverdueAction(id, 'MARK_AS_PAID'));
      } catch (e) {
        /**/
      }
    },
    [setActionToSet, toggleActionConfirmModal]
  );
  const onClickAmend = useCallback(
    id => {
      try {
        dispatch(getOverdueDetailsById(id));
        setIsAmendOverdueModal(true);
        toggleOverdueFormModal();
      } catch (e) {
        /**/
      }
    },
    [toggleOverdueFormModal, setIsAmendOverdueModal]
  );
  const onClickUnChanged = useCallback(
    async (id, currentAction) => {
      try {
        if (currentAction === 'AMEND') {
          setActionToSet({ id, action: 'UNCHANGED' });
          toggleActionConfirmModal();
        } else await dispatch(changeOverdueAction(id, 'UNCHANGED'));
      } catch (e) {
        /**/
      }
    },
    [setActionToSet, toggleActionConfirmModal]
  );

  const onClickOverdueActionButtons = useCallback(
    async (id, button, currentAction) => {
      if (button?.status === 'MARK_AS_PAID') await onClickMarkAsPaid(id, currentAction);
      if (button?.status === 'AMEND') await onClickAmend(id);
      if (button?.status === 'UNCHANGED') await onClickUnChanged(id, currentAction);
    },
    [onClickMarkAsPaid, onClickAmend, onClickUnChanged]
  );

  const onCLickOverdueSave = useCallback(() => {
    let validated = true;
    docs?.forEach(doc => {
      if (doc?.isExistingData) {
        if (!['AMEND', 'MARK_AS_PAID', 'UNCHANGED']?.includes(doc?.overdueAction)) {
          validated = false;
        }
      }
    });
    if (!validated) {
      toggleSaveAlertModal();
    } else {
      try {
        const finalData = docs?.map(doc => {
          const data = {};
          if (doc?.isExistingData) data._id = doc?._id;
          data.isExistingData = doc?.isExistingData ? doc?.isExistingData : false;
          data.debtorId = doc?.debtorId?.value;
          data.insurerId = doc?.insurerId?.value;
          data.clientId = doc?.clientId;
          data.overdueType = doc?.overdueType?.value;
          data.acn = doc?.acn;
          data.month = doc?.month;
          data.year = doc?.year;
          data.status = doc?.status?.value;
          data.dateOfInvoice = doc?.dateOfInvoice;
          data.outstandingAmount = doc?.outstandingAmount;
          data.ninetyPlusDaysAmount = doc?.ninetyPlusDaysAmount;
          data.ninetyDaysAmount = doc?.ninetyDaysAmount;
          data.sixtyDaysAmount = doc?.sixtyDaysAmount;
          data.thirtyDaysAmount = doc?.thirtyDaysAmount;
          data.currentAmount = doc?.currentAmount;
          if (doc?.overdueAction) data.overdueAction = doc?.overdueAction;
          if (doc?.clientComment) data.clientComment = doc?.clientComment;
          return data;
        });
        dispatch(saveOverdueList({ list: finalData }));
      } catch (e) {
        displayErrors(e);
      }
    }
  }, [toggleSaveAlertModal, docs]);

  const overdueActionModalButtons = useMemo(
    () => [
      { title: 'No', buttonType: 'primary-1', onClick: () => toggleActionConfirmModal() },
      {
        title: 'Yes',
        buttonType: 'primary',
        onClick: async () => {
          try {
            await dispatch(changeOverdueAction(actionToSet?.id, actionToSet?.action));
            toggleActionConfirmModal();
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleActionConfirmModal, actionToSet]
  );
  const overdueSaveAlertModalButtons = useMemo(
    () => [
      {
        title: 'Ok',
        buttonType: 'primary',
        onClick: () => toggleSaveAlertModal(),
      },
    ],
    [toggleSaveAlertModal]
  );

  return (
    <>
      {showActionConfirmModal && (
        <Modal header="Overdue Action" buttons={overdueActionModalButtons}>
          <span className="confirmation-message">
            Are you sure you want to change action for already amended overdue?
          </span>
        </Modal>
      )}
      {showSaveAlertModal && (
        <Modal header="Overdue Action" buttons={overdueSaveAlertModalButtons}>
          <span className="confirmation-message">
            Please take necessary actions on existing overdues.
          </span>
        </Modal>
      )}
      <table className="table-class main-list-table" width={100} cellSpacing={0}>
        <thead>
          <tr className="bg-background-color">
            <td>Debtor Name</td>
            <td>Overdue Type</td>
            <td>Status</td>
            <td>Amounts</td>
            <td />
          </tr>
        </thead>
        {docs?.map(overdue => (
          <tr>
            <td>{overdue?.debtorId?.label ?? '-'}</td>
            <td>{overdue?.overdueType?.label ?? '-'}</td>
            <td>{overdue?.status?.label ?? '-'}</td>
            <td>
              {overdue?.outstandingAmount ? NumberCommaSeparator(overdue?.outstandingAmount) : '-'}
            </td>
            <td>
              {overdueActionButtons?.map(button => (
                <Button
                  buttonType={`${
                    button?.status === overdue?.overdueAction ? 'primary' : 'outlined-primary'
                  }`}
                  className="small-button"
                  title={button?.title}
                  onClick={() =>
                    onClickOverdueActionButtons(overdue?._id, button, overdue?.overdueAction)
                  }
                />
              ))}
            </td>
          </tr>
        ))}
      </table>
      <div className="add-overdues-save-button">
        <Button
          buttonType="primary"
          title="Save"
          onClick={onCLickOverdueSave}
          isLoading={saveOverdueToBackEndPageLoaderAction}
        />
      </div>
    </>
  );
};
export default AddOverdueTable;

AddOverdueTable.propTypes = {
  setIsAmendOverdueModal: PropTypes.any.isRequired,
  toggleOverdueFormModal: PropTypes.func.isRequired,
};

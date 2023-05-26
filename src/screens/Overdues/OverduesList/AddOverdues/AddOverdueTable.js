import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../common/Button/Button';
import { changeOverdueAction, getOverdueDetailsById } from '../../redux/OverduesAction';
import Modal from '../../../../common/Modal/Modal';
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
    [toggleActionConfirmModal, overdueActionButtons]
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
    [toggleActionConfirmModal]
  );

  const onClickOverdueActionButtons = useCallback(
    async (id, button, currentAction) => {
      if (button?.status === 'MARK_AS_PAID') await onClickMarkAsPaid(id, currentAction);
      if (button?.status === 'AMEND') await onClickAmend(id);
      if (button?.status === 'UNCHANGED') await onClickUnChanged(id, currentAction);
    },
    [onClickMarkAsPaid, onClickAmend, onClickUnChanged]
  );

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

  return (
    <>
      {showActionConfirmModal && (
        <Modal header="Overdue Action" buttons={overdueActionModalButtons}>
          <span className="confirmation-message">
            Are you sure you want to change action for already amended overdue?
          </span>
        </Modal>
      )}

      {docs?.length > 0 ? (
        <div className="common-list-container">
          <table
            className="table-class main-list-table add-overdue-table"
            width={100}
            cellSpacing={0}
          >
            <thead>
              <tr className="bg-background-color">
                <th>Debtor Name</th>
                <th>Overdue Type</th>
                <th>Status</th>
                <th>Amounts</th>
                <th />
              </tr>
            </thead>
            {docs?.map(overdue => (
              <tr>
                <td>{overdue?.debtorId?.label ?? '-'}</td>
                <td>{overdue?.overdueType?.label ?? '-'}</td>
                <td>{overdue?.status?.label ?? '-'}</td>
                <td>
                  {overdue?.outstandingAmount
                    ? NumberCommaSeparator(overdue?.outstandingAmount)
                    : '-'}
                </td>
                <td className="add-overdue-buttons">
                  {overdueActionButtons?.map(button => (
                    <Button
                      buttonType={`${
                        button?.status === overdue?.overdueAction ? 'primary' : 'outlined-primary'
                      }`}
                      className="small-button"
                      title={
                        overdue?.overdueAction === 'MARK_AS_PAID' &&
                        button.status === 'MARK_AS_PAID'
                          ? 'Paid'
                          : button?.title
                      }
                      onClick={() =>
                        onClickOverdueActionButtons(overdue?.index, button, overdue?.overdueAction)
                      }
                    />
                  ))}
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div className="no-record-found">No record found</div>
      )}
    </>
  );
};
export default AddOverdueTable;

AddOverdueTable.propTypes = {
  setIsAmendOverdueModal: PropTypes.any.isRequired,
  toggleOverdueFormModal: PropTypes.func.isRequired,
};

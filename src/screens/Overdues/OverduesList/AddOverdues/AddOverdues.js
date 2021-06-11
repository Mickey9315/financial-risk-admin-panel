import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../common/Input/Input';
import Modal from '../../../../common/Modal/Modal';
import Button from '../../../../common/Button/Button';
import {
  getEntityDetails,
  getOverdueListByDate,
  handleOverdueFieldChange,
  resetOverdueFormData,
} from '../../redux/OverduesAction';
import { addOverdueValidations } from './AddOverdueValidations';
import AddOverdueTable from './AddOverdueTable';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';
import Loader from '../../../../common/Loader/Loader';

const AddOverdues = () => {
  const history = useHistory();
  const { id, period } = useParams();
  const dispatch = useDispatch();
  const [overdueFormModal, setOverdueFormModal] = useState(false);
  const [isAmendOverdueModal, setIsAmendOverdueModal] = useState(false);

  const { addOverduePageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const toggleOverdueFormModal = useCallback(() => {
    setOverdueFormModal(e => !e);
  }, []);

  const { overdueDetails, entityList, overdueListByDate } = useSelector(
    ({ overdue }) => overdue ?? {}
  );

  const { docs } = useMemo(() => overdueListByDate ?? [], [overdueListByDate]);

  const callbackOnFormAddORAmend = useCallback(() => {
    toggleOverdueFormModal();
    if (isAmendOverdueModal) setIsAmendOverdueModal(false);
  }, [isAmendOverdueModal, toggleOverdueFormModal]);

  const overdueFormModalButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          toggleOverdueFormModal();
          setIsAmendOverdueModal(false);
          dispatch(resetOverdueFormData());
        },
      },
      {
        title: isAmendOverdueModal ? 'Amend' : 'Add',
        buttonType: 'primary',
        onClick: async () => {
          await addOverdueValidations(
            dispatch,
            overdueDetails,
            isAmendOverdueModal,
            callbackOnFormAddORAmend,
            docs,
            id
          );
        },
      },
    ],
    [
      overdueDetails,
      toggleOverdueFormModal,
      isAmendOverdueModal,
      callbackOnFormAddORAmend,
      setIsAmendOverdueModal,
    ]
  );
  const addModalInputs = useMemo(
    () => [
      {
        title: 'Debtor Name',
        name: 'debtorId',
        type: 'select',
        placeholder: 'Select Debtor',
        data: entityList?.debtorId,
        value: overdueDetails?.debtorId ?? [],
      },
      {
        title: 'Month/ Year',
        name: 'monthString',
        type: 'date',
        placeholder: 'Select Month/Year',
        data: '',
        value: (overdueDetails?.monthString && new Date(overdueDetails?.monthString)) || null,
      },
      {
        title: 'ACN',
        name: 'acn',
        type: 'text',
        placeholder: 'Enter ACN ',
        value: overdueDetails?.acn ?? '',
      },
      {},
      {
        title: 'Date of Invoice',
        name: 'dateOfInvoice',
        type: 'date',
        placeholder: 'Select Date Of Invoice',
        value: (overdueDetails?.dateOfInvoice && new Date(overdueDetails?.dateOfInvoice)) || null,
      },
      {},
      {
        title: 'Overdue Type',
        name: 'overdueType',
        type: 'select',
        placeholder: 'Select Overdue Type',
        data: entityList?.overdueType,
        value: overdueDetails?.overdueType ?? [],
      },
      {},
      {
        title: 'Insurer Name',
        name: 'insurerId',
        type: 'select',
        placeholder: 'Select Insurer',
        data: entityList?.insurerId,
        value: overdueDetails?.insurerId ?? [],
      },
      {},
      {
        title: 'Amount',
        type: 'main-title',
      },
      {},
      {
        title: 'Current',
        name: 'currentAmount',
        type: 'amount',
        value: overdueDetails?.currentAmount ?? '',
      },
      {
        title: 'Client Comment',
        name: 'clientComment',
        type: 'textarea',
        value: overdueDetails?.clientComment ?? '',
      },
      {
        title: '30 days',
        name: 'thirtyDaysAmount',
        type: 'amount',
        value: overdueDetails?.thirtyDaysAmount ?? '',
      },

      {
        title: '60 days',
        name: 'sixtyDaysAmount',
        type: 'amount',
        value: overdueDetails?.sixtyDaysAmount ?? '',
      },

      {
        title: '90 days',
        name: 'ninetyDaysAmount',
        type: 'amount',
        value: overdueDetails?.ninetyDaysAmount ?? '',
      },

      {
        title: '90+ days',
        name: 'ninetyPlusDaysAmount',
        type: 'amount',
        value: overdueDetails?.ninetyPlusDaysAmount ?? '',
      },

      {
        title: 'Outstanding Amounts',
        name: 'outstandingAmount',
        type: 'total-amount',
        value: overdueDetails?.outstandingAmount ?? '',
      },
    ],
    [overdueDetails, entityList]
  );

  const changeOverdueFields = useCallback((name, value) => {
    dispatch(handleOverdueFieldChange(name, value));
  }, []);

  const handleTextInputChange = useCallback(e => {
    const { name, value } = e?.target;
    changeOverdueFields(name, value);
  }, []);

  const handleAmountInputChange = useCallback(e => {
    const { name, value } = e?.target;
    const updatedVal = value?.toString()?.replaceAll(',', '');
    changeOverdueFields(name, updatedVal);
  }, []);

  const handleSelectInputChange = useCallback(e => {
    changeOverdueFields(e?.name, e);
  }, []);

  const handleDateInputChange = useCallback((name, e) => {
    changeOverdueFields(name, e);
  }, []);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={input?.value}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'select':
          component = (
            <ReactSelect
              name={input.name}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={input.placeholder}
              options={input?.data}
              value={input?.value}
              onChange={handleSelectInputChange}
            />
          );
          break;
        case 'date':
          component = (
            <div
              className={`date-picker-container ${
                input.name === 'monthString' && 'month-year-picker'
              }`}
            >
              {input.name === 'monthString' ? (
                <DatePicker
                  name={input.name}
                  placeholderText={input.placeholder}
                  dateFormat="MM/yyyy"
                  selected={input?.value}
                  showMonthYearPicker
                  showYearDropdown
                  showFullMonthYearPicker
                  onChange={e => handleDateInputChange(input?.name, e)}
                />
              ) : (
                <DatePicker
                  name={input.name}
                  placeholderText={input.placeholder}
                  selected={input?.value}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  onChange={e => handleDateInputChange(input?.name, e)}
                />
              )}
              <span className="material-icons-round">event_available</span>
            </div>
          );
          break;
        case 'main-title':
          component = <div className="add-modal-full-width-row">{input.title}</div>;
          break;
        case 'amount':
          component = (
            <Input
              name={input.name}
              value={input?.value ? NumberCommaSeparator(input?.value) : ''}
              className="add-overdue-amount-input"
              type="text"
              placeholder={99999}
              onChange={handleAmountInputChange}
            />
          );
          break;
        case 'textarea':
          component = (
            <textarea
              name={input.name}
              value={input?.value}
              rows={5}
              placeholder={input.placeholder}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'total-amount':
          component = (
            <div className="add-overdue-total-amount">
              {input?.value ? NumberCommaSeparator(input?.value) : ''}
            </div>
          );
          break;
        default:
          component = (
            <>
              <div />
            </>
          );
      }
      const finalComponent = (
        <>
          {component}
          {overdueDetails && overdueDetails ? (
            <div className="ui-state-error">
              {overdueDetails && overdueDetails?.errors ? overdueDetails.errors?.[input?.name] : ''}
            </div>
          ) : (
            ''
          )}
        </>
      );
      return (
        <div
          className={`add-overdue-field-container ${
            input.type === 'textarea' && 'add-overdue-textarea'
          }`}
        >
          {input.name && (
            <div
              className={`add-overdue-title ${
                input.title === 'Outstanding Amounts' && 'add-overdue-total-amount-title'
              }`}
            >
              {input.title}
            </div>
          )}
          <div>{finalComponent}</div>
        </div>
      );
    },
    [overdueDetails, handleDateInputChange, handleSelectInputChange, handleTextInputChange]
  );

  const backToOverduesList = () => {
    history.replace('/over-dues');
  };

  const getMonthYearSeparated = period.split('-');
  const selectedMonth = getMonthYearSeparated[0];
  const selectedYear = getMonthYearSeparated[1];

  useEffect(() => {
    dispatch(getEntityDetails());
    return () => dispatch(resetOverdueFormData());
  }, []);

  useEffect(() => {
    const data = { date: new Date(period), clientId: id };
    dispatch(getOverdueListByDate(data));
  }, [period, id]);

  useEffect(() => {
    const currentAmount =
      overdueDetails?.currentAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.currentAmount, 10) ?? 0);
    const thirtyDaysAmount =
      overdueDetails?.thirtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.thirtyDaysAmount, 10) ?? 0);
    const ninetyPlusDaysAmount =
      overdueDetails?.ninetyPlusDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.ninetyPlusDaysAmount, 10) ?? 0);
    const ninetyDaysAmount =
      overdueDetails?.ninetyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.ninetyDaysAmount, 10) ?? 0);
    const sixtyDaysAmount =
      overdueDetails?.sixtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseInt(overdueDetails?.sixtyDaysAmount, 10) ?? 0);

    const total =
      sixtyDaysAmount + ninetyDaysAmount + ninetyPlusDaysAmount + thirtyDaysAmount + currentAmount;
    changeOverdueFields('outstandingAmount', total ?? 0);
  }, [
    overdueDetails?.currentAmount,
    overdueDetails?.thirtyDaysAmount,
    overdueDetails?.sixtyDaysAmount,
    overdueDetails?.ninetyDaysAmount,
    overdueDetails?.ninetyPlusDaysAmount,
  ]);

  return (
    <>
      {!addOverduePageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToOverduesList}>List of Overdues List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>
                {selectedMonth} {selectedYear}
              </span>
            </div>
          </div>
          <div className="common-white-container add-overdues-container">
            <div className="client-entry-details">
              <span>{overdueListByDate?.client ?? '-'}</span>
              <span>
                {overdueListByDate?.previousEntries &&
                  `Previous Entries : ${overdueListByDate?.previousEntries}`}
              </span>
              <Button buttonType="success" title="Add New" onClick={toggleOverdueFormModal} />
            </div>
            <AddOverdueTable
              setIsAmendOverdueModal={setIsAmendOverdueModal}
              toggleOverdueFormModal={toggleOverdueFormModal}
            />
          </div>
          {overdueFormModal && (
            <Modal
              header={`${isAmendOverdueModal ? 'Amend Overdue' : 'Add Overdue'}`}
              className="add-overdue-modal"
              buttons={overdueFormModalButtons}
            >
              <div className="add-overdue-content">{addModalInputs?.map(getComponentFromType)}</div>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AddOverdues;

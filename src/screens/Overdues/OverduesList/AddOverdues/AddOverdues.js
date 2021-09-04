import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams, Prompt } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Input from '../../../../common/Input/Input';
import Modal from '../../../../common/Modal/Modal';
import Button from '../../../../common/Button/Button';
import {
  getEntityDetails,
  getOverdueListByDate,
  handleOverdueFieldChange,
  resetOverdueFormData,
  saveOverdueList,
} from '../../redux/OverduesAction';
import { addOverdueValidations } from './AddOverdueValidations';
import AddOverdueTable from './AddOverdueTable';
import { NumberCommaSeparator } from '../../../../helpers/NumberCommaSeparator';
import Loader from '../../../../common/Loader/Loader';
import { OVERDUE_REDUX_CONSTANTS } from '../../redux/OverduesReduxConstants';
import { setViewClientActiveTabIndex } from '../../../Clients/redux/ClientAction';
import { setViewDebtorActiveTabIndex } from '../../../Debtors/redux/DebtorsAction';

const AddOverdues = () => {
  const history = useHistory();
  const amountRef = useRef([]);
  const { isRedirected, redirectedFrom, fromId } = useMemo(() => history?.location?.state ?? {}, [
    history,
  ]);
  const { id, period } = useParams();

  const dispatch = useDispatch();
  const [overdueFormModal, setOverdueFormModal] = useState(false);
  const [isAmendOverdueModal, setIsAmendOverdueModal] = useState(false);
  const [showSaveAlertModal, setShowSaveAlertModal] = useState(false);
  const [alertOnLeftModal, setAlertOnLeftModal] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [isPrompt, setIsPrompt] = useState(false);
  const toggleAlertOnLeftModal = useCallback(
    value => setAlertOnLeftModal(value !== undefined ? value : e => !e),
    [setAlertOnLeftModal]
  );

  const { addOverduePageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const toggleOverdueFormModal = useCallback(() => {
    setOverdueFormModal(e => !e);
  }, []);

  const { overdueDetails, entityList, overdueListByDate, overdueListByDateCopy } = useSelector(
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
            id,
            period
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
      period,
    ]
  );

  const { saveOverdueToBackEndPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const selectedDate = useMemo(() => moment(period, 'MMM/YYYY'), [period]);
  const month = useMemo(() => selectedDate.format('M'), [selectedDate]);
  const year = useMemo(() => selectedDate.format('YYYY'), [selectedDate]);
  const getOverdueList = useCallback(async () => {
    const data = { month, year, clientId: id };
    await dispatch(getOverdueListByDate(data));
  }, [month, year, id]);

  const changeOverdueFields = useCallback((name, value) => {
    dispatch(handleOverdueFieldChange(name, value));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e?.target;
      changeOverdueFields(name, value);
    },
    [entityList, changeOverdueFields]
  );

  const handleDebtorChange = useCallback(
    (e, isAcnChanged = false) => {
      changeOverdueFields('debtorId', e);

      setSelectedDebtor(e);

      if (!isAcnChanged) {
        handleTextInputChange(
          {
            target: {
              name: 'acn',
              value: entityList?.debtorId?.find(debtor => debtor?.value === e.value)?.acn,
            },
          },
          true
        );
      }
    },
    [handleTextInputChange, changeOverdueFields, entityList, selectedDebtor]
  );
  const onBlurACN = useCallback(
    e => {
      const selectedRecordAcn = entityList?.debtorId?.find(
        record => record?.value === selectedDebtor?.value
      )?.acn;

      const existingDebtor = entityList?.debtorId?.find(debtor => debtor.acn === e?.target.value);

      if (existingDebtor) {
        handleDebtorChange(existingDebtor, true);
      } else if (selectedRecordAcn && !existingDebtor) {
        handleDebtorChange([], true);
      }
    },
    [entityList, handleDebtorChange, selectedDebtor]
  );

  const addModalInputs = useMemo(
    () => [
      {
        title: 'Debtor Name*',
        name: 'debtorId',
        type: 'select',
        placeholder: 'Select Debtor',
        data: entityList?.debtorId,
        value: overdueDetails?.debtorId ?? [],
        isOr: true,
      },
      {
        title: 'Month/ Year',
        name: 'monthString',
        type: 'date',
        placeholder: 'Select Month/Year',
        data: '',
        value: moment(period, 'MMMM-YYYY').format('MMMM-YYYY'),
      },
      {
        title: 'ACN/NCN*',
        name: 'acn',
        type: 'text',
        placeholder: 'Enter ACN ',
        value: overdueDetails?.acn ?? '',
        onBlur: onBlurACN,
      },
      {},
      {
        title: 'Date of Invoice*',
        name: 'dateOfInvoice',
        type: 'date',
        placeholder: 'Select Date Of Invoice',
        value: (overdueDetails?.dateOfInvoice && new Date(overdueDetails?.dateOfInvoice)) || null,
      },
      {},
      {
        title: 'Overdue Type*',
        name: 'overdueType',
        type: 'select',
        placeholder: 'Select Overdue Type',
        data: entityList?.overdueType,
        value: overdueDetails?.overdueType ?? [],
      },
      {},
      {
        title: 'Insurer Name*',
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
        placeholder: 'Please enter',
        value: overdueDetails?.clientComment ?? '',
      },
      {
        title: 'Analyst Comment',
        name: 'analystComment',
        type: 'textarea',
        placeholder: 'Please enter',
        class: 'overdue-analyst-comment',
        value: overdueDetails?.analystComment ?? '',
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
        title: 'Outstanding Amounts*',
        name: 'outstandingAmount',
        type: 'total-amount',
        value: overdueDetails?.outstandingAmount ?? '',
      },
    ],
    [overdueDetails, entityList]
  );

  const toggleSaveAlertModal = useCallback(
    value => {
      setShowSaveAlertModal(value !== undefined ? value : e => !e);
      if (isPrompt && alertOnLeftModal) toggleAlertOnLeftModal();
    },
    [setShowSaveAlertModal, isPrompt, alertOnLeftModal, toggleAlertOnLeftModal]
  );
  const decimalRegex = new RegExp(/(^[0-9]*(\.\d{0,2})?$)/);
  const handleAmountInputChange = useCallback(
    e => {
      const { name, value } = e?.target;
      const updatedVal = value?.toString()?.replaceAll(',', '');
      if (decimalRegex.test(updatedVal)) changeOverdueFields(name, updatedVal);
    },
    [decimalRegex]
  );

  const handleSelectInputChange = useCallback(e => {
    changeOverdueFields(e?.name, e);
  }, []);

  const handleDateInputChange = useCallback((name, e) => {
    changeOverdueFields(name, e);
  }, []);

  useEffect(() => {
    if (amountRef.current[12])
      amountRef.current[12].value = NumberCommaSeparator(amountRef.current[12].value);
  });

  const getComponentFromType = useCallback(
    (input, index) => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              name={input.name}
              onBlur={input?.onBlur}
              placeholder={input.placeholder}
              value={input?.value}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'select':
          component = (
            <>
              <ReactSelect
                name={input.name}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={input.placeholder}
                options={input?.data}
                value={input?.value}
                onChange={
                  input?.name === 'debtorId'
                    ? e => handleDebtorChange(e, false)
                    : handleSelectInputChange
                }
              />
              {input?.isOr && <div className="or-text">OR</div>}
            </>
          );
          break;
        case 'date':
          component =
            input.name === 'monthString' ? (
              <span className="add-overdue-month-picker font-field f-14">{input?.value}</span>
            ) : (
              <div className="date-picker-container">
                <DatePicker
                  name={input.name}
                  placeholderText={input.placeholder}
                  selected={input?.value}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  onChange={e => handleDateInputChange(input?.name, e)}
                />
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
              ref={ref => {
                amountRef.current[index] = ref;
              }}
              name={input.name}
              value={input?.value || ''}
              className="add-overdue-amount-input"
              type="text"
              placeholder="0"
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
              className={input?.class}
              placeholder={input.placeholder}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'total-amount':
          component = (
            <div className="add-overdue-total-amount">
              {input?.value && input.value !== 'NaN' ? NumberCommaSeparator(input?.value) : 0}
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
          key={input?.name}
          className={`add-overdue-field-container ${
            input.type === 'textarea' && 'add-overdue-textarea'
          } ${input?.class}`}
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
    [overdueDetails, handleDateInputChange, handleSelectInputChange, handleTextInputChange, period]
  );

  const backToOverdueList = useCallback(() => {
    if (isRedirected) {
      if (redirectedFrom === 'client') {
        setViewClientActiveTabIndex(3);
        history.replace(`/clients/client/view/${fromId}`);
      }
      if (redirectedFrom === 'debtor') {
        setViewDebtorActiveTabIndex(3);
        history.replace(`/debtors/debtor/view/${fromId}`);
      }
    } else history.replace('/over-dues');
  }, [isRedirected, redirectedFrom, fromId]);

  const getMonthYearSeparated = period.split('-');
  const selectedMonth = getMonthYearSeparated[0];
  const selectedYear = getMonthYearSeparated[1];

  useEffect(() => {
    dispatch(getEntityDetails());
    return () => dispatch(resetOverdueFormData());
  }, []);

  useEffect(async () => {
    await getOverdueList();
  }, [period, id]);

  useEffect(() => {
    const currentAmount =
      overdueDetails?.currentAmount?.toString()?.trim()?.length > 0 &&
      (parseFloat(overdueDetails?.currentAmount) ?? 0);
    const thirtyDaysAmount =
      overdueDetails?.thirtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseFloat(overdueDetails?.thirtyDaysAmount) ?? 0);
    const ninetyPlusDaysAmount =
      overdueDetails?.ninetyPlusDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseFloat(overdueDetails?.ninetyPlusDaysAmount) ?? 0);
    const ninetyDaysAmount =
      overdueDetails?.ninetyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseFloat(overdueDetails?.ninetyDaysAmount) ?? 0);
    const sixtyDaysAmount =
      overdueDetails?.sixtyDaysAmount?.toString()?.trim()?.length > 0 &&
      (parseFloat(overdueDetails?.sixtyDaysAmount) ?? 0);

    const total =
      sixtyDaysAmount + ninetyDaysAmount + ninetyPlusDaysAmount + thirtyDaysAmount + currentAmount;
    changeOverdueFields('outstandingAmount', total.toString() ?? 0);
  }, [
    overdueDetails?.currentAmount,
    overdueDetails?.thirtyDaysAmount,
    overdueDetails?.sixtyDaysAmount,
    overdueDetails?.ninetyDaysAmount,
    overdueDetails?.ninetyPlusDaysAmount,
  ]);

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
  const onCLickOverdueSave = useCallback(async () => {
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
          if (doc?.analystComment) data.analystComment = doc?.analystComment;
          return data;
        });
        await dispatch(saveOverdueList({ list: finalData }));
        if (isPrompt) setIsPrompt(false);
        backToOverdueList();
      } catch (e) {
        /**/
      }
    }
  }, [toggleSaveAlertModal, docs, isPrompt, setIsPrompt, backToOverdueList]);

  const alertOnLeftModalButtons = useMemo(
    () => [
      {
        title: 'Back To List',
        buttonType: 'primary-1',
        onClick: async () => {
          if (isPrompt) {
            await dispatch({
              type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE,
              data: overdueListByDateCopy,
            });
            setIsPrompt(false);
            backToOverdueList();
          } else {
            backToOverdueList();
          }
        },
      },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onCLickOverdueSave,
      },
    ],
    [onCLickOverdueSave, overdueListByDateCopy, isPrompt, setIsPrompt, backToOverdueList]
  );

  const handleBlockedRoute = useCallback(() => {
    toggleAlertOnLeftModal();
    setIsPrompt(true);
    return false;
  }, [toggleAlertOnLeftModal, setIsPrompt]);

  return (
    <>
      <Prompt
        when={!_.isEqual(overdueListByDate, overdueListByDateCopy)}
        message={handleBlockedRoute}
      />
      {!addOverduePageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row mt-15">
            <div className="breadcrumb">
              <span onClick={backToOverdueList}>Overdues List</span>
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
          <div className="add-overdues-save-button">
            <Button
              buttonType="primary"
              title="Save"
              onClick={overdueListByDate?.docs?.length > 0 && onCLickOverdueSave}
              isLoading={saveOverdueToBackEndPageLoaderAction}
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
      {showSaveAlertModal && (
        <Modal header="Overdue Action" buttons={overdueSaveAlertModalButtons}>
          <span className="confirmation-message">
            Please take necessary actions on existing overdue.
          </span>
        </Modal>
      )}
      {alertOnLeftModal && (
        <Modal header="Save Overdue" buttons={alertOnLeftModalButtons}>
          <span className="confirmation-message">
            Please save overdue, otherwise you may lose your changes.
          </span>
        </Modal>
      )}
    </>
  );
};

export default AddOverdues;

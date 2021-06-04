import React, { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import Input from '../../../../common/Input/Input';
import Modal from '../../../../common/Modal/Modal';
import Button from '../../../../common/Button/Button';

const AddOverdues = () => {
  const history = useHistory();
  const { period } = useParams();
  const [addOverduesModal, setAddOverduesModal] = useState(false);
  const addOverduesButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: () => setAddOverduesModal(e => !e) },
    { title: 'Add', buttonType: 'primary', onClick: () => setAddOverduesModal(e => !e) },
  ];
  const addModalInputs = [
    {
      name: 'Debtor Name',
      type: 'select',
      placeholder: 'Select',
      data: '',
      value: '',
    },
    {
      name: 'Month/ Year',
      type: 'date',
      placeholder: 'Select',
      data: '',
      value: '',
    },
    {
      name: 'ACN',
      type: 'text',
      placeholder: '0123456789',
      value: '',
    },
    {},
    {
      name: 'Date of Invoice',
      type: 'date',
      placeholder: 'Select',
      value: '',
    },
    {},
    {
      name: 'Overdue Type',
      type: 'select',
      placeholder: 'Select',
      data: '',
      value: '',
    },
    {},
    {
      name: 'Insurer Name',
      type: 'select',
      placeholder: 'Select',
      data: '',
      value: '',
    },
    {},
    {
      title: 'Amount',
      type: 'main-title',
    },
    {},
    {
      name: 'Current',
      type: 'amount',
      value: '',
    },
    {
      name: 'Client Comment',
      type: 'textarea',
      value: '',
    },
    {
      name: '30 days',
      type: 'amount',
      value: '',
    },

    {
      name: '60 days',
      type: 'amount',
      value: '',
    },

    {
      name: '90 days',
      type: 'amount',
      value: '',
    },

    {
      name: '90+ days',
      type: 'amount',
      value: '',
    },

    {
      name: 'Outstanding Amounts',
      type: 'total-amount',
      value: '$55000',
    },
  ];

  const getComponentFromType = useCallback(input => {
    let component = null;
    switch (input.type) {
      case 'text':
        component = (
          <Input type="text" name={input.name} placeholder={input.placeholder} value={input.data} />
        );
        break;
      case 'select':
        component = (
          <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder={input.placeholder}
          />
        );
        break;
      case 'date':
        component = (
          <div
            className={`date-picker-container ${
              input.name === 'Month/ Year' && 'month-year-picker'
            }`}
          >
            {input.name === 'Month/ Year' ? (
              <DatePicker
                placeholderText={input.placeholder}
                showMonthYearPicker
                showYearDropdown
                showFullMonthYearPicker
              />
            ) : (
              <DatePicker placeholdertext={input.placeholder} />
            )}
            <span className="material-icons-round">event_available</span>
          </div>
        );
        break;
      case 'main-title':
        component = <div className="add-modal-full-width-row">{input.title}</div>;
        break;
      case 'amount':
        component = <Input className="add-overdue-amount-input" type="text" placeholder={99999} />;
        break;
      case 'textarea':
        component = <textarea rows={5} placeholder={input.placeholder} />;
        break;
      case 'total-amount':
        component = <div className="add-overdue-total-amount">{input.value}</div>;
        break;
      default:
        component = (
          <>
            <div />
          </>
        );
    }
    return (
      <div
        className={`add-overdue-field-container ${
          input.type === 'textarea' && 'add-overdue-textarea'
        }`}
      >
        {input.name && (
          <div
            className={`add-overdue-title ${
              input.name === 'Outstanding Amounts' && 'add-overdue-total-amount-title'
            }`}
          >
            {input.name}
          </div>
        )}
        <div>{component}</div>
      </div>
    );
  }, []);

  const backToOverduesList = () => {
    history.replace('/over-dues');
  };

  const getMonthYearSeparated = period.split('-');
  const selectedMonth = getMonthYearSeparated[0];
  const selectedYear = getMonthYearSeparated[1];
  console.log(selectedMonth, selectedYear);

  return (
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
          <span>Client: Apositive Pty. Ltd.</span>
          <span>Previous Entries, May 2021</span>
          <Button
            buttonType="success"
            title="Add New"
            onClick={() => setAddOverduesModal(e => !e)}
          />
        </div>
      </div>
      <div className="add-overdues-save-button">
        <Button buttonType="primary" title="Save" />
      </div>
      {addOverduesModal && (
        <Modal
          header="Add Overdues"
          className="add-overdue-modal"
          headerClassName="left-aligned-modal-header"
          buttons={addOverduesButtons}
        >
          <div className="add-overdue-content">{addModalInputs.map(getComponentFromType)}</div>
        </Modal>
      )}
    </>
  );
};

export default AddOverdues;

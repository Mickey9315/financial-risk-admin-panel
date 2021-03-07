import React, { useCallback } from 'react';
import './ApplicationPersonStep.scss';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import Accordion from '../../../../../common/Accordion/Accordion';
import AccordionItem from '../../../../../common/Accordion/AccordionItem';
import Input from '../../../../../common/Input/Input';
import Checkbox from '../../../../../common/Checkbox/Checkbox';

const ApplicationPersonStep = () => {
  const INPUTS = [
    {
      label: 'Individual Details',
      placeholder: '',
      type: 'main-title',
      name: '',
      data: [],
    },
    {
      label: 'Title*',
      placeholder: 'Select',
      type: 'select',
      name: 'title',
      data: [],
    },
    {
      type: 'blank',
    },
    {
      label: 'First Name*',
      placeholder: '',
      type: 'text',
      name: 'firstName',
    },
    {
      label: 'Middle Name',
      placeholder: 'Enter middle name',
      type: 'text',
      name: 'middleName',
    },
    {
      label: 'Last Name*',
      placeholder: 'Enter last name',
      type: 'text',
      name: 'lastName',
    },
    {
      label: 'Date of Birth*',
      placeholder: 'Select date',
      type: 'date',
      name: 'birthDate',
    },
    {
      label:
        'Do you give your consent for us to check your credit history with external credit agencies?',
      type: 'checkbox',
      name: 'creditHistory',
    },
    {
      label: 'Identification Details',
      type: 'main-title',
    },
    {
      label: 'Driver License Number',
      placeholder: 'Enter driver license number',
      type: 'text',
      name: 'licenseNumber',
    },
    {
      type: 'blank',
    },
    {
      label: 'Residential Details',
      type: 'main-title',
    },
    {
      label: 'Unit Number',
      placeholder: 'Enter location',
      type: 'text',
      name: 'unitNumber',
    },
    {
      label: 'Street Number*',
      placeholder: 'Street number',
      type: 'text',
      name: 'streetNumber',
      data: [],
    },
    {
      label: 'Street Name',
      placeholder: 'Enter street Name',
      type: 'text',
      name: 'streetName',
      data: [],
    },
    {
      label: 'Street Type',
      placeholder: 'Select',
      type: 'select',
      name: 'streetType',
      data: [],
    },
    {
      label: 'Suburb',
      placeholder: 'Suburb',
      type: 'text',
      name: 'suburb',
      data: [],
    },
    {
      label: 'State',
      placeholder: 'Select',
      type: 'select',
      name: 'state',
      data: [],
    },
    {
      label: 'Postcode*',
      placeholder: 'Enter postcode',
      type: 'text',
      name: 'postcode',
    },
    {
      label: 'Contact Details',
      type: 'main-title',
    },
    {
      label: 'Phone Number',
      placeholder: '1234567890',
      type: 'text',
      name: 'phoneNo',
    },
    {
      label: 'Mobile',
      placeholder: '1234567890',
      type: 'text',
      name: 'phoneNo',
    },
    {
      label: 'Email',
      placeholder: 'Enter email address',
      type: 'email',
      name: 'phoneNo',
    },
  ];
  const getComponentFromType = useCallback(input => {
    switch (input.type) {
      case 'text':
        return (
          <>
            <span>{input.label}</span>
            <Input type="text" placeholder={input.placeholder} />
          </>
        );
      case 'email':
        return (
          <>
            <span>{input.label}</span>
            <Input type="email" placeholder={input.placeholder} />
          </>
        );
      case 'search':
        return (
          <>
            <span>{input.label}</span>
            <Input type="text" placeholder={input.placeholder} />
          </>
        );
      case 'select':
        return (
          <>
            <span>{input.label}</span>
            <ReactSelect
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              searchable={false}
            />
          </>
        );
      case 'checkbox':
        return (
          <>
            <Checkbox className="grid-checkbox" title={input.label} />
          </>
        );
      case 'main-title':
        return (
          <>
            <div className="main-title">{input.label}</div>
          </>
        );
      case 'blank':
        return (
          <>
            <span />
            <span />
          </>
        );
      case 'date':
        return (
          <>
            <span>Date of Birth*</span>
            <div className="date-picker-container">
              <DatePicker placeholderText={input.placeholder} />
              <span className="material-icons-round">event_available</span>
            </div>
          </>
        );
      default:
        return null;
    }
  }, []);
  return (
    <>
      <Accordion>
        <AccordionItem header="Director Details" prefix="expand_more">
          <div className="application-person-step-accordion-item">
            {INPUTS.map(getComponentFromType)}
          </div>
        </AccordionItem>
        <AccordionItem header="Director Details" prefix="expand_more" />
      </Accordion>
    </>
  );
};

export default ApplicationPersonStep;

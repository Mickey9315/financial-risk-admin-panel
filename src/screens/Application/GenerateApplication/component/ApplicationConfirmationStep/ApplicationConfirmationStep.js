import React, { useCallback } from 'react';
import './ApplicationConfirmationStep.scss';
import Checkbox from '../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../common/RadioButton/RadioButton';

const ApplicationConfirmationStep = () => {
  const confirmationDetails = [
    {
      title: 'Client Name',
      value: 'Select',
      label: 'clientName',
      type: 'text',
    },
    {
      type: 'line',
    },
    {
      title: 'Debtor',
      value: 'Select',
      label: 'debtor',
      type: 'text',
    },
    {
      title: 'Trading Name',
      value: 'Select',
      label: 'tradingName',
      type: 'text',
    },
    {
      title: 'ABN*',
      value: '01234',
      label: 'abn',
      type: 'text',
    },
    {
      title: 'ACN',
      value: '01234',
      label: 'acn',
      type: 'text',
    },
    {
      title: 'Entity Name*',
      value: 'Enter entity',
      label: 'entityName',
      type: 'text',
    },
    {
      title: 'Phone Number',
      value: '1234567890',
      label: 'phoneNumber',
      type: 'text',
    },
    {
      title: 'Entity Type*',
      value: 'Proprietary Limited',
      label: 'entityType',
      type: 'text',
    },
    {
      title: 'Outstanding Amount',
      value: '$0000',
      label: 'outstandingAmount',
      type: 'text',
    },
    {
      type: 'line',
    },
    {
      title: 'Current Business Address',
      type: 'title',
    },
    {
      title: 'Property',
      value: 'Enter',
      label: 'property',
      type: 'text',
    },
    {
      title: 'Unit Number',
      value: 'Enter',
      label: 'unitNumber',
      type: 'text',
    },
    {
      title: 'Street Number',
      value: 'Enter',
      label: 'streetNumber',
      type: 'text',
    },
    {
      title: 'Street Name',
      value: 'Enter',
      label: 'streetName',
      type: 'text',
    },
    {
      title: 'State',
      value: 'Select',
      label: 'state',
      type: 'text',
    },
    {
      title: 'Postcode',
      value: 'Enter',
      label: 'postCode',
      type: 'text',
    },
    {
      title: 'Any extended payment terms outside your policy standard terms? *',
      value: 'yes',
      label: 'isExtendedPay',
      type: 'radio',
    },
    {
      title: 'If yes, provide details',
      value: 'Details',
      label: 'isExtendedPayDetails',
      type: 'ifYesText',
    },
    {
      title: 'Any overdue amounts passed your maximum extension period / Credit period? *',
      value: 'yes',
      id1: 'passed-max-period-yes',
      label: 'isPassedMaxPeriod',
      type: 'radio',
    },
    {
      title: 'If yes, provide details',
      value: 'Details',
      label: 'isPassedMaxPeriodDetails',
      type: 'ifYesText',
    },
    {
      type: 'line',
    },
    {
      title: 'Credit limit required covering 3 months of sales',
      type: 'title',
    },
    {
      title: 'Amount *',
      value: 'Details',
      label: 'isPassedMaxPeriodDetails',
      type: 'text',
    },
    {
      type: 'line',
    },
    {
      title: 'Director Details',
      type: 'main-title',
    },
    {
      title: 'Individual Details',
      type: 'title',
    },
    {
      title: 'Title *',
      value: 'Select',
      label: 'directorTitle',
      type: 'text',
    },
    {
      type: 'blank',
    },
    {
      title: 'First Name *',
      value: 'Enter first name',
      label: 'directorFirstName',
      type: 'text',
    },
    {
      title: 'Middle Name',
      value: 'Enter middle name',
      label: 'directorMiddleName',
      type: 'text',
    },
    {
      title: 'Last Name',
      value: 'Enter last name',
      label: 'directorLastName',
      type: 'text',
    },
    {
      title: 'Date of Birth *',
      value: 'Select Date',
      label: 'directorDOB',
      type: 'text',
    },
    {
      title: 'Last Name',
      value: 'Enter last name',
      label: 'directorLastName',
      type: 'checkbox',
    },
    {
      title:
        'Do you give your consent for us to check your credit history with external credit agencies?',
      value: 'true',
    },
    {
      title: 'Identification Details',
      type: 'title',
    },
    {
      title: 'Driver License Number',
      value: 'Enter driver license number',
      label: 'directorLicenseNumber',
      type: 'text',
    },
    {
      type: 'blank',
    },
    {
      title: 'Identification Details',
      type: 'title',
    },
    {
      title: 'Unit Number',
      value: 'Enter driver license number',
      label: 'directorUnitNumber',
      type: 'text',
    },
    {
      title: 'Street Number *',
      value: 'Enter',
      label: 'directorStreetNumber',
      type: 'text',
    },
    {
      title: 'Street Name',
      value: 'Enter',
      label: 'directorStreetName',
      type: 'text',
    },
    {
      title: 'State *',
      value: 'Select',
      label: 'directorState',
      type: 'text',
    },
    {
      title: 'Postcode *',
      value: 'Enter',
      label: 'directorPostCode',
      type: 'text',
    },
    {
      type: 'blank',
    },
    {
      title: 'Contact Details',
      type: 'title',
    },
    {
      title: 'Phone Number',
      value: '1234567890',
      label: 'directorPhoneNumber',
      type: 'text',
    },
    {
      title: 'Mobile',
      value: '1234567890',
      label: 'directorMobile',
      type: 'text',
    },
    {
      title: 'Email Address',
      value: 'Enter',
      label: 'directorEmail',
      type: 'text',
    },
  ];
  const getConfirmationComponentFromType = useCallback(detail => {
    switch (detail.type) {
      case 'text':
        return (
          <>
            <span>{detail.title}</span>
            <span className="detail-value">{detail.value}</span>
          </>
        );
      case 'ifYesText':
        return (
          <>
            <span>{detail.title}</span>
            <span className="long-text">{detail.value}</span>
          </>
        );
      case 'title':
        return (
          <>
            <span className="title">{detail.title}</span>
          </>
        );
      case 'radio':
        return (
          <>
            <span className="radio-title">{detail.title}</span>
            <span>
              <RadioButton disabled id="any-extended-pay-yes" label="Yes" />
              <RadioButton disabled id="any-extended-pay-no" label="No" />
            </span>
            <span />
            <span />
          </>
        );
      case 'checkbox':
        return (
          <>
            <Checkbox className="grid-checkbox" title={detail.title} />
          </>
        );
      case 'main-title':
        return (
          <>
            <div className="main-title">{detail.title}</div>
          </>
        );
      case 'line':
        return <div className="horizontal-line" />;
      case 'blank':
        return <></>;
      default:
        return null;
    }
  }, []);
  return (
    <div className="application-confirmation-step">
      {confirmationDetails.map(getConfirmationComponentFromType)}
    </div>
  );
};

export default ApplicationConfirmationStep;

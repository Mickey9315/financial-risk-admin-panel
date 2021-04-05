import React, { useCallback } from 'react';
import './ApplicationConfirmationStep.scss';
import { useSelector } from 'react-redux';
import Checkbox from '../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../common/RadioButton/RadioButton';

const ApplicationConfirmationStep = () => {
  const { company, creditLimit, partners } = useSelector(
    ({ application }) => application.viewApplicationDetails
  );
  console.log('viewApplication', company, creditLimit, partners);
  const confirmationDetails = [
    {
      title: 'Client Name',
      value: company?.clientId.name || '-',
      label: 'clientName',
      type: 'text',
    },
    {
      type: 'line',
    },
    {
      title: 'Debtor',
      value: company?.debtorId.name || '-',
      label: 'debtor',
      type: 'text',
    },
    {
      title: 'Trading Name',
      value: company?.tradingName || '-',
      label: 'tradingName',
      type: 'text',
    },
    {
      title: 'ABN*',
      value: company?.abn || '-',
      label: 'abn',
      type: 'text',
    },
    {
      title: 'ACN',
      value: company?.acn || '-',
      label: 'acn',
      type: 'text',
    },
    {
      title: 'Entity Name*',
      value: company?.entityName || '-',
      label: 'entityName',
      type: 'text',
    },
    {
      title: 'Phone Number',
      value: company?.contactNumber || '-',
      label: 'phoneNumber',
      type: 'text',
    },
    {
      title: 'Entity Type*',
      value: company?.entityType || '-',
      label: 'entityType',
      type: 'text',
    },
    {
      title: 'Outstanding Amount',
      value: company?.outstandingAmount || '-',
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
      value: company?.property || '-',
      label: 'property',
      type: 'text',
    },
    {
      title: 'Unit Number',
      value: company?.unitNumber || '-',
      label: 'unitNumber',
      type: 'text',
    },
    {
      title: 'Street Number',
      value: company?.streetNumber || '-',
      label: 'streetNumber',
      type: 'text',
    },
    {
      title: 'Street Name',
      value: company?.streetName || '-',
      label: 'streetName',
      type: 'text',
    },
    {
      title: 'State',
      value: company?.state || '-',
      label: 'state',
      type: 'text',
    },
    {
      title: 'Postcode',
      value: company?.postCode || '-',
      label: 'postCode',
      type: 'text',
    },
    {
      title: 'Street Type',
      value: company?.streetType || '-',
      label: 'streetType',
      type: 'text',
    },
    {
      title: 'Country',
      value: company?.country.name || '-',
      label: 'country',
      type: 'text',
    },
    {
      title: 'Suburb',
      value: company?.suburb || '-',
      label: 'Suburb',
      type: 'text',
    },
    {
      title: 'Any extended payment terms outside your policy standard terms? *',
      value: creditLimit?.isExtendedPaymentTerms || false,
      id: 'is-extended-payment',
      label: 'isExtendedPay',
      type: 'radio',
    },
    {
      title: 'If yes, provide details',
      value: creditLimit?.extendedPaymentTermsDetails || '-',
      label: 'isExtendedPayDetails',
      type: 'ifYesText',
    },
    {
      title: 'Any overdue amounts passed your maximum extension period / Credit period? *',
      value: creditLimit?.isPassedOverdueAmount || false,
      id: 'passed-max-period',
      label: 'isPassedMaxPeriod',
      type: 'radio',
    },
    {
      title: 'If yes, provide details',
      value: creditLimit?.passedOverdueDetails || '-',
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
      value: creditLimit?.creditLimit || '-',
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
      title:
        'Do you give your consent for us to check your credit history with external credit agencies?',
      value: 'true',
      label: 'directorLastName',
      type: 'checkbox',
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
            {console.log(detail.label, detail.value)}
            <span className="radio-buttons">
              <RadioButton
                disabled
                id={`${detail.id}-yes`}
                name={detail.name}
                label="Yes"
                value
                checked={detail.value}
              />
              <RadioButton
                disabled
                id={`${detail.id}-no`}
                name={detail.name}
                label="No"
                value={false}
                checked={!detail.value}
              />
            </span>
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
        return (
          <>
            <div />
            <div />
          </>
        );
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

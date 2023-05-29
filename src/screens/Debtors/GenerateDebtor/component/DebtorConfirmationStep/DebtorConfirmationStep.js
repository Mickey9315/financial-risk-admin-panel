/* eslint-disable no-unused-vars */
import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../common/RadioButton/RadioButton';
// import { getDebtorDetail } from '../../../redux/DebtorsAction';
// import { useQueryParams } from '../../../../../hooks/GetQueryParamHook';

const DebtorConfirmationStep = () => {
  const dispatch = useDispatch();
  const editDebtor = useSelector(({ debtorsManagement }) => debtorsManagement?.editDebtor);

  const { company, documents } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.editDebtor ?? {}
  );
  // const { debtorId } = useQueryParams();

  /*
 useEffect(() => {
    dispatch(getDebtorDetail(debtorId));
  }, []);
  */

  const getDocumentStepData = useMemo(
    () =>
      documents?.uploadDocumentDebtorData?.map(doc => {
        return [
          {
            title: 'Document Type',
            value: doc?.documentTypeId || '-',
            label: 'documentType',
            type: 'text',
          },
          {
            title: 'Description',
            value: doc?.description || '-',
            label: 'description',
            type: 'text',
          },
        ];
      }) || [],
    [documents]
  );

  const confirmationDetails = [
    // {
    //   title: 'Client Name',
    //   value: company?.clientId,
    //   label: 'clientName',
    //   type: 'select',
    // },
    // {
    //   type: 'line',
    // },

    {
      title: 'Trading Name',
      value: company?.tradingName || '-',
      label: 'tradingName',
      type: 'text',
    },
    {
      title: 'ABN/NZBN*',
      value: company?.abn || '-',
      label: 'abn',
      type: 'text',
    },
    {
      title: 'ACN/NCN',
      value: company?.acn || '-',
      label: 'acn',
      type: 'text',
    },
    {
      title: 'Entity Name*',
      value: company?.entityName,
      label: 'entityName',
      type: 'select',
    },
    {
      title: 'Phone Number',
      value: company?.contactNumber || '-',
      label: 'phoneNumber',
      type: 'text',
    },
    {
      title: 'Entity Type*',
      value: company?.entityType,
      label: 'entityType',
      type: 'select',
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
      value: company?.state,
      label: 'state',
      type: 'select',
    },
    {
      title: 'Postcode',
      value: company?.postCode || '-',
      label: 'postCode',
      type: 'text',
    },
    {
      title: 'Street Type',
      value: company?.streetType,
      label: 'streetType',
      type: 'select',
    },
    {
      title: 'Country',
      value: company?.country,
      label: 'country',
      type: 'select',
    },
    {
      title: 'Suburb',
      value: company?.suburb || '-',
      label: 'Suburb',
      type: 'text',
    },

    documents?.uploadDocumentDebtorData?.length > 0 && {
      title: 'Documents Details',
      type: 'title',
    },
    documents?.uploadDocumentDebtorData?.length > 0 && {
      type: 'array',
      data: getDocumentStepData,
    },
  ];
  const getConfirmationComponentFromType = useCallback(detail => {
    switch (detail.type) {
      case 'text':
        return (
          <>
            <span>{detail?.title}</span>
            <span className="detail-value">{detail?.value}</span>
          </>
        );
      case 'select':
        return (
          <>
            <span>{detail?.title}</span>
            <span className="detail-value">{detail?.value?.label ?? '-'}</span>
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
            <span className="radio-buttons d-flex">
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
            <Checkbox className="grid-checkbox" title={detail.title} disabled={detail.isDisabled} />
          </>
        );
      case 'main-title':
        return (
          <>
            <div className="main-title">{detail.title}</div>
          </>
        );
      case 'main-title-director-detail':
        return (
          <>
            <div className="main-title-director-detail">{detail.title}</div>
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
      case 'array':
        return detail.data.map(elem => elem.map(getConfirmationComponentFromType));
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

export default DebtorConfirmationStep;

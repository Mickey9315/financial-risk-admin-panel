import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';

import {
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
  updateEditApplicationData,
  updateEditApplicationField,
} from '../../../redux/ApplicationAction';

const ApplicationCompanyStep = () => {
  const dispatch = useDispatch();

  const companyState = useSelector(({ application }) => application.editApplication.companyStep);
  const { clients, debtors, streetType, australianStates, entityType } = useSelector(
    ({ application }) => application.company.dropdownData
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Debtor',
        placeholder: 'Select',
        type: 'select',
        name: 'debtor',
        data: debtors,
      },
      {
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        data: [],
      },
      {
        label: 'ABN*',
        placeholder: '01234',
        type: 'search',
        name: 'abn',
        data: [],
      },
      {
        label: 'ACN',
        placeholder: '01234',
        type: 'search',
        name: 'acn',
        data: [],
      },
      {
        label: 'Entity Name*',
        placeholder: 'Enter Entity',
        type: 'search',
        name: 'entityName',
        data: [],
      },
      {
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'phoneNumber',
        data: [],
      },
      {
        label: 'Entity Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: entityType,
      },
      {
        label: 'Outstanding Amount',
        placeholder: '$0000',
        type: 'text',
        name: 'outstandingAmount',
        data: [],
      },
      {
        label: 'Address*',
        placeholder: 'Enter a location',
        type: 'text',
        name: 'address',
        data: [],
      },
      {
        label: 'Property',
        placeholder: 'Property',
        type: 'text',
        name: 'property',
        data: [],
      },
      {
        label: 'Unit Number',
        placeholder: 'Unit Number',
        type: 'text',
        name: 'unitNumber',
        data: [],
      },
      {
        label: 'Street Number',
        placeholder: 'Street Number',
        type: 'text',
        name: 'streetNumber',
        data: [],
      },
      {
        label: 'Street Name',
        placeholder: 'Street Name',
        type: 'text',
        name: 'streetName',
        data: [],
      },
      {
        label: 'Street Type',
        placeholder: 'Select',
        type: 'select',
        name: 'streetType',
        data: streetType,
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
        data: australianStates,
      },
      {
        label: 'Postcode',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postcode',
        data: [],
      },
    ],
    [debtors, streetType, australianStates, entityType]
  );

  const updateSingleCompanyState = useCallback((name, value) => {
    dispatch(updateEditApplicationField('companyStep', name, value));
  }, []);

  const updateCompanyState = useCallback(data => {
    dispatch(updateEditApplicationData('companyStep', data));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateSingleCompanyState(data[0].name, data[0].value);
    },
    [updateSingleCompanyState]
  );

  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        handleSelectInputChange(data);
        const response = await getApplicationCompanyDataFromDebtor(
          data[0].value,
          companyState.client
        );
        if (response) {
          updateCompanyState(response);
        }
      } catch (e) {
        /**/
      }
    },
    [companyState, handleSelectInputChange, updateCompanyState]
  );

  const getComponentFromType = useCallback(
    input => {
      switch (input.type) {
        case 'text':
          return (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={companyState[input.name]}
                onChange={handleTextInputChange}
              />
            </>
          );
        case 'search':
          return (
            <>
              <span>{input.label}</span>
              <Input
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                value={companyState[input.name]}
                onChange={handleTextInputChange}
              />
            </>
          );
        case 'select': {
          let handleOnChange = handleSelectInputChange;
          if (input.name === 'debtor') {
            handleOnChange = handleDebtorSelectChange;
          }
          return (
            <>
              <span>{input.label}</span>
              <ReactSelect
                placeholder={input.placeholder}
                name={input.name}
                options={input.data}
                searchable={false}
                values={companyState[input.name]}
                onChange={handleOnChange}
              />
            </>
          );
        }
        default:
          return null;
      }
    },
    [companyState, handleDebtorSelectChange, handleSelectInputChange, handleTextInputChange]
  );

  useEffect(() => {
    dispatch(getApplicationCompanyDropDownData());
  }, []);

  return (
    <div className="common-white-container client-details-container">
      <span>Client</span>
      <ReactSelect
        placeholder="Select"
        options={clients}
        searchable={false}
        values={companyState.client}
        onChange={handleSelectInputChange}
      />
      <span />
      <span />
      {INPUTS.map(getComponentFromType)}
    </div>
  );
};

export default ApplicationCompanyStep;

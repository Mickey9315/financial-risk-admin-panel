import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';

import {
  getApplicationCompanyDataFromABNOrACN,
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
  searchApplicationCompanyEntityName,
  updateEditApplicationData,
  updateEditApplicationField,
} from '../../../redux/ApplicationAction';
import { errorNotification } from '../../../../../common/Toast';

const ApplicationCompanyStep = () => {
  const dispatch = useDispatch();

  const companyState = useSelector(({ application }) => application.editApplication.companyStep);
  const { clients, debtors, streetType, australianStates, entityType } = useSelector(
    ({ application }) => application.company.dropdownData
  );
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application.company.entityNameSearch
  );
  const entityNameSearchRef = useRef(0);

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
        type: 'entityName',
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
      updateSingleCompanyState(data[0]?.name, data);
    },
    [updateSingleCompanyState]
  );

  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        if (!companyState.client || companyState.client.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        handleSelectInputChange(data);
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromDebtor(data[0].value, params);

        if (response) {
          updateCompanyState(response);
        }
      } catch (e) {
        /**/
      }
    },
    [companyState, handleSelectInputChange, updateCompanyState]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        if (!companyState.client || companyState.client.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(e.target.value, params);

        if (response) {
          updateCompanyState(response);
        }
      }
    },
    [companyState, updateCompanyState]
  );

  const handleEntityNameSearch = useCallback(
    data => {
      try {
        if (!companyState.client || companyState.client.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        if (entityNameSearchRef.current !== 0) {
          clearInterval(entityNameSearchRef.current);
        }
        entityNameSearchRef.current = setTimeout(() => {
          const params = { clientId: companyState.client[0].value };

          dispatch(searchApplicationCompanyEntityName(data.state.search, params));
        }, 1500);
      } catch (err) {
        /**/
      }
    },
    [companyState, entityNameSearchRef]
  );

  const handleEntityNameSelect = useCallback(
    async e => {
      try {
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(e[0].abn, params);

        if (response) {
          updateCompanyState(response);
        }
      } catch (err) {
        /**/
      }
    },
    [companyState, updateCompanyState]
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
                onKeyDown={handleSearchTextInputKeyDown}
              />
            </>
          );
        case 'entityName':
          return (
            <>
              <span>{input.label}</span>
              <ReactSelect
                placeholder={input.placeholder}
                name={input.name}
                options={entityNameSearchDropDownData}
                searchable
                // values={companyState[input.name]}
                onChange={handleEntityNameSelect}
                searchFn={handleEntityNameSearch}
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

import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';
import Button from '../../../../../common/Button/Button';
import {
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
} from '../../../redux/ApplicationAction';

const initialCompanyState = {
  client: '',
  postcode: '',
  state: '',
  suburb: '',
  streetType: '',
  streetName: '',
  streetNumber: '',
  unitNumber: '',
  property: '',
  address: '',
  outstandingAmount: '',
  entityType: '',
  phoneNumber: '',
  entityName: '',
  acn: '',
  abn: '',
  tradingName: '',
  debtor: '',
};

const COMPANY_STATE_REDUCER_ACTIONS = {
  UPDATE_FIELD_DATA: 'UPDATE_FIELD_DATA',
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function companyStateReducer(state, action) {
  switch (action.type) {
    case COMPANY_STATE_REDUCER_ACTIONS.UPDATE_FIELD_DATA:
      return {
        ...state,
        [action.name]: action.value,
      };
    case COMPANY_STATE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case COMPANY_STATE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialCompanyState };
    default:
      return state;
  }
}

const ApplicationCompanyStep = () => {
  const dispatch = useDispatch();

  const [companyState, dispatchCompanyState] = useReducer(companyStateReducer, initialCompanyState);
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

  const updateSingleCompanyState = useCallback(
    (name, value) => {
      dispatchCompanyState({
        type: COMPANY_STATE_REDUCER_ACTIONS.UPDATE_FIELD_DATA,
        name,
        value,
      });
    },
    [dispatchCompanyState]
  );

  const updateCompanyState = useCallback(
    data => {
      dispatchCompanyState({
        type: COMPANY_STATE_REDUCER_ACTIONS.UPDATE_DATA,
        data,
      });
    },
    [dispatchCompanyState]
  );

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateSingleCompanyState(data[0].label, data[0].value);
    },
    [updateSingleCompanyState]
  );

  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        handleSelectInputChange(data);
        const response = await getApplicationCompanyDataFromDebtor(data[0].value);
        if (response) {
          updateCompanyState(response);
        }
      } catch (e) {
        /**/
      }
    },
    [handleSelectInputChange, updateCompanyState]
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
                value={companyState[input.name]}
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
        name="client"
        options={clients}
        searchable={false}
        value={companyState.client}
      />
      <span />
      <span />
      {INPUTS.map(getComponentFromType)}
    </div>
  );
};

export default ApplicationCompanyStep;

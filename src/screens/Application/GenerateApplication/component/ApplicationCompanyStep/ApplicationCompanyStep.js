import React, { useCallback, useReducer } from 'react';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';
import Button from '../../../../../common/Button/Button';

const INPUTS = [
  {
    label: 'Debtor',
    placeholder: '',
    type: 'select',
    name: 'debtor',
    data: [],
  },
  {
    label: 'Trading Name',
    placeholder: '',
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
    type: 'select',
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
    type: 'select',
    name: 'phoneNumber',
    data: [],
  },
  {
    label: 'Entity Type*',
    placeholder: '',
    type: 'select',
    name: 'entityType',
    data: [],
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
    placeholder: '',
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
    placeholder: '',
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
    placeholder: '',
    type: 'select',
    name: 'state',
    data: [],
  },
  {
    label: 'Postcode',
    placeholder: 'Postcode',
    type: 'text',
    name: 'postcode',
    data: [],
  },
];

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
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function companyStateReducer(state, action) {
  switch (action.type) {
    case COMPANY_STATE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [action.name]: action.value,
      };
    case COMPANY_STATE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialCompanyState };
    default:
      return state;
  }
}

const ApplicationCompanyStep = () => {
  const [companyState, dispatchCompanyState] = useReducer(companyStateReducer, initialCompanyState);

  const updateCompanyState = useCallback(
    (name, value) => {
      dispatchCompanyState({
        type: COMPANY_STATE_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    },
    [dispatchCompanyState]
  );

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateCompanyState(name, value);
    },
    [updateCompanyState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateCompanyState(data[0].name, data[0]._id);
    },
    [updateCompanyState]
  );

  const getComponentFromType = useCallback(input => {
    switch (input.type) {
      case 'text':
        return (
          <>
            <span>{input.label}</span>
            <Input type="text" placeholder={input.placeholder} onChange={handleTextInputChange} />
          </>
        );
      case 'search':
        return (
          <>
            <span>{input.label}</span>
            <Input type="text" placeholder={input.placeholder} onChane={handleTextInputChange} />
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
              onChange={handleSelectInputChange}
            />
          </>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="common-white-container client-details-container">
      <span>Client</span>
      <ReactSelect
        placeholder="Select"
        name="client"
        options={[]}
        searchable={false}
        value={companyState.client}
      />
      <span />
      <span />
      {INPUTS.map(getComponentFromType)}
      <Button buttonType="primary" title="Save and Next" />
    </div>
  );
};

export default ApplicationCompanyStep;

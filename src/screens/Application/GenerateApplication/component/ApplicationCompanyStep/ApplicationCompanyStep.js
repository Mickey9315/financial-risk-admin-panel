import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';
import './ApplicationCompanyStep.scss';
import {
  changeEditApplicationFieldValue,
  getApplicationCompanyDataFromABNOrACN,
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
  searchApplicationCompanyEntityName,
  updateEditApplicationData,
  updateEditApplicationField,
} from '../../../redux/ApplicationAction';
import { errorNotification } from '../../../../../common/Toast';
import Loader from '../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../common/Modal/Modal';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  UPDATE_DATA: 'UPDATE_DATA',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: null,
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };
    case DRAWER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

const ApplicationCompanyStep = () => {
  const dispatch = useDispatch();

  const companyState = useSelector(({ application }) => application.editApplication.companyStep);
  const { clients, debtors, streetType, australianStates,newZealandStates, entityType, countryList } = useSelector(
    ({ application }) => application.company.dropdownData
  );
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application.company.entityNameSearch
  );

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [stateValue,setStateValue] = useState([]);

  const INPUTS = useMemo(
    () => [
      {
        label: 'Client',
        placeholder: 'Select',
        type: 'select',
        name: 'client',
        data: clients,
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList,
      },
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
        label: 'Street Number*',
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
        label: 'State*',
        placeholder: 'Select',
        type: 'select',
        name: 'state',
        data: stateValue,
      },
      {
        label: 'Postcode*',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postcode',
        data: [],
      },
    ],
    [debtors, streetType, entityType,stateValue]
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
      if (data[0]?.name === 'entityType') {
        dispatch(changeEditApplicationFieldValue(data[0]?.name, data[0]?.value));
      }
      if(data[0]?.name === 'country'){
          console.log('data',data[0].value)
          dispatch(updateEditApplicationField('companyStep','state', []));
          if(data[0]?.value === 'AUS'){
              setStateValue(australianStates)
          }else if(data[0]?.value === 'NZL'){
              setStateValue(newZealandStates)
          }
      }
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
    async e => {
      if (e.key === 'Enter') {
        if (!companyState.client || companyState.client.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        const params = { clientId: companyState.client[0].value };
        dispatch(searchApplicationCompanyEntityName(e.target.value, params));
      }
    },
    [companyState, updateCompanyState, dispatchDrawerState]
  );

  const handleToggleDropdown = useCallback(
    value =>
      dispatchDrawerState({
        type: DRAWER_ACTIONS.UPDATE_DATA,
        data: {
          visible: value !== undefined ? value : e => !e,
        },
      }),
    [dispatchDrawerState]
  );

  const handleEntityNameSelect = useCallback(
    async data => {
      try {
        const params = { clientId: companyState.client[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(data.abn, params);

        if (response) {
          updateCompanyState(response);
        }
      } catch (err) {
        /**/
      }
      handleToggleDropdown(false);
    },
    [companyState, updateCompanyState]
  );

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={companyState[input.name]}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={companyState[input.name]}
              onChange={handleTextInputChange}
              onKeyDown={handleSearchTextInputKeyDown}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input type="text" placeholder={input.placeholder} onKeyDown={handleEntityNameSearch} />
          );
          break;
        case 'select': {
          let handleOnChange = handleSelectInputChange;
          if (input.name === 'debtor') {
            handleOnChange = handleDebtorSelectChange;
          }
          component = (
            <ReactSelect
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              searchable={false}
              values={companyState[input.name]}
              onChange={handleOnChange}
            />
          );
          break;
        }
        default:
          return null;
      }
      return (
        <>
          <span>{input.label}</span>
          <div>
            {component}
            {companyState.errors[input.name] && (
              <div className="ui-state-error">{companyState.errors[input.name]}</div>
            )}
          </div>
        </>
      );
    },
    [companyState, handleDebtorSelectChange, handleSelectInputChange, handleTextInputChange]
  );

  useEffect(() => {
    dispatch(getApplicationCompanyDropDownData());
  }, []);

  return (
    <>
      {drawerState.visible && (
        <Modal
          hideModal={handleToggleDropdown}
          className="application-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchDropDownData.isLoading ? (
            <Loader />
          ) : (
            <ApplicationEntityNameTable
              data={entityNameSearchDropDownData.data}
              handleEntityNameSelect={handleEntityNameSelect}
            />
          )}
        </Modal>
      )}
      <div className="common-white-container client-details-container">
        {INPUTS.map(getComponentFromType)}
      </div>
    </>
  );
};

export default ApplicationCompanyStep;

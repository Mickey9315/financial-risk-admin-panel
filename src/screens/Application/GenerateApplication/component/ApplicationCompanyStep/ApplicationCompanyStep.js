import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Input from '../../../../../common/Input/Input';
import './ApplicationCompanyStep.scss';
import {
  getApplicationCompanyDataFromABNOrACN,
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
  searchApplicationCompanyEntityName,
  updateEditApplicationData,
  updateEditApplicationField,
  wipeOutPersonsAsEntityChange,
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

  const companyState = useSelector(({ application }) => application.editApplication.company);
  const { partners } = useSelector(({ application }) => application.editApplication);
  const {
    clients,
    debtors,
    streetType,
    australianStates,
    newZealandStates,
    entityType,
    countryList,
  } = useSelector(({ application }) => application.companyData.dropdownData);
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application.companyData.entityNameSearch
  );

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [stateValue, setStateValue] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [wipeOutDetails, setWipeOutDetails] = useState(false);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const changeEntityType = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(wipeOutPersonsAsEntityChange([]));
            setWipeOutDetails(true);
            toggleConfirmationModal();
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, wipeOutDetails]
  );
  const INPUTS = useMemo(
    () => [
      {
        label: 'Client',
        placeholder: 'Select',
        type: 'select',
        name: 'clientId',
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
        name: 'debtorId',
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
        name: 'postCode',
        data: [],
      },
    ],
    [debtors, streetType, entityType, stateValue]
  );

  const updateSingleCompanyState = useCallback(
    (name, value) => {
      if (wipeOutDetails) {
        dispatch(updateEditApplicationField('company', 'wipeOutDetails', true));
      }
      dispatch(updateEditApplicationField('company', name, value));
    },
    [wipeOutDetails]
  );

  const updateCompanyState = useCallback(data => {
    dispatch(updateEditApplicationData('company', data));
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
      if (data[0]?.name === 'country') {
        if (data[0]?.value === 'AUS') {
          setStateValue(australianStates);
        } else if (data[0]?.value === 'NZL') {
          setStateValue(newZealandStates);
        } else {
          dispatch(updateEditApplicationField('company', 'state', []));
        }
      }
      if (data[0]?.name === 'entityType' && partners.length !== 0) {
        setShowConfirmModal(true);
      } else {
        dispatch(updateEditApplicationField('company', data[0]?.name, data));
      }
    },
    [
      updateSingleCompanyState,
      setShowConfirmModal,
      setStateValue,
      newZealandStates,
      australianStates,
    ]
  );

  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        if (!companyState.clientId || companyState.clientId.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        handleSelectInputChange(data);
        const params = { clientId: companyState.clientId[0].value };
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
        if (!companyState.clientId || companyState.clientId.length === 0) {
          errorNotification('Please select clientId before continue');
          return;
        }
        const params = { clientId: companyState.clientId[0].value };
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
        if (!companyState.clientId || companyState.clientId.length === 0) {
          errorNotification('Please select client before continue');
          return;
        }
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        const params = { clientId: companyState.clientId[0].value };
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
        const params = { clientId: companyState.clientId[0].value };
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
            <Input
              type="text"
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              // value={companyState?.entityName?.[0]?.label}
            />
          );
          break;
        case 'select': {
          let handleOnChange = handleSelectInputChange;
          if (input.name === 'debtorId') {
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
            {companyState?.errors?.[input.name] && (
              <div className="ui-state-error">{companyState?.errors?.[input.name]}</div>
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
      {showConfirmModal && (
        <Modal
          header="Change entity type"
          buttons={changeEntityType}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            Are you sure you want to change entity type it will wipe-up person step data you filled?
          </span>
        </Modal>
      )}
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

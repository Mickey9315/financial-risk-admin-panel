import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';

import AccordionItem from '../../../../../../common/Accordion/AccordionItem';
import Input from '../../../../../../common/Input/Input';
import Checkbox from '../../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../../common/RadioButton/RadioButton';
import {
  changePersonType,
  getApplicationCompanyDataFromABNOrACN,
  getApplicationCompanyDropDownData,
  getApplicationFilter,
  removePersonDetail,
  searchApplicationCompanyEntityName,
  updatePersonData,
  updatePersonStepDataOnValueSelected,
} from '../../../../redux/ApplicationAction';
import { DRAWER_ACTIONS } from '../../ApplicationCompanyStep/ApplicationCompanyStep';
import Loader from '../../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../../common/Modal/Modal';
import { errorNotification, successNotification } from '../../../../../../common/Toast';

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
const PersonIndividualDetail = ({ itemHeader, hasRadio, index, entityTypeFromCompany }) => {
  const dispatch = useDispatch();
  const updateSinglePersonState = useCallback(
    (name, value) => {
      dispatch(updatePersonData(index, name, value));
    },
    [index]
  );
  const companyState = useSelector(({ application }) => application.editApplication.company);
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application.companyData.entityNameSearch
  );
  const partners = useSelector(({ application }) => application.editApplication.partners);

  const { streetType, australianStates, countryList, newZealandStates } = useSelector(
    ({ application }) => application.companyData.dropdownData
  );
  const companyEntityType = useSelector(
    ({ application }) => application.applicationFilterList.dropdownData.companyEntityType
  );
  const [stateValue, setStateValue] = useState([]);
  useEffect(() => {
    dispatch(getApplicationFilter());
    dispatch(getApplicationCompanyDropDownData());
  }, []);

  const titleDropDown = useMemo(() => {
    const finalData = ['Mr', 'Mrs', 'Ms', 'Doctor', 'Miss', 'Professor'];

    return finalData.map(e => ({
      label: e,
      name: 'title',
      value: e,
    }));
  }, []);

  const INPUTS = [
    {
      type: 'radio',
      name: 'type',
      data: [
        {
          id: 'individual',
          label: 'Individual',
          value: 'individual',
        },
        {
          id: 'company',
          label: 'Company',
          value: 'company',
        },
      ],
    },
  ];

  const COMPANY_INPUT = [
    {
      type: 'blank',
    },
    {
      label: 'Trading Name',
      placeholder: 'Trading Name',
      type: 'text',
      name: 'tradingName',
      data: [],
    },
    {
      label: 'Entity Type*',
      placeholder: 'Select',
      type: 'select',
      name: 'entityType',
      data: companyEntityType,
    },
    {
      label: 'Entity Name*',
      placeholder: 'Enter Entity',
      type: 'entityName',
      name: 'entityName',
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
      label: 'ABN*',
      placeholder: '01234',
      type: 'search',
      name: 'abn',
      data: [],
    },
    {
      type: 'blank',
    },
  ];

  const INDIVIDUAL_INPUT = useMemo(
    () => [
      {
        label: 'Individual Details',
        placeholder: '',
        type: 'main-title',
        name: '',
        data: [],
      },
      {
        type: 'blank',
      },
      {
        label: 'Title*',
        placeholder: 'Select',
        type: 'select',
        name: 'title',
        data: titleDropDown,
      },
      {
        label: 'First Name*',
        placeholder: 'Enter first name',
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
        name: 'dateOfBirth',
      },
      {
        label:
          'Do you give your consent for us to check your credit history with external credit agencies?*',
        type: 'checkbox',
        name: 'allowToCheckCreditHistory',
      },
      {
        label: 'Identification Details',
        type: 'main-title',
      },
      {
        type: 'blank',
      },
      {
        label: 'Driver License Number*',
        placeholder: 'Enter driver license number',
        type: 'text',
        name: 'driverLicenceNumber',
      },
      {
        type: 'blank',
      },
      {
        label: 'Residential Details',
        type: 'main-title',
      },
      {
        type: 'blank',
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
        label: 'Street Name*',
        placeholder: 'Enter street Name',
        type: 'text',
        name: 'streetName',
        data: [],
      },
      {
        label: 'Street Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'streetType',
        data: streetType,
      },
      {
        label: 'Suburb*',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        data: [],
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList,
      },
      {
        label: 'Postcode*',
        placeholder: 'Enter postcode',
        type: 'text',
        name: 'postCode',
      },
      {
        label: 'State*',
        placeholder: 'Select',
        type: 'select',
        name: 'state',
        data: stateValue,
      },
      {
        label: 'Contact Details',
        type: 'main-title',
      },
      {
        type: 'blank',
      },
      {
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'phoneNumber',
      },
      {
        label: 'Mobile',
        placeholder: '1234567890',
        type: 'text',
        name: 'mobileNumber',
      },
      {
        label: 'Email',
        placeholder: 'Enter email address',
        type: 'email',
        name: 'email',
      },
    ],
    [stateValue]
  );

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSinglePersonState(name, value);
    },
    [updateSinglePersonState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      updateSinglePersonState(data[0]?.name, data);
      if (data[0]?.name === 'country') {
        if (data[0]?.value === 'AUS') {
          setStateValue(australianStates);
        } else if (data[0]?.value === 'NZL') {
          setStateValue(newZealandStates);
        } else {
          updateSinglePersonState('state', []);
        }
      }
    },
    [updateSinglePersonState, setStateValue, australianStates, newZealandStates]
  );
  const updatePersonState = useCallback(data => {
    dispatch(updatePersonStepDataOnValueSelected(index, data));
  }, []);

  const handleRadioButton = e => {
    const partner = e.target.value;
    dispatch(changePersonType(index, partner));
  };

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
          updatePersonState(response);
          handleToggleDropdown();
        }
      } catch (err) {
        /**/
      }
      handleToggleDropdown(false);
    },
    [companyState, updatePersonState, handleToggleDropdown]
  );

  const handleEntityNameSearch = useCallback(
    e => {
      if (e.key === 'Enter') {
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        const params = { clientId: companyState.clientId[0].value };
        dispatch(searchApplicationCompanyEntityName(e.target.value, params));
      }
    },
    [companyState, dispatchDrawerState, updatePersonState]
  );
  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        const params = { clientId: companyState.clientId[0].value };
        const response = await getApplicationCompanyDataFromABNOrACN(e.target.value, params);
        if (response) {
          updatePersonState(response);
        }
      }
    },
    [companyState, updatePersonState]
  );

  const handleCheckBoxEvent = useCallback(
    e => {
      const checkBoxName = e.target.name;
      const value = e.target.checked;
      updateSinglePersonState(checkBoxName, value);
    },
    [updateSinglePersonState]
  );
  const onChangeDate = useCallback(
    (name, date) => {
      updateSinglePersonState(name, date);
    },
    [updateSinglePersonState]
  );
  const handleEmailChange = useCallback(
    e => {
      const email = e.target.name;
      const { value } = e.target;
      updateSinglePersonState(email, value);
    },
    [updateSinglePersonState]
  );

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              placeholder={input.placeholder}
              name={input.name}
              value={partners[index][input.name]}
              onChange={handleTextInputChange}
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'email':
          component = (
            <Input
              type="email"
              placeholder={input.placeholder}
              name={input.name}
              onChange={handleEmailChange}
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={partners[index][input.name]}
              onKeyDown={handleSearchTextInputKeyDown}
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'select':
          component = (
            <ReactSelect
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              values={
                (partners && partners[index][input.name] && partners[index][input.name]) || []
              }
              searchable
              onChange={handleSelectInputChange}
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'checkbox':
          component = (
            <Checkbox
              className="grid-checkbox"
              name={input.name}
              title={input.label}
              onChange={handleCheckBoxEvent}
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              /* value={partners?.[index]?.entityName?.[0]?.label} */
              disabled={partners[index].isDisabled || false}
            />
          );
          break;
        case 'radio':
          component = (
            <div className="radio-container">
              {input.data.map(radio => (
                <RadioButton
                  className="mb-5"
                  id={radio.id + index.toString()}
                  name={radio.name}
                  value={radio.value}
                  checked={partners[index].type === radio.value}
                  label={radio.label}
                  onChange={handleRadioButton}
                  disabled={partners[index].isDisabled || false}
                />
              ))}
            </div>
          );
          break;
        case 'main-title':
          component = <div className="main-title">{input.label}</div>;
          break;
        case 'blank':
          component = (
            <>
              <span />
              <span />
            </>
          );
          break;
        case 'date':
          component = (
            <div className="date-picker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                placeholderText={input.placeholder}
                selected={partners[index].dateOfBirth && new Date(partners[index].dateOfBirth)}
                onChange={date => onChangeDate(input.name, date)}
                disabled={partners[index].isDisabled || false}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                maxDate={new Date()}
              />
              <span className="material-icons-round">event_available</span>
            </div>
          );
          break;
        default:
          return null;
      }

      const finalComponent = (
        <>
          {component}
          {partners && partners[index] ? (
            <div className="ui-state-error">
              {partners && partners[index] && partners[index]?.errors
                ? partners[index]?.errors?.[input?.name]
                : ''}
            </div>
          ) : (
            ''
          )}
        </>
      );

      return (
        <>
          {!['main-title', 'checkbox', 'blank', 'radio'].includes(input.type) && (
            <span>{input.label}</span>
          )}
          {['main-title', 'radio', 'blank', 'checkbox'].includes(input.type) ? (
            finalComponent
          ) : (
            <div>{finalComponent}</div>
          )}
        </>
      );
    },
    [
      INPUTS,
      COMPANY_INPUT,
      INDIVIDUAL_INPUT,
      index,
      partners,
      onChangeDate,
      handleEntityNameSearch,
      handleCheckBoxEvent,
      handleSelectInputChange,
      handleEmailChange,
      handleTextInputChange,
    ]
  );
  const deletePartner = e => {
    e.stopPropagation();
    if (index <= 1 && entityTypeFromCompany === 'PARTNERSHIP') {
      errorNotification('You can not remove partner');
    } else if (index < 1) {
      errorNotification('You can not remove every partner');
    } else {
      dispatch(removePersonDetail(index));
    }
    successNotification('Partner deleted successfully');
  };

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
      <AccordionItem
        className="application-person-step-accordion"
        header={itemHeader || 'Director Details'}
        prefix="expand_more"
        suffix="delete_outline"
        suffixClass="material-icons-round font-danger cursor-pointer"
        suffixClick={e => deletePartner(e)}
      >
        <div className="application-person-step-accordion-item">
          {hasRadio && INPUTS.map(getComponentFromType)}
          {partners[index] &&
            (hasRadio && partners[index].type === 'company'
              ? COMPANY_INPUT.map(getComponentFromType)
              : INDIVIDUAL_INPUT.map(getComponentFromType))}
        </div>
      </AccordionItem>
    </>
  );
};
PersonIndividualDetail.propTypes = {
  itemHeader: PropTypes.string.isRequired,
  hasRadio: PropTypes.bool,
  index: PropTypes.number.isRequired,
  entityTypeFromCompany: PropTypes.string,
};
PersonIndividualDetail.defaultProps = {
  hasRadio: false,
  entityTypeFromCompany: '',
};

export default PersonIndividualDetail;

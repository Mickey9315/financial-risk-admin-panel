import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';

import AccordionItem from '../../../../../../common/Accordion/AccordionItem';
import Input from '../../../../../../common/Input/Input';
import Checkbox from '../../../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../../../common/RadioButton/RadioButton';
import {
  changePersonType,
  getApplicationPersonDataFromABNOrACN,
  removePersonDetail,
  resetEntityTableData,
  searchApplicationCompanyEntityName,
  updatePersonData,
  updatePersonStepDataOnValueSelected,
  wipeOutIndividualPerson,
} from '../../../../redux/ApplicationAction';
import { DRAWER_ACTIONS } from '../../ApplicationCompanyStep/ApplicationCompanyStep';
import Loader from '../../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../../common/Modal/Modal';
import { errorNotification, successNotification } from '../../../../../../common/Toast';
import IconButton from '../../../../../../common/IconButton/IconButton';
import Select from '../../../../../../common/Select/Select';
import { ALPHA_NEUMERIC_REGEX } from '../../../../../../constants/RegexConstants';

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
const PersonIndividualDetail = ({ itemHeader, index, entityTypeFromCompany, activePersonStep }) => {
  const dispatch = useDispatch();
  const updateSinglePersonState = useCallback(
    (name, value) => {
      dispatch(updatePersonData(index, name, value));
    },
    [index]
  );
  const companyState = useSelector(
    ({ application }) => application?.editApplication?.company ?? {}
  );
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application?.companyData?.entityNameSearch ?? {}
  );
  const partners = useSelector(({ application }) => application?.editApplication?.partners ?? []);

  const { streetType, australianStates, countryList, newZealandStates, companyEntityType } =
    useSelector(({ application }) => application?.companyData?.dropdownData ?? {});

  const [stateValue, setStateValue] = useState([]);
  const [isAusOrNew, setIsAusOrNew] = useState(false);
  const [isAusOrNewStakeHolder, setIsAusOrNewStakeHolder] = useState(false);

  const [searchedEntityNameValue, setSearchedEntityNameValue] = useState(''); // retry ABN lookup

  const [currentPage, setCurrentPage] = useState(0);

  const prevRef = useRef({});

  useEffect(() => {
    const country = partners?.[index]?.country?.value ?? '';
    const stakeHolderCountry = partners?.[index]?.stakeholderCountry?.value ?? '';
    let showDropDownInput = true;
    switch (country) {
      case 'AUS':
      case 'NZL':
        setStateValue(country === 'AUS' ? australianStates : newZealandStates);
        break;
      default:
        showDropDownInput = false;
        break;
    }
    switch (stakeHolderCountry) {
      case 'AUS':
      case 'NZL':
        setIsAusOrNewStakeHolder(true);
        break;
      default:
        setIsAusOrNewStakeHolder(false);
        break;
    }

    setIsAusOrNew(showDropDownInput);
    if (!prevRef.current?.abn) {
      prevRef.current = { ...prevRef.current, abn: partners?.[index]?.abn };
    }
    if (!prevRef.current?.acn) {
      prevRef.current = { ...prevRef.current, acn: partners?.[index]?.acn };
    }
  }, [
    partners?.[index]?.country?.value,
    partners?.[index]?.stakeholderCountry?.value,
    prevRef,
    australianStates,
    newZealandStates,
  ]);

  const {
    type,
    abn,
    acn,
    entityType,
    entityName,
    tradingName,
    title,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    driverLicenceNumber,
    phoneNumber,
    mobileNumber,
    email,
    allowToCheckCreditHistory,
    unitNumber,
    streetNumber,
    streetName,
    suburb,
    state,
    country,
    stakeholderCountry,
    postCode,
    registrationNumber,
  } = useMemo(() => partners?.[index], [partners?.[index]]);

  const titleDropDown = useMemo(() => {
    const finalData = ['Mr', 'Mrs', 'Ms', 'Doctor', 'Miss', 'Professor'];

    return finalData.map(e => ({
      label: e,
      name: 'title',
      value: e,
    }));
  }, []);

  const RADIO_INPUTS = [
    {
      type: 'radio',
      name: 'type',
      data: [
        {
          id: 'individual',
          label: 'Individual',
          value: 'individual',
        },
      ],
    },
  ];

  const INPUTS = useMemo(() => {
    if (companyState?.entityType?.value !== 'SOLE_TRADER') {
      RADIO_INPUTS[0].data.push({ id: 'company', label: 'Company', value: 'company' });
      return RADIO_INPUTS;
    }
    return RADIO_INPUTS;
  }, [companyState?.entityType?.value]);

  const COMPANY_INPUT = useMemo(
    () => [
      {
        type: 'blank',
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'stakeholderCountry',
        data: countryList,
        value: stakeholderCountry ?? [],
      },
      {
        label: 'Entity Name*',
        placeholder: 'Enter Entity',
        type: 'entityName',
        name: 'entityName',
        value: entityName?.label ?? entityName ?? '',
        data: [],
      },
      {
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        value: tradingName ?? '',
        data: [],
      },
      {
        label: 'ABN/NZBN*',
        placeholder: '01234',
        type: 'search',
        name: 'abn',
        value: abn ?? '',
        data: [], 
        isOr: true
      },
      {
        label: 'Entity Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        value: entityType ?? [],
        data: companyEntityType ?? [],
      },
      {
        label: 'ACN/NCN*',
        placeholder: '01234',
        type: 'search',
        name: 'acn',
        value: acn ?? '',
        data: [],
      },
    ],
    [
      type,
      abn,
      acn,
      entityType,
      entityName,
      tradingName,
      companyEntityType,
      countryList,
      stakeholderCountry,
    ]
  );
  const FINAL_COMPANY_INPUTS = useMemo(() => {
    if (isAusOrNewStakeHolder) {
      return [...COMPANY_INPUT];
    }
    const filteredData = [...COMPANY_INPUT];
    filteredData.splice(4, 1, {
      label: 'Company Registration No.*',
      placeholder: 'Registration no',
      type: 'text',
      name: 'registrationNumber',
      value: registrationNumber,
    });
    filteredData.splice(6, 1);
    return filteredData;
  }, [COMPANY_INPUT, isAusOrNewStakeHolder, registrationNumber]);

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
        value: title || titleDropDown?.find(e => e?.value === title) || [],
        data: titleDropDown || [],
      },
      {
        label: 'First Name*',
        placeholder: 'Enter first name',
        type: 'text',
        name: 'firstName',
        value: firstName ?? '',
      },
      {
        label: 'Middle Name',
        placeholder: 'Enter middle name',
        type: 'text',
        name: 'middleName',
        value: middleName ?? '',
      },
      {
        label: 'Last Name*',
        placeholder: 'Enter last name',
        type: 'text',
        name: 'lastName',
        value: lastName ?? '',
      },
      {
        label: 'Date of Birth*',
        placeholder: 'Select date',
        type: 'date',
        name: 'dateOfBirth',
        value: dateOfBirth ?? '',
      },
      {
        label:
          'Do you give your consent for us to check your credit history with external credit agencies?',
        type: 'checkbox',
        name: 'allowToCheckCreditHistory',
        value: allowToCheckCreditHistory ?? false,
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
        value: driverLicenceNumber ?? '',
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
        value: unitNumber ?? '',
      },
      {
        label: 'Street Number*',
        placeholder: 'Street number',
        type: 'text',
        name: 'streetNumber',
        data: [],
        value: streetNumber ?? '',
      },
      {
        label: 'Street Name',
        placeholder: 'Enter street Name',
        type: 'text',
        name: 'streetName',
        data: [],
        value: streetName ?? '',
      },
      {
        label: 'Street Type',
        placeholder: 'Select',
        type: 'select',
        name: 'streetType',
        data: streetType || [],
        value: partners?.[index]?.streetType ?? [],
      },
      {
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        data: [],
        value: suburb ?? '',
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList || [],
        value: country ?? [],
      },
      {
        label: 'Postcode*',
        placeholder: 'Enter postcode',
        type: 'text',
        name: 'postCode',
        value: postCode ?? '',
      },
      {
        label: 'State*',
        placeholder: isAusOrNew ? 'Select' : 'Enter State',
        type: isAusOrNew ? 'select' : 'text',
        name: 'state',
        data: stateValue || [],
        value: isAusOrNew ? state ?? [] : state ?? '',
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
        value: phoneNumber ?? '',
      },
      {
        label: 'Mobile',
        placeholder: '1234567890',
        type: 'text',
        name: 'mobileNumber',
        value: mobileNumber ?? '',
      },
      {
        label: 'Email',
        placeholder: 'Enter email address',
        type: 'email',
        name: 'email',
        value: email ?? '',
      },
    ],
    [
      isAusOrNew,
      stateValue,
      titleDropDown,
      countryList,
      title,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      driverLicenceNumber,
      phoneNumber,
      mobileNumber,
      email,
      allowToCheckCreditHistory,
      unitNumber,
      streetNumber,
      streetName,
      suburb,
      state,
      country,
      postCode,
      partners?.[index],
      streetType,
    ]
  );

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      if(name === 'driverLicenceNumber' && value.toString().trim().length > 0) {
        if(ALPHA_NEUMERIC_REGEX.test(value)) {
          updateSinglePersonState(name, value);
        }
      }
     else {
      updateSinglePersonState(name, value);
     }
    },
    [updateSinglePersonState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      if (data.name === 'country' && partners?.[index]?.type === 'company') {
        const { label, value } = data;
        updateSinglePersonState('stakeholderCountry', { label, name: 'stakeholderCountry', value });
      } else if (data.name === 'country' && partners?.[index]?.type === 'individual') {
        if (['AUS', 'NZL'].includes(data.value)) updateSinglePersonState('state', []);
        else updateSinglePersonState('state', '');
        updateSinglePersonState(data?.name, data);
      } else updateSinglePersonState(data?.name, data);
    },
    [updateSinglePersonState, partners?.[index]?.type]
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

  const onCloseEntityTableModal = useCallback(() => {
    handleToggleDropdown(false);
    setCurrentPage(0);
    setSearchedEntityNameValue('');
    dispatch(resetEntityTableData());
  }, []);

  const handleEntityNameSelect = useCallback(
    async data => {
      try {
        const params = {
          searchString: data?.abn,
          clientId: companyState?.clientId?.value,
          country: partners?.[index]?.stakeholderCountry?.value,
        };
        const response = await dispatch(getApplicationPersonDataFromABNOrACN(params));
        if (response) {
          updatePersonState(response);
          prevRef.current = {
            ...prevRef.current,
            acn: response?.acn,
            abn: response?.abn,
          };
          onCloseEntityTableModal();
        }
      } catch {
        /**/
      }
    },
    [
      companyState?.clientId?.value,
      partners?.[index]?.stakeholderCountry?.value,
      updatePersonState,
      onCloseEntityTableModal,
      prevRef.current,
    ]
  );

  const handleEntityNameOnSearchClick = useCallback(
    ref => {
      if (!isAusOrNewStakeHolder) return;
      if (
        !partners?.[index]?.stakeholderCountry ||
        partners?.[index]?.stakeholderCountry?.length === 0
      ) {
        errorNotification('Please select country before continue');
        return;
      }
      if (ref?.value.toString().trim().length > 0) {
        try {
          dispatchDrawerState({
            type: DRAWER_ACTIONS.SHOW_DRAWER,
            data: null,
          });
          setSearchedEntityNameValue(ref?.value.toString());
          const params = {
            searchString: ref?.value,
            clientId: companyState?.clientId?.value,
            country: partners?.[index]?.stakeholderCountry?.value,
            page: currentPage,
            step: 'person',
          };
          dispatch(searchApplicationCompanyEntityName(params));
        } catch (e) {
          /**/
        }
      } else {
        errorNotification('Please enter search text for entity name');
      }
    },
    [
      companyState?.clientId?.value,
      partners?.[index]?.stakeholderCountry?.value,
      dispatchDrawerState,
      updatePersonState,
      setSearchedEntityNameValue,
      currentPage,
      isAusOrNewStakeHolder,
    ]
  );

  const handleEntityNameSearch = useCallback(
    e => {
      if (e.key === 'Enter') {
        if (!isAusOrNewStakeHolder) return;
        if (
          !partners?.[index]?.stakeholderCountry ||
          partners?.[index]?.stakeholderCountry?.length === 0
        ) {
          errorNotification('Please select country before continue');
          return;
        }
        if (e?.target?.value.toString().trim().length > 0) {
          try {
            dispatchDrawerState({
              type: DRAWER_ACTIONS.SHOW_DRAWER,
              data: null,
            });
            setSearchedEntityNameValue(e.target.value.toString());
            const params = {
              searchString: e?.target?.value,
              clientId: companyState?.clientId?.value,
              country: partners?.[index]?.stakeholderCountry?.value,
              page: currentPage,
              step: 'person',
            };
            dispatch(searchApplicationCompanyEntityName(params));
          } catch (err) {
            /**/
          }
        } else {
          errorNotification('Please enter search text for entity name');
        }
      }
    },
    [
      companyState?.clientId,
      partners?.[index]?.stakeholderCountry?.value,
      dispatchDrawerState,
      updatePersonState,
      setSearchedEntityNameValue,
      currentPage,
      isAusOrNewStakeHolder,
    ]
  );

  const retryEntityNameRequest = useCallback(async () => {
    if (searchedEntityNameValue.trim().length > 0) {
      if (
        !partners?.[index]?.stakeholderCountry ||
        partners?.[index]?.stakeholderCountry?.length === 0
      ) {
        errorNotification('Please select country before continue');
        return;
      }
      try {
        const params = {
          searchString: searchedEntityNameValue,
          clientId: companyState?.clientId?.value,
          country: partners?.[index]?.stakeholderCountry?.value,
          page: currentPage,
          step: 'person',
        };
        await dispatch(searchApplicationCompanyEntityName(params));
      } catch (e) {
        /**/
      }
    }
  }, [
    searchedEntityNameValue,
    companyState?.clientId,
    partners?.[index]?.stakeholderCountry?.value,
    currentPage,
  ]);

  const handleSearchTextOnSearchClick = useCallback(
    async ref => {
      if (
        !partners?.[index]?.stakeholderCountry ||
        partners?.[index]?.stakeholderCountry?.length === 0
      ) {
        errorNotification('Please select country before continue');
        return;
      }
      if (ref?.value?.trim()?.length > 0) {
        try {
          const params = {
            searchString: ref?.value,
            clientId: companyState?.clientId?.value,
            country: partners?.[index]?.stakeholderCountry?.value,
          };
          const response = await dispatch(getApplicationPersonDataFromABNOrACN(params));

          if (response) {
            updatePersonState(response);
            prevRef.current = {
              ...prevRef.current,
              acn: response?.acn,
              abn: response?.abn,
            };
          }
        } catch {
          let value = prevRef?.current?.abn;
          if (ref?.name === 'acn') value = prevRef?.current?.acn;
          updateSinglePersonState(ref?.name, value);
        }
      } else {
        errorNotification(`Please enter search text for ${ref?.name}`);
      }
    },
    [
      partners?.[index]?.stakeholderCountry?.value,
      companyState?.clientId?.value,
      updatePersonState,
      updateSinglePersonState,
      prevRef.current,
    ]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        if (
          !partners?.[index]?.stakeholderCountry ||
          partners?.[index]?.stakeholderCountry?.length === 0
        ) {
          errorNotification('Please select country before continue');
          return;
        }
        if (e?.target?.value?.trim()?.length > 0) {
          try {
            const params = {
              searchString: e?.target?.value,
              clientId: companyState?.clientId?.value,
              country: partners?.[index]?.stakeholderCountry?.value,
            };
            const response = await dispatch(getApplicationPersonDataFromABNOrACN(params));

            if (response) {
              updatePersonState(response);
              prevRef.current = {
                ...prevRef.current,
                acn: response?.acn,
                abn: response?.abn,
              };
            }
          } catch {
            let value = prevRef?.current?.abn;
            if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
            updateSinglePersonState(e?.target?.name, value);
          }
        } else {
          errorNotification(`Please enter search text for ${e?.target?.name}`);
        }
      }
    },
    [
      partners?.[index]?.stakeholderCountry?.value,
      companyState?.clientId?.value,
      updatePersonState,
      updateSinglePersonState,
      prevRef.current,
    ]
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
      updateSinglePersonState(e.target.name, e.target.value);
    },
    [updateSinglePersonState]
  );

  const handleEntityChange = useCallback(
    event => {
      const { name, value } = event.target;
      const data = {
        label: value,
        value,
      };
      updateSinglePersonState(name, data);
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
              value={input?.value || ''}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'email':
          component = (
            <Input
              type="email"
              placeholder={input.placeholder}
              name={input.name}
              value={input?.value || ''}
              onChange={handleEmailChange}
            />
          );
          break;
        case 'search':
          component = (
            <div className={input?.isOr && 'application-input-or is-or-person-step'}>
            <Input
              type="text"
              name={input.name}
              suffix="search"
              suffixClick={handleSearchTextOnSearchClick}
              suffixClass="application-search-suffix"
              placeholder={input.placeholder}
              value={input?.value || ''}
              onKeyDown={handleSearchTextInputKeyDown}
              onChange={handleTextInputChange}
            />
            </div>
          );
          break;
        case 'select':
          component = (
            <Select
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              value={input?.value ?? []}
              isSearchable
              onChange={handleSelectInputChange}
            />
          );
          break;
        case 'checkbox':
          component = (
            <Checkbox
              className="grid-checkbox"
              name={input.name}
              title={input.label}
              checked={input?.value}
              onChange={handleCheckBoxEvent}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              name={input.name}
              suffix="search"
              suffixClass="application-search-suffix"
              suffixClick={handleEntityNameOnSearchClick}
              borderClass={input?.isOr && 'is-or-container'}
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              value={input?.value || ''}
              onChange={handleEntityChange}
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
                  checked={partners?.[index]?.type === radio.value}
                  label={radio.label}
                  onChange={handleRadioButton}
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
                selected={
                  partners?.[index]?.dateOfBirth && new Date(partners?.[index]?.dateOfBirth)
                }
                onChange={date => onChangeDate(input.name, date)}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                maxDate={new Date()}
                popperProps={{ positionFixed: true }}
              />
              <span className="material-icons-round">event</span>
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
              {partners && partners?.[index] && partners?.[index]?.errors
                ? partners?.[index]?.errors?.[input?.name]
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
      FINAL_COMPANY_INPUTS,
      INDIVIDUAL_INPUT,
      index,
      partners,
      onChangeDate,
      handleEntityNameSearch,
      handleCheckBoxEvent,
      handleSelectInputChange,
      handleEmailChange,
      handleTextInputChange,
      handleEntityChange,
      handleSearchTextInputKeyDown,
    ]
  );
  const deletePartner = useCallback(
    e => {
      e.stopPropagation();
      if (partners?.length <= 2 && entityTypeFromCompany === 'PARTNERSHIP') {
        errorNotification('Partner can not be removed.');
      } else if (partners?.length <= 1) {
        errorNotification('Every partner/trust/sole trader can not be removed.');
      } else if (partners?.[index]?._id) {
        dispatch(wipeOutIndividualPerson(partners?.[index]?._id, index));
      } else {
        dispatch(removePersonDetail(index));
        successNotification('Partner deleted successfully');
      }
    },
    [partners, entityTypeFromCompany, companyState?.debtorId?.value, index]
  );

  const getSuffixItem = useMemo(() => {
    return 'delete_outline';
  }, []);

  return (
    <>
      {drawerState.visible && (
        <Modal
          hideModal={onCloseEntityTableModal}
          className="application-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchDropDownData?.isLoading ? (
            <Loader />
          ) : (
            !entityNameSearchDropDownData?.error &&
            (entityNameSearchDropDownData?.data?.length > 0 ? (
              <ApplicationEntityNameTable
                data={entityNameSearchDropDownData?.data}
                handleEntityNameSelect={handleEntityNameSelect}
                selectedCountry={partners?.[index]?.stakeholderCountry?.value}
                setCurrentPage={setCurrentPage}
                requestNewPage={retryEntityNameRequest}
                hasMoreRecords={entityNameSearchDropDownData?.hasMoreData}
              />
            ) : (
              <div className="no-record-found">No record found</div>
            ))
          )}
          {entityNameSearchDropDownData?.error && (
            <>
              <div className="application-entity-name-modal-retry-button">
                {entityNameSearchDropDownData?.errorMessage}
              </div>
              <div className="application-entity-name-modal-retry-button">
                <IconButton
                  buttonType="primary"
                  title="refresh"
                  onClick={() => retryEntityNameRequest()}
                />
              </div>
            </>
          )}
        </Modal>
      )}
      <AccordionItem
        index={index}
        isExpanded
        setOpenIndex={activePersonStep}
        className="application-person-step-accordion"
        header={itemHeader ?? 'Director Details'}
        prefix="expand_more"
        suffix={getSuffixItem}
        suffixClass="material-icons-round font-danger cursor-pointer"
        suffixClick={e => deletePartner(e)}
      >
        <div className="application-person-step-accordion-item">
          {INPUTS.map(getComponentFromType)}
          {partners?.[index]?.type === 'company'
            ? FINAL_COMPANY_INPUTS.map(getComponentFromType)
            : INDIVIDUAL_INPUT.map(getComponentFromType)}
        </div>
      </AccordionItem>
    </>
  );
};
PersonIndividualDetail.propTypes = {
  itemHeader: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  entityTypeFromCompany: PropTypes.string,
  activePersonStep: PropTypes.number,
};
PersonIndividualDetail.defaultProps = {
  entityTypeFromCompany: '',
  activePersonStep: undefined,
};

export default PersonIndividualDetail;

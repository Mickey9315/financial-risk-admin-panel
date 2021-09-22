import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import IconButton from '../../../../common/IconButton/IconButton';
import BigInput from '../../../../common/BigInput/BigInput';
import Table, { TABLE_ROW_ACTIONS } from '../../../../common/Table/Table';
import Pagination from '../../../../common/Pagination/Pagination';
import CustomFieldModal from '../../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../../common/Loader/Loader';
import { errorNotification } from '../../../../common/Toast';
import {
  changeDebtorStakeHolderColumnListStatus,
  changeStakeHolderPersonType,
  deleteStakeHolderDetails,
  getDebtorStakeHolderColumnNameList,
  getDebtorStakeHolderListData,
  getstakeholderCountryDataFromABNorACN,
  getStakeHolderDetails,
  getStakeHolderDropDownData,
  resetEntityTableData,
  saveDebtorStakeHolderColumnNameList,
  searchstakeholderCountryEntityName,
  updateStakeHolderDataOnValueSelected,
  updateStakeHolderDetail,
} from '../../redux/DebtorsAction';
import Button from '../../../../common/Button/Button';
import Modal from '../../../../common/Modal/Modal';
import Input from '../../../../common/Input/Input';
import Checkbox from '../../../../common/Checkbox/Checkbox';
import RadioButton from '../../../../common/RadioButton/RadioButton';
import { stakeHolderValidation } from './StakeHolderValidation';
import { DRAWER_ACTIONS } from '../../../Application/GenerateApplication/component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationEntityNameTable from '../../../Application/GenerateApplication/component/components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import { DEBTORS_REDUX_CONSTANTS } from '../../redux/DebtorsReduxConstants';
import Select from '../../../../common/Select/Select';

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

const DebtorsStakeHolderTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchInputRef = useRef();

  const [currentPage, setCurrentPage] = useState(0);
  const [isAusOrNewStakeHolder, setIsAusOrNewStakeHolder] = useState(false);

  const {
    stakeHolderList,
    debtorsStakeHolderColumnNameList,
    debtorsStakeHolderDefaultColumnNameList,
  } = useSelector(({ debtorsManagement }) => debtorsManagement?.stakeHolder ?? {});

  const {
    viewDebtorStakeHolderColumnSaveButtonLoaderAction,
    viewDebtorStakeHolderColumnResetButtonLoaderAction,
    viewDebtorAddNewStakeHolderButtonLoaderAction,
    viewDebtorUpdateStakeHolderButtonLoaderAction,
    viewDebtorDeleteStakeHolderButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => stakeHolderList ?? {},
    [stakeHolderList]
  );

  const getDebtorStakeHolderList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getDebtorStakeHolderListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, id]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getDebtorStakeHolderList({ page: 1, limit: newLimit });
    },
    [getDebtorStakeHolderList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getDebtorStakeHolderList({ page: newPage, limit });
    },
    [limit, getDebtorStakeHolderList]
  );

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeDebtorStakeHolderColumnListStatus(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    try {
      await dispatch(saveDebtorStakeHolderColumnNameList({ isReset: true }));
      dispatch(getDebtorStakeHolderColumnNameList());
      getDebtorStakeHolderList();
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getDebtorStakeHolderList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        debtorsStakeHolderColumnNameList,
        debtorsStakeHolderDefaultColumnNameList
      );
      if (!isBothEqual) {
        await dispatch(saveDebtorStakeHolderColumnNameList({ debtorsStakeHolderColumnNameList }));
        getDebtorStakeHolderList();
      } else {
        errorNotification('Please select different columns to apply changes.');
        throw Error();
      }
      toggleCustomField();
    } catch (e) {
      /**/
    }
  }, [
    toggleCustomField,
    debtorsStakeHolderColumnNameList,
    debtorsStakeHolderDefaultColumnNameList,
    getDebtorStakeHolderList,
  ]);

  const onClickCloseColumnSelection = useCallback(() => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION,
      data: debtorsStakeHolderDefaultColumnNameList,
    });
    toggleCustomField();
  }, [debtorsStakeHolderDefaultColumnNameList, toggleCustomField]);

  const { defaultFields, customFields } = useMemo(
    () => debtorsStakeHolderColumnNameList ?? { defaultFields: [], customFields: [] },
    [debtorsStakeHolderColumnNameList]
  );

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: viewDebtorStakeHolderColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: viewDebtorStakeHolderColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseColumnSelection,
      onClickSaveColumnSelection,
      viewDebtorStakeHolderColumnResetButtonLoaderAction,
      viewDebtorStakeHolderColumnSaveButtonLoaderAction,
    ]
  );

  // Add stakeHolder

  const titleDropDown = useMemo(() => {
    const finalData = ['Mr', 'Mrs', 'Ms', 'Doctor', 'Miss', 'Professor'];

    return finalData.map(e => ({
      label: e,
      name: 'title',
      value: e,
    }));
  }, []);

  const { entityType, ...debtorData } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.selectedDebtorData ?? {}
  );

  const entityNameSearchedData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder?.entityNameSearch ?? {}
  );

  const stakeHolder = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder?.stakeHolderDetails ?? {}
  );

  const { streetType, australianStates, companyEntityType, countryList, newZealandStates } =
    useSelector(
      ({ debtorsManagement }) => debtorsManagement?.stakeHolder?.stakeHolderDropDownData ?? {}
    );

  const [addStakeHolderModal, setAddStakeHolderModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const toggleAddStakeHolderModal = useCallback(
    value => setAddStakeHolderModal(value !== undefined ? value : e => !e),
    [setAddStakeHolderModal]
  );

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [searchedEntityNameValue, setSearchedEntityNameValue] = useState(''); // retry ABN lookup

  const [stateValue, setStateValue] = useState([]);
  const [isAusOrNew, setIsAusOrNew] = useState(false);

  const prevRef = useRef({});

  useEffect(() => {
    const country = stakeHolder?.country?.value ?? '';
    const stakeHolderCountry = stakeHolder?.stakeholderCountry?.value ?? '';
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
      prevRef.current = { ...prevRef.current, abn: stakeHolder?.abn };
    }
    if (!prevRef.current?.acn) {
      prevRef.current = { ...prevRef.current, acn: stakeHolder?.acn };
    }
  }, [
    stakeHolder?.country?.value,
    stakeHolder?.stakeholderCountry?.value,
    prevRef,
    australianStates,
    newZealandStates,
  ]);

  useEffect(() => {
    dispatch(getStakeHolderDropDownData());
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
    if (entityType?.value !== 'SOLE_TRADER') {
      RADIO_INPUTS[0].data.push({ id: 'company', label: 'Company', value: 'company' });
      return RADIO_INPUTS;
    }
    return RADIO_INPUTS;
  }, [entityType?.value]);

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
        value: stakeHolder?.stakeholderCountry,
      },
      {
        label: 'Entity Name*',
        placeholder: 'Enter Entity',
        type: 'entityName',
        name: 'entityName',
        value: stakeHolder?.entityName?.value,
      },
      {
        label: 'Entity Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: companyEntityType ?? [],
        value: stakeHolder?.entityType,
      },
      {
        label: 'ABN/NZBN*',
        placeholder: '01234',
        type: 'search',
        name: 'abn',
        value: stakeHolder?.abn,
      },
      {
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        value: stakeHolder?.tradingName,
      },
      {
        label: 'ACN/NCN',
        placeholder: '01234',
        type: 'search',
        name: 'acn',
        value: stakeHolder?.acn,
      },
      {
        type: 'blank',
      },
    ],
    [companyEntityType, stakeHolder]
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
      value: stakeHolder?.registrationNumber,
    });
    filteredData.splice(6, 1);
    return filteredData;
  }, [COMPANY_INPUT, isAusOrNewStakeHolder, stakeHolder?.registrationNumber]);

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
        data: titleDropDown || [],
        value:
          isEdit && typeof stakeHolder?.title === 'string'
            ? titleDropDown?.filter(title => title.value === stakeHolder?.title)
            : stakeHolder?.title,
      },
      {
        label: 'First Name*',
        placeholder: 'Enter first name',
        type: 'text',
        name: 'firstName',
        value: stakeHolder?.firstName,
      },
      {
        label: 'Middle Name',
        placeholder: 'Enter middle name',
        type: 'text',
        name: 'middleName',
        value: stakeHolder?.middleName,
      },
      {
        label: 'Last Name*',
        placeholder: 'Enter last name',
        type: 'text',
        name: 'lastName',
        value: stakeHolder?.lastName,
      },
      {
        label: 'Date of Birth',
        placeholder: 'Select date',
        type: 'date',
        name: 'dateOfBirth',
        value: stakeHolder?.dateOfBirth ? new Date(stakeHolder?.dateOfBirth) : '',
      },
      {
        label:
          'Do you give your consent for us to check your credit history with external credit agencies?',
        type: 'checkbox',
        name: 'allowToCheckCreditHistory',
        value: stakeHolder?.allowToCheckCreditHistory,
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
        value: stakeHolder?.driverLicenceNumber,
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
        value: stakeHolder?.unitNumber,
      },
      {
        label: 'Street Number*',
        placeholder: 'Street number',
        type: 'text',
        name: 'streetNumber',
        value: stakeHolder?.streetNumber,
      },
      {
        label: 'Street Name',
        placeholder: 'Enter street Name',
        type: 'text',
        name: 'streetName',
        value: stakeHolder?.streetName,
      },
      {
        label: 'Street Type',
        placeholder: 'Select',
        type: 'select',
        name: 'streetType',
        data: streetType || [],
        value: stakeHolder?.streetType,
      },
      {
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        value: stakeHolder?.suburb,
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList || [],
        value: stakeHolder?.country,
      },
      {
        label: 'Postcode*',
        placeholder: 'Enter postcode',
        type: 'text',
        name: 'postCode',
        value: stakeHolder?.postCode,
      },
      {
        label: 'State*',
        placeholder: isAusOrNew ? 'Select' : 'Enter State',
        type: isAusOrNew ? 'select' : 'text',
        name: 'state',
        data: stateValue || [],
        value: stakeHolder?.state,
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
        value: stakeHolder?.phoneNumber,
      },
      {
        label: 'Mobile',
        placeholder: '1234567890',
        type: 'text',
        name: 'mobileNumber',
        value: stakeHolder?.mobileNumber,
      },
      {
        label: 'Email',
        placeholder: 'Enter email address',
        type: 'email',
        name: 'email',
        value: stakeHolder?.email,
      },
    ],
    [isAusOrNew, stateValue, titleDropDown, countryList, streetType, stakeHolder, isEdit]
  );

  const updateStakeHolderSingleDetail = useCallback((name, value) => {
    dispatch(updateStakeHolderDetail(name, value));
  }, []);

  const updateStakeHolderState = useCallback(data => {
    dispatch(updateStakeHolderDataOnValueSelected(data));
  }, []);

  const handleRadioButton = useCallback(e => {
    const personType = e.target.value;
    dispatch(changeStakeHolderPersonType(personType));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateStakeHolderSingleDetail(name, value);
    },
    [updateStakeHolderSingleDetail]
  );

  const handleSelectInputChange = useCallback(
    data => {
      if (data.name === 'country' && stakeHolder?.type === 'company') {
        const { label, value } = data;
        updateStakeHolderSingleDetail('stakeholderCountry', {
          label,
          name: 'stakeholderCountry',
          value,
        });
      } else if (data.name === 'country' && stakeHolder?.type === 'individual') {
        if (['AUS', 'NZL'].includes(data.value)) updateStakeHolderSingleDetail('state', []);
        else updateStakeHolderSingleDetail('state', '');
        updateStakeHolderSingleDetail(data?.name, data);
      } else updateStakeHolderSingleDetail(data?.name, data);
    },
    [updateStakeHolderSingleDetail, stakeHolder?.type]
  );

  const handleCheckBoxEvent = useCallback(
    e => {
      updateStakeHolderSingleDetail(e.target.name, e.target.checked);
    },
    [updateStakeHolderSingleDetail]
  );

  const handleEntityChange = useCallback(
    event => {
      const { name, value } = event.target;
      const data = {
        label: value,
        value,
      };
      updateStakeHolderSingleDetail(name, data);
    },
    [updateStakeHolderSingleDetail]
  );
  const onChangeDate = useCallback(
    (name, value) => {
      updateStakeHolderSingleDetail(name, value);
    },
    [updateStakeHolderSingleDetail]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      if (e.key === 'Enter') {
        if (!stakeHolder?.stakeholderCountry || stakeHolder?.stakeholderCountry?.length === 0) {
          errorNotification('Please select country before continue');
          return;
        }
        if (e?.target?.value?.trim()?.length > 0) {
          try {
            const response = await dispatch(
              getstakeholderCountryDataFromABNorACN({
                searchString: e?.target?.value?.trim(),
                country: stakeHolder?.stakeholderCountry?.value,
              })
            );
            if (response) {
              if (e?.target?.name === 'abn') {
                prevRef.current.abn = response?.abn;
              } else {
                prevRef.current.acn = response?.acn;
              }
              updateStakeHolderState(response);
            }
          } catch {
            let value = prevRef?.current?.abn;
            if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
            updateStakeHolderSingleDetail(e?.target?.name, value);
          }
        } else {
          errorNotification(`Please enter search text for ${e?.target?.name}`);
        }
      }
    },
    [
      updateStakeHolderState,
      updateStakeHolderSingleDetail,
      prevRef.current,
      stakeHolder?.stakeholderCountry,
    ]
  );

  const handleSearchTextOnSearchClick = useCallback(
    async ref => {
      if (!stakeHolder?.stakeholderCountry || stakeHolder?.stakeholderCountry?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      if (ref?.value?.trim()?.length > 0) {
        try {
          const response = await dispatch(
            getstakeholderCountryDataFromABNorACN({
              searchString: ref.value?.trim(),
              country: stakeHolder?.stakeholderCountry?.value,
            })
          );
          if (response) {
            if (ref?.name === 'abn') {
              prevRef.current.abn = response?.abn;
            } else {
              prevRef.current.acn = response?.acn;
            }
            updateStakeHolderState(response);
          }
        } catch {
          let value = prevRef?.current?.abn;
          if (ref?.name === 'acn') value = prevRef?.current?.acn;
          updateStakeHolderSingleDetail(ref?.name, value);
        }
      } else {
        errorNotification(`Please enter search text for ${ref?.name}`);
      }
    },
    [
      updateStakeHolderState,
      updateStakeHolderSingleDetail,
      prevRef.current,
      stakeHolder?.stakeholderCountry,
    ]
  );

  const handleEntityNameSearch = useCallback(
    e => {
      if (e.key === 'Enter') {
        if (!stakeHolder?.stakeholderCountry || stakeHolder?.stakeholderCountry?.length === 0) {
          errorNotification('Please select country before continue');
          return;
        }
        if (!isAusOrNewStakeHolder) return;
        if (e?.target?.value?.trim()?.length > 0) {
          try {
            dispatchDrawerState({
              type: DRAWER_ACTIONS.SHOW_DRAWER,
              data: null,
            });
            setSearchedEntityNameValue(e?.target?.value?.trim()?.toString());
            dispatch(
              searchstakeholderCountryEntityName({
                searchString: e?.target?.value?.trim(),
                country: stakeHolder?.stakeholderCountry?.value,
                page: currentPage,
              })
            );
          } catch (err) {
            /**/
          }
        } else {
          errorNotification('Please enter search text for entity name');
        }
      }
    },
    [
      stakeHolder,
      dispatchDrawerState,
      setSearchedEntityNameValue,
      currentPage,
      isAusOrNewStakeHolder,
    ]
  );
  const handleEntityNameOnSearchClick = useCallback(
    ref => {
      if (!isAusOrNewStakeHolder) return;
      if (!stakeHolder?.stakeholderCountry || stakeHolder?.stakeholderCountry?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      if (ref?.value?.trim()?.length > 0) {
        try {
          dispatchDrawerState({
            type: DRAWER_ACTIONS.SHOW_DRAWER,
            data: null,
          });
          setSearchedEntityNameValue(ref?.value?.toString());
          dispatch(
            searchstakeholderCountryEntityName({
              searchString: ref.value?.trim(),
              country: stakeHolder?.stakeholderCountry?.value,
              page: currentPage,
            })
          );
        } catch (e) {
          /**/
        }
      } else {
        errorNotification('Please enter search text for entity name');
      }
    },
    [
      stakeHolder,
      dispatchDrawerState,
      setSearchedEntityNameValue,
      stakeHolder?.stakeholderCountry,
      currentPage,
      isAusOrNewStakeHolder,
    ]
  );

  const retryEntityNameRequest = useCallback(async () => {
    if (!isAusOrNewStakeHolder) return;
    if (searchedEntityNameValue.trim().length > 0) {
      if (!stakeHolder?.stakeholderCountry || stakeHolder?.stakeholderCountry?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      try {
        const params = {
          searchString: searchedEntityNameValue,
          country: stakeHolder?.stakeholderCountry?.value,
          page: currentPage,
        };
        await dispatch(searchstakeholderCountryEntityName(params));
      } catch (e) {
        /**/
      }
    }
  }, [
    searchedEntityNameValue,
    stakeHolder?.stakeholderCountry,
    currentPage,
    isAusOrNewStakeHolder,
  ]);

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
        const response = await dispatch(
          getstakeholderCountryDataFromABNorACN({
            searchString: data?.abn,
            country: stakeHolder?.stakeholderCountry?.value,
            page: currentPage,
          })
        );
        if (response) {
          prevRef.current.abn = response?.abn;
          prevRef.current.acn = response?.acn;
          updateStakeHolderState(response);
          onCloseEntityTableModal();
        }
      } catch {
        /**/
      }
    },
    [prevRef.current, stakeHolder, updateStakeHolderState, onCloseEntityTableModal, currentPage]
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
              value={input?.value ?? ''}
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
              value={input?.value ?? ''}
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
              suffix="search"
              suffixClass="application-search-suffix"
              suffixClick={handleSearchTextOnSearchClick}
              value={input?.value ?? ''}
              onKeyDown={handleSearchTextInputKeyDown}
              onChange={handleTextInputChange}
            />
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
              checked={input?.value ?? false}
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
              setIsEdit
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              value={input?.value ?? ''}
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
                  id={radio.id}
                  name={radio.name}
                  value={radio.value}
                  checked={stakeHolder?.type === radio.value}
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
                selected={input?.value}
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
          {stakeHolder && stakeHolder ? (
            <div className="ui-state-error">
              {stakeHolder && stakeHolder?.errors ? stakeHolder.errors?.[input?.name] : ''}
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
      stakeHolder,
      handleTextInputChange,
      handleSelectInputChange,
      handleCheckBoxEvent,
      handleRadioButton,
      onChangeDate,
      handleEntityChange,
      handleEntityNameOnSearchClick,
      handleSearchTextOnSearchClick,
    ]
  );

  const callBack = useCallback(() => {
    toggleAddStakeHolderModal();
    getDebtorStakeHolderList();
    setIsEdit(false);
  }, [getDebtorStakeHolderList, toggleAddStakeHolderModal, setIsEdit]);

  const onClickCancelStakeHolderModal = useCallback(() => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE,
    });
    toggleAddStakeHolderModal();
    setIsEdit(false);
  }, [setIsEdit, toggleAddStakeHolderModal]);

  const addStakeHolderModalButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCancelStakeHolderModal },
      {
        title: isEdit ? 'Save' : 'Add',
        buttonType: 'primary',
        onClick: () => stakeHolderValidation(dispatch, stakeHolder, debtorData, callBack, isEdit),
        isLoading: isEdit
          ? viewDebtorUpdateStakeHolderButtonLoaderAction
          : viewDebtorAddNewStakeHolderButtonLoaderAction,
      },
    ],
    [
      isEdit,
      onClickCancelStakeHolderModal,
      stakeHolderValidation,
      stakeHolder,
      debtorData,
      viewDebtorUpdateStakeHolderButtonLoaderAction,
      viewDebtorAddNewStakeHolderButtonLoaderAction,
    ]
  );

  useEffect(() => {
    dispatch(getDebtorStakeHolderColumnNameList());
  }, []);

  useEffect(() => {
    getDebtorStakeHolderList();
  }, [id]);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getDebtorStakeHolderList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getDebtorStakeHolderList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const deleteCallBack = useCallback(() => {
    setDeleteId('');
    toggleConfirmationModal();
    getDebtorStakeHolderList();
  }, [setDeleteId, toggleConfirmationModal, getDebtorStakeHolderList]);

  const deleteStakeHolderButton = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: async () => {
          try {
            await dispatch(deleteStakeHolderDetails(deleteId, () => deleteCallBack()));
          } catch (e) {
            /**/
          }
        },
        isLoading: viewDebtorDeleteStakeHolderButtonLoaderAction,
      },
    ],
    [
      toggleConfirmationModal,
      deleteId,
      deleteCallBack,
      viewDebtorDeleteStakeHolderButtonLoaderAction,
    ]
  );

  const onStakeHolderDelete = useCallback(
    stakeHolderId => {
      if (docs?.length <= 2 && entityType.label === 'Partnership') {
        errorNotification('StakeHolder can not be removed.');
      } else if (docs?.length <= 1) {
        errorNotification('Every StakeHolder cannot be removed.');
      } else {
        setDeleteId(stakeHolderId);
        toggleConfirmationModal();
      }
    },
    [toggleConfirmationModal, docs?.length]
  );

  const onSelectStakeHolderRecordActionClick = useCallback(
    async (type, _id) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        setIsEdit(true);
        await dispatch(getStakeHolderDetails(_id));
        toggleAddStakeHolderModal();
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        onStakeHolderDelete(_id);
      }
    },
    [setIsEdit, toggleAddStakeHolderModal, onStakeHolderDelete]
  );

  const onClickAddStakeHolder = useCallback(() => {
    dispatch(changeStakeHolderPersonType('individual'));
    dispatch(
      updateStakeHolderDetail('stakeholderCountry', {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      })
    );
    toggleAddStakeHolderModal();
  }, [toggleAddStakeHolderModal]);

  const addStakeHolderButton = useMemo(() => {
    if (entityType?.value === 'SOLE_TRADER') {
      if (docs?.length <= 0)
        return <Button buttonType="success" title="Add" onClick={onClickAddStakeHolder} />;
      return null;
    }
    return <Button buttonType="success" title="Add" onClick={onClickAddStakeHolder} />;
  }, [entityType?.value, docs, onClickAddStakeHolder]);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Stake Holder</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          {addStakeHolderButton}
        </div>
      </div>
      {!isLoading && docs ? (
        (() =>
          docs.length > 0 ? (
            <>
              <div className="tab-table-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="white-header-table"
                  data={docs}
                  headers={headers}
                  listFor={{ module: 'debtor' }}
                  recordActionClick={onSelectStakeHolderRecordActionClick}
                  refreshData={getDebtorStakeHolderList}
                  haveActions
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={buttons}
          toggleCustomField={toggleCustomField}
        />
      )}
      {addStakeHolderModal && (
        <Modal
          header={isEdit ? 'Edit Stake Holder' : 'Add StakeHolder'}
          className="add-debtor-stake-modal"
          buttons={addStakeHolderModalButton}
          // hideModal={toggleAddStakeHolderModal}
        >
          <div className="debtor-stakeholder-modal">
            {INPUTS.map(getComponentFromType)}
            {stakeHolder?.type === 'company'
              ? FINAL_COMPANY_INPUTS.map(getComponentFromType)
              : INDIVIDUAL_INPUT.map(getComponentFromType)}
          </div>
        </Modal>
      )}
      {drawerState.visible && (
        <Modal
          hideModal={onCloseEntityTableModal}
          className="application-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchedData?.isLoading ? (
            <Loader />
          ) : (
            !entityNameSearchedData?.error &&
            (entityNameSearchedData?.data?.length > 0 ? (
              <ApplicationEntityNameTable
                data={entityNameSearchedData?.data}
                handleEntityNameSelect={handleEntityNameSelect}
                selectedCountry={stakeHolder?.stakeholderCountry?.value}
                setCurrentPage={setCurrentPage}
                requestNewPage={retryEntityNameRequest}
                hasMoreRecords={entityNameSearchedData?.hasMoreData}
              />
            ) : (
              <div className="no-record-found">No record found</div>
            ))
          )}
          {entityNameSearchedData?.error && (
            <>
              <div className="application-entity-name-modal-retry-button">
                {entityNameSearchedData?.errorMessage}
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
      {showConfirmModal && (
        <Modal
          header="Delete Stake Holder"
          buttons={deleteStakeHolderButton}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            Are you sure you want to delete this stake holder?
          </span>
        </Modal>
      )}
    </>
  );
};
export default DebtorsStakeHolderTab;

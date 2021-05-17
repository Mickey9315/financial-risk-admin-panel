import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
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
  getStakeHolderCompanyDataFromABNorACN,
  getStakeHolderDetails,
  getStakeHolderDropDownData,
  saveDebtorStakeHolderColumnNameList,
  searchStakeHolderCompanyEntityName,
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
  } = useSelector(({ loaderButtonReducer }) => loaderButtonReducer ?? false);

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
    [page, limit]
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

  const debtorData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.selectedDebtorData ?? {}
  );

  const entityNameSearchedData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder?.entityNameSearch ?? {}
  );

  const stakeHolder = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.stakeHolder?.stakeHolderDetails ?? {}
  );

  const {
    streetType,
    australianStates,
    companyEntityType,
    countryList,
    newZealandStates,
  } = useSelector(
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
    let showDropDownInput = true;
    dispatch(updateStakeHolderDetail('state', []));
    switch (country) {
      case 'AUS':
      case 'NZL':
        setStateValue(country === 'AUS' ? australianStates : newZealandStates);
        break;
      default:
        showDropDownInput = false;
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
    stakeHolder?.abn,
    stakeHolder?.acn,
    stakeHolder?.country?.value,
    prevRef,
    australianStates,
    newZealandStates,
  ]);

  useEffect(() => {
    dispatch(getStakeHolderDropDownData());
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
      data: companyEntityType ?? [],
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
        data: titleDropDown || [],
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
        data: streetType || [],
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
        data: countryList || [],
      },
      {
        label: 'Postcode*',
        placeholder: 'Enter postcode',
        type: 'text',
        name: 'postCode',
      },
      {
        label: 'State*',
        placeholder: isAusOrNew ? 'Select' : 'Enter State',
        type: isAusOrNew ? 'select' : 'text',
        name: 'state',
        data: stateValue || [],
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
    [isAusOrNew, stateValue, titleDropDown, countryList, streetType]
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
      updateStakeHolderSingleDetail(data?.name, data);
    },
    [updateStakeHolderSingleDetail]
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
      try {
        if (e.key === 'Enter') {
          const response = await dispatch(getStakeHolderCompanyDataFromABNorACN(e.target.value));
          if (response) {
            if (e?.target?.name === 'abn') {
              prevRef.current.abn = response?.abn;
            } else {
              prevRef.current.acn = response?.acn;
            }
            updateStakeHolderState(response);
          }
        }
      } catch {
        let value = prevRef?.current?.abn;
        if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
        updateStakeHolderSingleDetail(e?.target?.name, value);
      }
    },
    [updateStakeHolderState, updateStakeHolderSingleDetail, prevRef.current]
  );

  const handleEntityNameSearch = useCallback(
    e => {
      if (e.key === 'Enter') {
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        setSearchedEntityNameValue(e?.target?.value?.toString());
        dispatch(searchStakeHolderCompanyEntityName(e?.target?.value?.toString()));
      }
    },
    [stakeHolder, dispatchDrawerState, setSearchedEntityNameValue]
  );

  const retryEntityNameRequest = useCallback(() => {
    if (searchedEntityNameValue?.trim()?.length > 0) {
      dispatch(searchStakeHolderCompanyEntityName(searchedEntityNameValue));
    }
  }, [searchedEntityNameValue]);

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
        const response = await dispatch(getStakeHolderCompanyDataFromABNorACN(data.abn));
        if (response) {
          prevRef.current.abn = response?.abn;
          prevRef.current.acn = response?.acn;
          updateStakeHolderState(response);
          handleToggleDropdown();
        }
      } catch {
        /**/
      }
      handleToggleDropdown(false);
      setSearchedEntityNameValue('');
    },
    [
      prevRef.current,
      stakeHolder,
      updateStakeHolderState,
      handleToggleDropdown,
      setSearchedEntityNameValue,
    ]
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
              value={
                input.name === 'state'
                  ? (isAusOrNew && stakeHolder?.[input.name]?.label) || stakeHolder?.[input.name]
                  : stakeHolder?.[input.name]
              }
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
              value={stakeHolder?.[input.name]}
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
              value={stakeHolder?.[input.name]}
              onKeyDown={handleSearchTextInputKeyDown}
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'select':
          component = (
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              value={
                input?.name === 'title'
                  ? titleDropDown?.find(title => title?.value === stakeHolder?.title) ||
                    stakeHolder?.title
                  : stakeHolder?.[input.name] || []
              }
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
              checked={stakeHolder?.allowToCheckCreditHistory}
              onChange={handleCheckBoxEvent}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              name={input.name}
              setIsEdit
              placeholder={input.placeholder}
              onKeyDown={handleEntityNameSearch}
              value={stakeHolder?.entityName?.value ?? ''}
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
                selected={stakeHolder?.dateOfBirth && new Date(stakeHolder?.dateOfBirth)}
                onChange={date => onChangeDate(input.name, date)}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                maxDate={new Date()}
                popperProps={{ positionFixed: true }}
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
      COMPANY_INPUT,
      INDIVIDUAL_INPUT,
      stakeHolder,
      handleTextInputChange,
      handleSelectInputChange,
      handleCheckBoxEvent,
      handleRadioButton,
      onChangeDate,
      handleEntityChange,
      titleDropDown,
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
        title: isEdit ? 'Edit' : 'Add',
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
    getDebtorStakeHolderList();
    dispatch(getDebtorStakeHolderColumnNameList());
  }, []);

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef?.current?.value;
    if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
      getDebtorStakeHolderList();
    } else if (e.key === 'Enter') {
      if (searchKeyword?.trim()?.toString()?.length !== 0) {
        getDebtorStakeHolderList({ search: searchKeyword?.trim()?.toString() });
      } else {
        errorNotification('Please enter any value than press enter');
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

  const onSelectStakeHolderRecordActionClick = useCallback(
    async (type, _id) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        setIsEdit(true);
        await dispatch(getStakeHolderDetails(_id));
        toggleAddStakeHolderModal();
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        setDeleteId(_id);
        toggleConfirmationModal();
      }
    },
    [setIsEdit, toggleAddStakeHolderModal, setDeleteId, toggleConfirmationModal]
  );

  const onClickAddStakeHolder = useCallback(() => {
    dispatch(changeStakeHolderPersonType('individual'));
    toggleAddStakeHolderModal();
  }, [toggleAddStakeHolderModal]);

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
          <Button buttonType="success" title="Add" onClick={onClickAddStakeHolder} />
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
              ? COMPANY_INPUT.map(getComponentFromType)
              : INDIVIDUAL_INPUT.map(getComponentFromType)}
          </div>
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
          {entityNameSearchedData?.isLoading ? (
            <Loader />
          ) : (
            !entityNameSearchedData?.error && (
              <ApplicationEntityNameTable
                data={entityNameSearchedData?.data}
                handleEntityNameSelect={handleEntityNameSelect}
              />
            )
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

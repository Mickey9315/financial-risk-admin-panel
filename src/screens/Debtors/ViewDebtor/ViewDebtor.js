import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import Tab from '../../../common/Tab/Tab';
import {
  changeDebtorData,
  getDebtorById,
  getDebtorDropdownData,
  setViewDebtorActiveTabIndex,
  updateDebtorData,
} from '../redux/DebtorsAction';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import Button from '../../../common/Button/Button';
import { DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Input from '../../../common/Input/Input';
import Loader from '../../../common/Loader/Loader';
import DebtorsCreditLimitTab from '../components/DebtorsCreditLimitTab';
import DebtorsApplicationTab from '../components/DebtorsApplicationTab';
import DebtorsOverduesTab from '../components/DebtorsOverduesTab';
import DebtorsClaimsTab from '../components/DebtorsClaimsTab';
import DebtorsDocumentsTab from '../components/DebtorsDocumentsTab';
import DebtorsNotesTab from '../components/DebtorsNotesTab';
import DebtorsReportsTab from '../components/DebtorsReportsTab';
import DebtorsTasksTab from '../components/DebtorsTasksTab';
import DebtorsStakeHolderTab from '../components/StakeHolder/DebtorsStakeHolderTab';

const VIEW_DEBTOR_TABS = [
  <DebtorsCreditLimitTab />,
  <DebtorsStakeHolderTab />,
  <DebtorsApplicationTab />,
  <DebtorsOverduesTab />,
  <DebtorsClaimsTab />,
  <DebtorsTasksTab />,
  <DebtorsDocumentsTab />,
  <DebtorsNotesTab />,
  <DebtorsReportsTab />,
];

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setViewDebtorActiveTabIndex(index);
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const { action, id } = useParams();

  const backToDebtor = useCallback(() => {
    history.push(`/debtors/debtor/view/${id}`);
  }, []);

  const backToDebtorList = useCallback(() => {
    history.push(`/debtors`);
  }, []);

  const tabs = [
    'Credit Limits',
    'Stakeholder',
    'Application',
    'Overdues',
    'Claims',
    'Tasks',
    'Documents',
    'Notes',
    'Reports',
  ];

  const viewDebtorActiveTabIndex = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.viewDebtorActiveTabIndex ?? 0
  );

  const debtorData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.selectedDebtorData ?? {}
  );
  const dropdownData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.dropdownData ?? {}
  );

  const { viewDebtorUpdateDebtorButtonLoaderAction, viewDebtorPageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const [isAUSOrNZL, setIsAUSOrNAL] = useState(false);

  useEffect(() => {
    if (['AUS', 'NZL'].includes(debtorData?.country?.value)) setIsAUSOrNAL(true);
  }, [debtorData?.country]);

  const FINAL_COMPONENTS = useMemo(() => {
    const filteredComponents = [...VIEW_DEBTOR_TABS];
    if (!['PARTNERSHIP', 'TRUST'].includes(debtorData?.entityType?.value)) {
      filteredComponents.splice(1, 1);
    }
    if (!isAUSOrNZL) {
      filteredComponents.splice(filteredComponents?.length - 1, 1);
    }

    return filteredComponents;
  }, [debtorData, isAUSOrNZL]);

  const FINAL_TABS = useMemo(() => {
    const filteredTabs = [...tabs];
    if (!['PARTNERSHIP', 'TRUST'].includes(debtorData?.entityType?.value)) {
      filteredTabs.splice(1, 1);
    }
    if (!isAUSOrNZL) {
      filteredTabs.splice(filteredTabs?.length - 1, 1);
    }
    return filteredTabs;
  }, [debtorData, isAUSOrNZL]);

  const INPUTS = useMemo(
    () => [
      {
        isEditable: false,
        label: 'ABN*',
        placeholder: 'Enter ABN number',
        type: 'text',
        name: 'abn',
      },
      {
        isEditable: false,
        label: 'ACN',
        placeholder: 'Enter ACN number',
        type: 'text',
        name: 'acn',
      },
      {
        isEditable: false,
        label: 'Entity Type',
        placeholder: 'Select entity type',
        type: 'select',
        name: 'entityType',
        data: [],
      },
      {
        isEditable: false,
        label: 'Entity Name',
        placeholder: 'Enter entity name',
        type: 'text',
        name: 'entityName',
      },
      {
        isEditable: true,
        label: 'Trading Name',
        placeholder: 'Enter trading name',
        type: 'text',
        name: 'tradingName',
      },
      {
        isEditable: true,
        label: 'Phone Number',
        placeholder: 'Enter phone number',
        type: 'text',
        name: 'contactNumber',
      },
      {
        isEditable: true,
        label: 'Property',
        placeholder: 'Enter property number',
        type: 'text',
        name: 'property',
      },
      {
        isEditable: true,
        label: 'Unit Number',
        placeholder: 'Enter unit number',
        type: 'text',
        name: 'unitNumber',
      },
      {
        isEditable: true,
        label: 'Street Number',
        placeholder: 'Enter street number',
        type: 'text',
        name: 'streetNumber',
      },
      {
        isEditable: true,
        label: 'Street Name',
        placeholder: 'Enter street name',
        type: 'text',
        name: 'streetName',
      },
      {
        isEditable: true,
        label: 'Street Type',
        placeholder: 'Select street type',
        type: 'select',
        name: 'streetType',
        data: dropdownData?.streetType ?? [],
      },
      {
        isEditable: true,
        label: 'Suburb',
        placeholder: 'Enter suburb',
        type: 'text',
        name: 'suburb',
      },
      {
        isEditable: false,
        label: 'State',
        placeholder: 'Select state',
        type: 'select',
        name: 'state',
        data: [],
      },
      {
        isEditable: false,
        label: 'Country',
        placeholder: 'Select country',
        type: 'select',
        name: 'country',
      },
      {
        isEditable: true,
        label: 'Postcode',
        placeholder: 'Enter postcode',
        type: 'text',
        name: 'postCode',
      },
      {
        isEditable: true,
        label: 'Review Date',
        placeholder: 'Select review date',
        type: 'date',
        name: 'reviewDate',
      },
      {
        isEditable: false,
        label: 'Risk Rating',
        placeholder: 'Enter risk rating',
        type: 'text',
        name: 'riskRating',
      },
    ],
    [debtorData, dropdownData]
  );

  const finalInputs = useMemo(() => {
    if (isAUSOrNZL) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(0, 2, {
      isEditable: false,
      label: 'Registration No.*',
      placeholder: 'Registration No',
      type: 'text',
      name: 'registrationNumber',
    });
    return filteredData;
  }, [INPUTS, isAUSOrNZL]);

  useEffect(() => {
    dispatch(getDebtorById(id));
    return () => {
      dispatch({
        type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_RESET_DEBTOR_DETAILS,
        data: [],
      });
      setViewDebtorActiveTabIndex(0);
    };
  }, [id]);

  useEffect(() => {
    tabActive(viewDebtorActiveTabIndex);
  }, [viewDebtorActiveTabIndex]);

  const editDebtorClick = useCallback(() => {
    history.push(`/debtors/debtor/edit/${id}`);
  }, [id, history]);

  const handleOnChange = useCallback((name, value) => {
    dispatch(changeDebtorData(name, value));
  }, []);

  const handleOnTextChange = useCallback(
    e => {
      const { name, value } = e.target;
      handleOnChange(name, value);
    },
    [handleOnChange]
  );

  const handleOnSelectInputChange = useCallback(
    data => {
      handleOnChange(data?.name, data);
    },
    [handleOnChange]
  );

  const handleOnDateChange = useCallback(
    (name, date) => {
      handleOnChange(name, date);
    },
    [handleOnChange]
  );

  const setValuesFromRedux = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'abn': {
          return debtorData?.abn || '';
        }
        case 'acn': {
          return debtorData?.acn || '';
        }
        case 'entityName': {
          return debtorData?.entityName || [];
        }
        case 'entityType': {
          return debtorData?.entityType || [];
        }
        case 'contactNumber': {
          return debtorData?.contactNumber || '';
        }
        case 'tradingName': {
          return debtorData?.tradingName || '';
        }
        case 'unitNumber': {
          return debtorData?.unitNumber || '';
        }
        case 'property': {
          return debtorData?.property || '';
        }
        case 'suburb': {
          return debtorData?.suburb || '';
        }
        case 'streetNumber': {
          return debtorData?.streetNumber || '';
        }
        case 'streetName': {
          return debtorData?.streetName || '';
        }
        case 'streetType': {
          return debtorData?.streetType || [];
        }
        case 'state': {
          return debtorData?.state || [];
        }
        case 'country': {
          return debtorData?.country || [];
        }
        case 'postCode': {
          return debtorData?.postCode || '';
        }
        case 'reviewDate': {
          return debtorData?.reviewDate || new Date();
        }
        case 'riskRating': {
          return debtorData?.riskRating || '';
        }
        default:
          return null;
      }
    },
    [debtorData]
  );

  const onClickUpdateDebtor = useCallback(() => {
    const finalData = {
      address: {},
    };

    if (debtorData?.tradingName) finalData.tradingName = debtorData?.tradingName?.trim();
    if (debtorData?.contactNumber) finalData.contactNumber = debtorData?.contactNumber?.trim();
    if (debtorData?.property) finalData.address.property = debtorData?.property?.trim();
    if (debtorData?.unitNumber) finalData.address.unitNumber = debtorData?.unitNumber?.trim();
    if (debtorData?.streetNumber) finalData.address.streetNumber = debtorData?.streetNumber?.trim();
    if (debtorData?.streetName) finalData.address.streetName = debtorData?.streetName?.trim();
    if (debtorData?.streetType)
      finalData.address.streetType = debtorData?.streetType?.value?.trim();
    if (debtorData?.suburb) finalData.address.suburb = debtorData?.suburb?.trim();
    if (debtorData?.postCode) finalData.address.postCode = debtorData?.postCode?.trim();
    if (debtorData?.reviewDate) finalData.reviewDate = debtorData?.reviewDate;

    dispatch(updateDebtorData(id, finalData, () => backToDebtor()));
  }, [debtorData, id, backToDebtor]);

  const getComponentFromType = useCallback(
    input => {
      let component = null;
      const getSelectedValues = setValuesFromRedux(input.name);
      switch (input.type) {
        case 'text':
          component = (
            <div className="common-detail-field">
              <div className="common-detail-title">{input.label}</div>
              <Input
                type="text"
                name={input.name}
                placeholder={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                value={debtorData?.[input.name]}
                onChange={handleOnTextChange}
                disabled={action === 'view' || !input.isEditable}
                borderClass={(action === 'view' || !input.isEditable) && 'disabled-control'}
              />
            </div>
          );
          break;
        case 'select': {
          component = (
            <div className="common-detail-field">
              <div className="common-detail-title">{input.label}</div>
              <ReactSelect
                className={`select-client-list-container react-select-container ${
                  action === 'view' && 'disabled-control'
                }`}
                classNamePrefix="react-select"
                type="text"
                name={input.name}
                placeholder={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                options={input.data}
                value={getSelectedValues}
                isSearchable={false}
                onChange={handleOnSelectInputChange}
                isDisabled={action === 'view' || !input.isEditable}
              />
            </div>
          );
          break;
        }
        case 'date':
          component = (
            <div className="common-detail-field">
              <div className="common-detail-title">{input.label}</div>
              <div className={`date-picker-container ${action === 'view' && 'disabled-control'}`}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  placeholderText={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                  selected={new Date(getSelectedValues)}
                  onChange={date => handleOnDateChange(input.name, date)}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  minDate={new Date()}
                  popperProps={{ positionFixed: true }}
                  disabled={action === 'view'}
                />
                {action !== 'view' && <span className="material-icons-round">event_available</span>}
              </div>
            </div>
          );
          break;
        default:
          return null;
      }
      return <>{component}</>;
    },
    [debtorData, editDebtorClick, action, handleOnChange, setValuesFromRedux, handleOnDateChange]
  );

  useEffect(() => {
    dispatch(getDebtorDropdownData());
  }, []);

  return (
    <>
      {!viewDebtorPageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToDebtorList}>Debtor List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>View Debtor</span>
            </div>
            <div className="buttons-row">
              {action === 'view' ? (
                <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.DEBTOR}>
                  <Button buttonType="primary" title="Edit" onClick={editDebtorClick} />
                </UserPrivilegeWrapper>
              ) : (
                <>
                  <Button buttonType="primary-1" title="Close" onClick={backToDebtor} />
                  <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.DEBTOR}>
                    <Button
                      buttonType="primary"
                      title="Save"
                      onClick={onClickUpdateDebtor}
                      isLoading={viewDebtorUpdateDebtorButtonLoaderAction}
                    />
                  </UserPrivilegeWrapper>
                </>
              )}
            </div>
          </div>
          {debtorData ? (
            <div className="common-detail-container">
              <div className="common-detail-grid">{finalInputs.map(getComponentFromType)}</div>
            </div>
          ) : (
            <Loader />
          )}
          <Tab
            tabs={FINAL_TABS}
            tabActive={tabActive}
            activeTabIndex={activeTabIndex}
            className="mt-15"
          />
          <div className="common-white-container">{FINAL_COMPONENTS[activeTabIndex]}</div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewInsurer;

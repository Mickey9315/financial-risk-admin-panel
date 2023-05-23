import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import Tab from '../../../common/Tab/Tab';
import {
  changeDebtorData,
  getDebtorById,
  getDebtorDropdownData,
  resetViewDebtorData,
  setViewDebtorActiveTabIndex,
  updateDebtorData,
} from '../redux/DebtorsAction';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Loader from '../../../common/Loader/Loader';
import DebtorsCreditLimitTab from '../components/DebtorsCreditLimitTab';
import DebtorsApplicationTab from '../components/DebtorsApplicationTab';
import DebtorOverdueTab from '../components/DebtorOverdueTab';
import DebtorsTasksTab from '../components/DebtorsTasksTab';
import DebtorsDocumentsTab from '../components/DebtorsDocumentsTab';
import DebtorsNotesTab from '../components/DebtorsNotesTab';
import DebtorsStakeHolderTab from '../components/StakeHolder/DebtorsStakeHolderTab';
import DebtorsReportsTab from '../components/DebtorsReportsTab';
import DebtorsAlertsTab from '../components/DebtorsAlertsTab';
import Select from '../../../common/Select/Select';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';

const DEBTOR_TABS_CONSTANTS = [{ label: 'Credit Limits', component: <DebtorsCreditLimitTab /> }];
const DEBTOR_TABS_WITH_ACCESS = [
  { label: 'Application', component: <DebtorsApplicationTab />, name: 'application' },
  { label: 'Overdues', component: <DebtorOverdueTab />, name: 'overdue' },
  { label: 'Tasks', component: <DebtorsTasksTab />, name: 'task' },
  { label: 'Documents', component: <DebtorsDocumentsTab />, name: 'document' },
  { label: 'Notes', component: <DebtorsNotesTab />, name: 'note' },
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
    dispatch({type: DEBTORS_REDUX_CONSTANTS.DEBTOR_UNDO_SELECTED_USER_DATA_ON_CLOSE})
  }, []);

  const backToDebtorList = useCallback(() => {
    history.push(`/debtors`);
  }, []);

  const viewDebtorActiveTabIndex = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.viewDebtorActiveTabIndex ?? 0
  );

  const debtorData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.selectedDebtorData ?? {}
  );
  const dropdownData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.dropdownData ?? {}
  );

  const { viewDebtorUpdateDebtorButtonLoaderAction, viewDebtorPageLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const [isAUSOrNZL, setIsAUSOrNAL] = useState(false);

  useEffect(() => {
    if (['AUS', 'NZL'].includes(debtorData?.country?.value)) setIsAUSOrNAL(true);
  }, [debtorData?.country]);
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);
  const access = useCallback(
    accessFor => {
      const availableAccess =
        userPrivilegesData.filter(module => module.accessTypes.length > 0) ?? [];
      const isAccessible = availableAccess.filter(module => module?.name === accessFor);
      return isAccessible?.length > 0;
    },
    [userPrivilegesData]
  );
  const finalTabs = useMemo(() => {
    const tabs = [...DEBTOR_TABS_CONSTANTS];
    DEBTOR_TABS_WITH_ACCESS.forEach(tab => {
      if (access(tab.name)) {
        tabs.push(tab);
      }
    });
    if (['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(debtorData?.entityType?.value)) {
      tabs.splice(1, 0, {
        label: 'Stakeholder',
        component: <DebtorsStakeHolderTab />,
        name: 'stakeHolder',
      });
    }
    if (isAUSOrNZL && access('credit-report')) {
      tabs.push({
        label: 'Reports',
        component: <DebtorsReportsTab />,
        name: 'credit-report',
      });
    }
    tabs.push({ label: 'Alerts', component: <DebtorsAlertsTab />, name: 'alerts' });
    return tabs ?? [];
  }, [debtorData?.entityType, isAUSOrNZL, DEBTOR_TABS_CONSTANTS, access, DEBTOR_TABS_WITH_ACCESS]);

  const INPUTS = useMemo(
    () => [
      {
        isEditable: false,
        label: 'Debtor Code',
        placeholder: '-',
        type: 'text',
        name: 'debtorCode',
        value: debtorData?.debtorCode || '-',
      },
      {
        isEditable: false,
        label: 'Status',
        placeholder: '-',
        type: 'text',
        name: 'status',
        value: debtorData?.status || 'SUBMITTED',
      },
      {
        isEditable: false,
        label: 'Entity Name',
        placeholder: 'Enter entity name',
        type: 'text',
        name: 'entityName',
        value: debtorData?.entityName || '-',
      },
      {
        isEditable: false,
        label: 'ABN/NZBN*',
        placeholder: 'Enter ABN number',
        type: 'text',
        name: 'abn',
        value: debtorData?.abn || '-',
      },
      {
        isEditable: false,
        label: 'ACN/NCN',
        placeholder: 'Enter ACN number',
        type: 'text',
        name: 'acn',
        value: debtorData?.acn || '-',
      },
      {
        isEditable: false,
        label: 'Entity Type',
        placeholder: 'Select entity type',
        type: 'text',
        name: 'entityType',
        data: [],
        value: debtorData?.entityType?.label || '-',
      },
      {
        isEditable: true,
        label: 'Trading Name',
        placeholder: 'Enter trading name',
        type: 'input',
        name: 'tradingName',
        value: debtorData?.tradingName || '-',
      },
      {
        isEditable: true,
        label: 'Phone Number',
        placeholder: 'Enter phone number',
        type: 'input',
        name: 'contactNumber',
        value: debtorData?.contactNumber || '-',
      },
      {
        isEditable: true,
        label: 'Property',
        placeholder: 'Enter property number',
        type: 'input',
        name: 'property',
        value: debtorData?.property || '-',
      },
      {
        isEditable: true,
        label: 'Unit Number',
        placeholder: 'Enter unit number',
        type: 'input',
        name: 'unitNumber',
        value: debtorData?.unitNumber || '-',
      },
      {
        isEditable: true,
        label: 'Street Number',
        placeholder: 'Enter street number',
        type: 'input',
        name: 'streetNumber',
        value: debtorData?.streetNumber || '-',
      },
      {
        isEditable: true,
        label: 'Street Name',
        placeholder: 'Enter street name',
        type: 'input',
        name: 'streetName',
        value: debtorData?.streetName || '-',
      },
      {
        isEditable: true,
        label: 'Street Type',
        placeholder: 'Select street type',
        type: 'select',
        name: 'streetType',
        data: dropdownData?.streetType ?? [],
        value: debtorData?.streetType || [],
      },
      {
        isEditable: true,
        label: 'Suburb',
        placeholder: 'Enter suburb',
        type: 'input',
        name: 'suburb',
        value: debtorData?.suburb || '-',
      },
      {
        isEditable: false,
        label: 'State',
        placeholder: 'Select state',
        type: 'text',
        name: 'state',
        data: [],
        value: debtorData?.state?.label ?? '-',
      },
      {
        isEditable: false,
        label: 'Country',
        placeholder: 'Select country',
        type: 'text',
        name: 'country',
        value: debtorData?.country?.label || '-',
      },
      {
        isEditable: true,
        label: 'Postcode',
        placeholder: 'Enter postcode',
        type: 'input',
        name: 'postCode',
        value: debtorData?.postCode || '-',
      },
      {
        isEditable: true,
        label: 'Review Date',
        placeholder: 'Select review date',
        type: 'date',
        name: 'reviewDate',
        value: debtorData?.reviewDate || null,
      },
      {
        isEditable: false,
        label: 'Risk Rating',
        placeholder: 'Enter risk rating',
        type: 'text',
        name: 'riskRating',
        value: debtorData?.riskRating || '-',
      },
    ],
    [debtorData, dropdownData]
  );

  const finalInputs = useMemo(() => {
    if (isAUSOrNZL) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(2, 2, {
      isEditable: false,
      label: 'Registration No.*',
      placeholder: 'Registration No',
      type: 'text',
      name: 'registrationNumber',
      value: debtorData?.registrationNumber,
    });
    return filteredData;
  }, [INPUTS, isAUSOrNZL]);

  useEffect(() => {
    dispatch(getDebtorById(id));
    return () => {
      setViewDebtorActiveTabIndex(0);
      dispatch(resetViewDebtorData());
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
      handleOnChange(name, moment(date).format('YYYY-MM-DD 00:00:00'));
    },
    [handleOnChange]
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
      switch (input.type) {
        case 'input':
          component = (
            <>
              {action === 'view' ? (
                <span className="view-debtor-value">{input?.value}</span>
              ) : (
                <Input
                  type="text"
                  name={input.name}
                  placeholder={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                  value={debtorData?.[input.name]}
                  onChange={handleOnTextChange}
                  disabled={action === 'view' || !input.isEditable}
                  borderClass={(action === 'view' || !input.isEditable) && 'disabled-control'}
                />
              )}
            </>
          );
          break;
        case 'select': {
          component = (
            <>
              {action === 'view' ? (
                <span className="view-debtor-value">{input?.value?.label}</span>
              ) : (
                <Select
                  className={`select-client-list-container ${
                    action === 'view' && 'disabled-control'
                  }`}
                  name={input.name}
                  placeholder={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                  options={input.data}
                  value={input?.value}
                  isSearchable
                  onChange={handleOnSelectInputChange}
                  isDisabled={action === 'view' || !input.isEditable}
                />
              )}
            </>
          );
          break;
        }
        case 'date':
          component = (
            <div className={`date-picker-container ${action === 'view' && 'disabled-control'}`}>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                placeholderText={action === 'view' || !input.isEditable ? '-' : input.placeholder}
                selected={new Date(input?.value)}
                onChange={date => handleOnDateChange(input.name, date)}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                minDate={new Date()}
                popperProps={{ positionFixed: true }}
                disabled={action === 'view'}
              />
              {action !== 'view' && <span className="material-icons-round">event</span>}
            </div>
          );
          break;
        default:
          component = <span className="view-debtor-value">{input.value}</span>;
      }
      return (
        <>
          <div className="view-debtor-detail-field-container">
            <div className="view-debtor-detail-title">{input.label}</div>
            {component}
          </div>
        </>
      );
    },
    [debtorData, editDebtorClick, action, handleOnChange, handleOnDateChange]
  );

  useEffect(() => {
    dispatch(getDebtorDropdownData());
  }, []);

  return (
    <>
      {!viewDebtorPageLoader ? (
        (() =>
          !_.isEmpty(debtorData) ? (
            <>
              <div className="breadcrumb-button-row">
                <div className="breadcrumb">
                  <span onClick={backToDebtorList}>Debtor List</span>
                  <span className="material-icons-round">navigate_next</span>
                  <span>View Debtor</span>
                </div>
                <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.DEBTOR}>
                  <div className="buttons-row">
                    {action === 'view' ? (
                      <Button buttonType="primary" title="Edit" onClick={editDebtorClick} />
                    ) : (
                      <>
                        <Button buttonType="primary-1" title="Close" onClick={backToDebtor} />
                        <Button
                          buttonType="primary"
                          title="Save"
                          onClick={onClickUpdateDebtor}
                          isLoading={viewDebtorUpdateDebtorButtonLoaderAction}
                        />
                      </>
                    )}
                  </div>
                </UserPrivilegeWrapper>
              </div>

              <div className="common-detail-container">
                <div className="common-detail-grid">{finalInputs.map(getComponentFromType)}</div>
              </div>

              <Tab
                tabs={finalTabs.map(tab => tab?.label)}
                tabActive={tabActive}
                activeTabIndex={activeTabIndex}
                className="mt-15"
              />
              <div className="common-white-container">{finalTabs?.[activeTabIndex]?.component}</div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewInsurer;

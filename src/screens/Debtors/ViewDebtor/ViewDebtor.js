import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';

import Tab from '../../../common/Tab/Tab';

import './DebtorsTabs.scss';

import {
  changeDebtorData,
  getDebtorById,
  getDebtorDropdownData,
  updateDebtorData,
} from '../redux/DebtorsAction';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import Button from '../../../common/Button/Button';
import { DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Input from '../../../common/Input/Input';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import DebtorsCreditLimitTab from '../components/DebtorsCreditLimitTab';
import DebtorsStakeHolderTab from '../components/DebtorsStakeHolderTab';
import DebtorsApplicationTab from '../components/DebtorsApplicationTab';
import DebtorsOverduesTab from '../components/DebtorsOverduesTab';
import DebtorsClaimsTab from '../components/DebtorsClaimsTab';
import DebtorsDocumentsTab from '../components/DebtorsDocumentsTab';
import DebtorsNotesTab from '../components/DebtorsNotesTab';
import DebtorsReportsTab from '../components/DebtorsReportsTab';
import DebtorsTasksTab from '../components/DebtorsTasksTab';

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const { action, id } = useParams();
  const backToDebtor = () => {
    console.log('back');
    if (action === 'edit') {
      history.push(`/debtors/view/${id}`);
    } else {
      history.push(`/debtors`);
    }
  };

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
  const debtorData = useSelector(({ debtorsManagement }) => debtorsManagement.selectedDebtorData);
  const dropdownData = useSelector(({ debtorsManagement }) => debtorsManagement.dropdownData);

  const INPUTS = useMemo(
    () => [
      {
        isEditable: false,
        label: 'ABN*',
        placeholder: '01234',
        type: 'text',
        name: 'abn',
      },
      {
        isEditable: false,
        label: 'ACN',
        placeholder: '01234',
        type: 'text',
        name: 'acn',
      },
      {
        isEditable: false,
        label: 'Entity Type',
        placeholder: 'Entity Type',
        type: 'select',
        name: 'entityType',
        data: [],
      },
      {
        isEditable: false,
        label: 'Entity Name',
        placeholder: 'Enter Entity',
        type: 'text',
        name: 'entityName',
      },
      {
        isEditable: true,
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
      },
      {
        isEditable: true,
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'contactNumber',
      },
      {
        isEditable: true,
        label: 'Property',
        placeholder: 'Property',
        type: 'text',
        name: 'property',
      },
      {
        isEditable: true,
        label: 'Unit Number',
        placeholder: 'Unit Number',
        type: 'text',
        name: 'unitNumber',
      },
      {
        isEditable: true,
        label: 'Street Number',
        placeholder: 'Street Number',
        type: 'text',
        name: 'streetNumber',
      },
      {
        isEditable: true,
        label: 'Street Name',
        placeholder: 'Street Name',
        type: 'text',
        name: 'streetName',
      },
      {
        isEditable: true,
        label: 'Street Type',
        placeholder: 'Street Type',
        type: 'select',
        name: 'streetType',
        data: dropdownData?.streetType || [],
      },
      {
        isEditable: true,
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
      },
      {
        isEditable: false,
        label: 'State',
        placeholder: 'State',
        type: 'select',
        name: 'state',
        data: [],
      },
      {
        isEditable: false,
        label: 'Country',
        placeholder: 'Country',
        type: 'select',
        name: 'country',
      },
      {
        isEditable: true,
        label: 'Postcode',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postCode',
      },
    ],
    [debtorData, dropdownData]
  );

  useEffect(() => {
    if (action !== 'add' && id) {
      dispatch(getDebtorById(id));
    }
    return () => {
      dispatch({
        type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION,
        data: [],
      });
    };
  }, []);

  const editDebtorClick = useCallback(() => {
    history.replace(`/debtors/edit/${id}`);
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
      handleOnChange(data[0]?.name, data);
    },
    [handleOnChange]
  );

  const setValuesFromRedux = useCallback(
    fieldFor => {
      switch (fieldFor) {
        case 'abn': {
          return debtorData.abn || '';
        }
        case 'acn': {
          return debtorData.acn || '';
        }
        case 'entityName': {
          return debtorData.entityName || [];
        }
        case 'entityType': {
          return debtorData.entityType || [];
        }
        case 'contactNumber': {
          return debtorData.contactNumber || '';
        }
        case 'tradingName': {
          return debtorData.tradingName || '';
        }
        case 'unitNumber': {
          return debtorData.unitNumber || '';
        }
        case 'property': {
          return debtorData.property || '';
        }
        case 'suburb': {
          return debtorData.suburb || '';
        }
        case 'streetNumber': {
          return debtorData.streetNumber || '';
        }
        case 'streetName': {
          return debtorData.streetName || '';
        }
        case 'streetType': {
          return debtorData.streetType || [];
        }
        case 'state': {
          return debtorData.state || [];
        }
        case 'country': {
          return debtorData.country || [];
        }
        case 'postCode': {
          return debtorData.postCode || '';
        }

        default:
          return null;
      }
    },
    [debtorData]
  );

  const onClickUpdateDebtor = useCallback(async () => {
    if (debtorData) {
      if (debtorData.tradingName.trim().length <= 0) {
        errorNotification('Please enter trading name before continue');
      }
      if (debtorData.contactNumber.trim().length <= 0) {
        errorNotification('Please enter contact number before continue');
      }
      if (debtorData?.property?.trim().length <= 0) {
        errorNotification('Please enter property before continue');
      }
      if (debtorData.unitNumber.trim().length <= 0) {
        errorNotification('Please enter unit number continue');
      }
      if (debtorData.streetNumber.trim().length <= 0) {
        errorNotification('Please enter street number before continue');
      }
      if (debtorData.streetName.trim().length <= 0) {
        errorNotification('Please enter street name before continue');
      }
      if (debtorData.streetType[0].value.length <= 0) {
        errorNotification('Please enter street type before continue');
      }
      if (debtorData?.suburb?.trim().length <= 0) {
        errorNotification('Please enter suburb before continue');
      }
      // if (debtorData.postCode.trim().length <= 0) {
      //   errorNotification('Please enter post code before continue');
      // }
      else {
        try {
          const finalData = {};
          if (debtorData?.tradingName) finalData.tradingName = debtorData?.tradingName;
          if (debtorData?.contactNumber) finalData.contactNumber = debtorData?.contactNumber;
          if (debtorData?.property) finalData.property = debtorData?.property;
          if (debtorData?.unitNumber) finalData.unitNumber = debtorData?.unitNumber;
          if (debtorData?.streetNumber) finalData.streetNumber = debtorData?.streetNumber;
          if (debtorData?.streetName) finalData.streetName = debtorData?.streetName;
          if (debtorData?.streetType) finalData.streetType = debtorData?.streetType[0]?.value;
          if (debtorData?.suburb) finalData.suburb = debtorData?.suburb;
          if (debtorData?.postCode) finalData.postCode = debtorData?.postCode;
          dispatch(updateDebtorData(id, finalData, () => backToDebtor()));
        } catch (e) {
          /**/
        }
      }
    }
    return true;
  }, [debtorData]);

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
                placeholder={action === 'view' ? '-' : input.placeholder}
                value={debtorData[input.name]}
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
                type="text"
                name={input.name}
                placeholder={action === 'view' ? debtorData[`${input.name}`] : input.placeholder}
                options={input.data}
                values={getSelectedValues}
                searchable={false}
                onChange={handleOnSelectInputChange}
                disabled={action === 'view' || !input.isEditable}
                className={`select-client-list-container ${
                  (action === 'view' || !input.isEditable) && 'disabled-control'
                }`}
              />
            </div>
          );
          break;
        }
        default:
          return null;
      }
      return <>{component}</>;
    },
    [debtorData, editDebtorClick, action, handleOnChange, setValuesFromRedux]
  );

  useEffect(() => {
    dispatch(getDebtorDropdownData());
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={() => backToDebtor()}>Debtor List</span>
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
                <Button buttonType="primary" title="Save" onClick={onClickUpdateDebtor} />
              </UserPrivilegeWrapper>
            </>
          )}
        </div>
      </div>
      {debtorData ? (
        <div className="common-detail-container">
          <div className="common-detail-grid">{INPUTS.map(getComponentFromType)}</div>
        </div>
      ) : (
        <Loader />
      )}
      <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
      <div className="common-white-container">
        {activeTabIndex === 0 && <DebtorsCreditLimitTab />}
        {activeTabIndex === 1 && <DebtorsStakeHolderTab />}
        {activeTabIndex === 2 && <DebtorsApplicationTab />}
        {activeTabIndex === 3 && <DebtorsOverduesTab />}
        {activeTabIndex === 4 && <DebtorsClaimsTab />}
        {activeTabIndex === 5 && <DebtorsTasksTab />}
        {activeTabIndex === 6 && <DebtorsDocumentsTab />}
        {activeTabIndex === 7 && <DebtorsNotesTab />}
        {activeTabIndex === 8 && <DebtorsReportsTab />}
      </div>
    </>
  );
};

export default ViewInsurer;

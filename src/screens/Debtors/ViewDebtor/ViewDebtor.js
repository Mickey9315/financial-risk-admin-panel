import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-dropdown-select';
import Tab from '../../../common/Tab/Tab';

import {
  changeDebtorAddressData,
  changeDebtorData,
  getDebtorById,
  getDebtorDropdownData,
  updateDebtorData,
} from '../redux/DebtorsAction';
// import Input from '../../../common/Input/Input';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import Button from '../../../common/Button/Button';
import { DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Input from '../../../common/Input/Input';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import ApplicationTab from '../../../common/Tab/ApplicationTab/ApplicationTab';
import OverDuesTab from '../../../common/Tab/OverduesTab/OverduesTab';
import ClaimsTab from '../../../common/Tab/ClaimsTab/ClaimsTab';
import TasksTab from '../../../common/Tab/TasksTab/TasksTab';
import DocumentsTab from '../../../common/Tab/DocumentsTab/DocumentsTab';
import NotesTab from '../../../common/Tab/NotesTab/Notestab';
import CreditLimitTab from '../../../common/Tab/CreditLimitTab/CreditLimitTab';

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const { action, id } = useParams();
  const backToDebtor = () => {
    history.replace('/debtors');
  };

  const tabs = ['Credit Limits', 'Application', 'Overdues', 'Claims', 'Tasks', 'Documents', 'Notes'];
  const debtorData = useSelector(({ debtorsManagement }) => debtorsManagement.selectedDebtorData);
  const dropdownData = useSelector(({ debtorsManagement }) => debtorsManagement.dropdownData);
  const INPUTS = useMemo(
    () => [
      {
        isAddress: false,
        label: 'ABN*',
        placeholder: '01234',
        type: 'text',
        name: 'abn',
        data: debtorData?.abn,
      },
      {
        isAddress: false,
        label: 'ACN',
        placeholder: '01234',
        type: 'text',
        name: 'acn',
        data: debtorData?.acn,
      },
      {
        isAddress: false,
        label: 'Entity Type',
        placeholder: 'Entity Type',
        type: 'select',
        name: 'entityType',
        data: dropdownData?.entityType,
      },
      {
        isAddress: false,
        label: 'Entity Name',
        placeholder: 'Enter Entity',
        type: 'text',
        name: 'entityName',
        data: debtorData?.entityName,
      },
      {
        isAddress: false,
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        data: debtorData?.tradingName,
      },
      {
        isAddress: false,
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'contactNumber',
        data: debtorData?.contactNumber,
      },
      {
        isAddress: true,
        label: 'Property',
        placeholder: 'Property',
        type: 'text',
        name: 'property',
        data: debtorData?.address?.property,
      },
      {
        isAddress: true,
        label: 'Unit Number',
        placeholder: 'Unit Number',
        type: 'text',
        name: 'unitNumber',
        data: debtorData?.address?.unitNumber,
      },
      {
        isAddress: true,
        label: 'Street Number',
        placeholder: 'Street Number',
        type: 'text',
        name: 'streetNumber',
        data: debtorData?.address?.streetNumber,
      },
      {
        isAddress: true,
        label: 'Street Name',
        placeholder: 'Street Name',
        type: 'text',
        name: 'streetName',
        data: debtorData?.address?.streetName,
      },
      {
        isAddress: true,
        label: 'Street Type',
        placeholder: 'Street Type',
        type: 'select',
        name: 'streetType',
        data: dropdownData?.streetType,
      },
      {
        isAddress: true,
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        data: debtorData?.address?.suburb,
      },
      {
        isAddress: true,
        label: 'State',
        placeholder: 'State',
        type: 'select',
        name: 'state',
        data: dropdownData?.australianStates,
      },
      {
        isAddress: true,
        label: 'Country',
        placeholder: 'Country',
        type: 'text',
        name: 'country',
        data: debtorData?.address?.country,
      },
      {
        isAddress: true,
        label: 'Postcode',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postCode',
        data: debtorData?.address?.postCode,
      },
    ],
    [debtorData, dropdownData],
  );

  console.log(INPUTS);
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
    dispatch(changeDebtorData({ name, value }));
  }, []);

  const handleOnTextChange = useCallback(
    e => {
      const { name, value } = e.target;
      handleOnChange(name, value);
    },
    [handleOnChange],
  );

  const handleOnAddressChange = useCallback((name, value) => {
    dispatch(changeDebtorAddressData({ name, value }));
  }, []);

  const handleOnAddressTextChange = useCallback(
    e => {
      const { name, value } = e.target;
      handleOnAddressChange(name, value);
    },
    [handleOnAddressChange],
  );

  const handleOnSelectInputChange = useCallback(
    data => {
      console.log(data);
      handleOnChange(data[0]?.name, data[0]?.value);
    },
    [handleOnChange],
  );
  const handleOnAddressSelectInputChange = useCallback(
    data => {
      handleOnAddressChange(data[0]?.name, data[0]?.value);
    },
    [handleOnAddressChange],
  );

  const onClickUpdateDebtor = useCallback(async () => {
    if (debtorData) {
      if (!debtorData.abn || debtorData.abn.trim().length <= 0) {
        errorNotification('Please enter ABN number before continue');
      } else if (debtorData.abn && debtorData.abn.trim().length < 11) {
        errorNotification('Please enter valid ABN number before continue');
      } else if (debtorData.acn && debtorData.acn.trim().length < 9) {
        errorNotification('Please enter valid ACN number before continue');
      } else if (!debtorData.entityType || debtorData.entityType.length <= 0) {
        errorNotification('Please select entity type before continue');
        // } else if (debtorData.address) {
        //   Object.entries(debtorData.address).forEach(([key, value]) => {
        //     if (!value && value.trim().length <= 0) {
        //       errorNotification(`Please enter valid ${key}`);
        //     }
        //   });
      } else if (debtorData.address.property.trim().length <= 0) {
        errorNotification('Please enter property before continue');
      } else if (debtorData.address.unitNumber.trim().length <= 0) {
        errorNotification('Please enter unit number continue');
      } else if (debtorData.address.streetNumber.trim().length <= 0) {
        errorNotification('Please enter street number before continue');
      } else if (debtorData.address.streetName.trim().length <= 0) {
        errorNotification('Please enter street name before continue');
      } else if (debtorData.address.streetType.trim().length <= 0) {
        errorNotification('Please enter street type before continue');
      } else if (debtorData.address.suburb.trim().length <= 0) {
        errorNotification('Please enter suburb before continue');
      } else if (debtorData.address.state.trim().length <= 0) {
        errorNotification('Please enter state before continue');
      } else if (debtorData.address.country.trim().length <= 0) {
        errorNotification('Please enter country before continue');
      } else if (debtorData.address.postCode.trim().length <= 0) {
        errorNotification('Please enter post code before continue');
      } else {
        try {
          const finalData = {
            entityName: debtorData?.entityName,
            tradingName: debtorData?.tradingName,
            contactNumber: debtorData?.contactNumber,
            entityType: debtorData?.entityType,
            address: {
              property: debtorData?.address?.property,
              unitNumber: debtorData?.address?.unitNumber,
              streetNumber: debtorData?.address?.streetNumber,
              streetName: debtorData?.address?.streetName,
              streetType: debtorData?.address?.streetType,
              suburb: debtorData?.address?.suburb,
              state: debtorData?.address?.state,
              country: debtorData?.address?.country,
              postCode: debtorData?.address?.postCode,
            },
          };
          if (finalData) {
            await dispatch(updateDebtorData(id, finalData));
            backToDebtor();
          }
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
      switch (input.type) {
        case 'text':
          // eslint-disable-next-line no-unused-vars
          component = (
            <div className="common-detail-field">
              <div className="common-detail-title">{input.label}</div>
              <Input
                type="text"
                name={input.name}
                placeholder={action === 'view' ? '-' : input.placeholder}
                value={input.data}
                onChange={!input.isAddress ? handleOnTextChange : handleOnAddressTextChange}
                disabled={action === 'view'}
                borderClass={action === 'view' && 'disabled-control'}
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
                value={`${debtorData}.${input.name}`}
                searchable={false}
                onChange={!input.isAddress ? handleOnSelectInputChange : handleOnAddressSelectInputChange}
                disabled={action === 'view'}
                borderClass={action === 'view' && 'disabled-control'}
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
    [debtorData, editDebtorClick, action, handleOnChange],
  );

  useEffect(() => {
    dispatch(getDebtorDropdownData());
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToDebtor}>Debtor List</span>
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
        {activeTabIndex === 0 && <CreditLimitTab />}
        {activeTabIndex === 1 && <ApplicationTab />}
        {activeTabIndex === 2 && <OverDuesTab />}
        {activeTabIndex === 3 && <ClaimsTab />}
        {activeTabIndex === 4 && <TasksTab />}
        {activeTabIndex === 5 && <DocumentsTab />}
        {activeTabIndex === 6 && <NotesTab />}
      </div>
    </>
  );
};

export default ViewInsurer;

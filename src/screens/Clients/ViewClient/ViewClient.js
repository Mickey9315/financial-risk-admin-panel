import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Tab from '../../../common/Tab/Tab';
import OverDuesTab from '../../../common/Tab/OverduesTab/OverduesTab';
import ClaimsTab from '../../../common/Tab/ClaimsTab/ClaimsTab';
import {
  getClientById,
  setViewClientActiveTabIndex,
  syncClientData,
  updateSelectedClientData,
} from '../redux/ClientAction';
import ClientPoliciesTab from '../component/ClientPoliciesTab';
import ClientNotesTab from '../component/ClientNotesTab';
import ClientDocumentsTab from '../component/ClientDocumentsTab';
import ClientCreditLimitTab from '../component/ClientCreditLimitTab';
import ClientContactTab from '../component/ClientContactTab';
import ClientApplicationTab from '../component/ClientApplicationTab';
import ClientTaskTab from '../component/ClientTaskTab';
import Switch from '../../../common/Switch/Switch';
import Loader from '../../../common/Loader/Loader';

const initialAssigneeState = {
  riskAnalystId: [],
  serviceManagerId: [],
  isAutoApproveAllowed: null,
};

const ASSIGNEE_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function assigneeReducer(state, action) {
  switch (action.type) {
    case ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case ASSIGNEE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialAssigneeState };
    default:
      return state;
  }
}

const ViewClient = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [{ riskAnalystId, serviceManagerId, isAutoApproveAllowed }, dispatchAssignee] = useReducer(
    assigneeReducer,
    initialAssigneeState
  );

  const { viewClientSyncWithCRMButtonLoaderAction, viewClientPageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const tabActive = index => {
    setViewClientActiveTabIndex(index);
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const backToClient = () => {
    history.replace('/clients');
  };
  const tabs = [
    'Contacts',
    'Credit Limit',
    'Application',
    'Overdues',
    'Claims',
    'Tasks',
    'Policies',
    'Documents',
    'Notes',
  ];

  const viewClientActiveTabIndex = useSelector(
    ({ clientManagement }) => clientManagement?.viewClientActiveTabIndex ?? 0
  );

  const viewClientData = useSelector(
    ({ clientManagement }) => clientManagement?.selectedClient || {}
  );

  const riskAnalysts = useMemo(
    () =>
      viewClientData
        ? viewClientData?.riskAnalystList?.map(e => ({
            label: e.name,
            value: e._id,
            name: 'riskAnalystId',
          }))
        : [],
    [viewClientData]
  );

  const serviceManagers = useMemo(
    () =>
      viewClientData
        ? viewClientData?.serviceManagerList?.map(e => ({
            label: e.name,
            value: e._id,
            name: 'serviceManagerId',
          }))
        : [],
    [viewClientData]
  );

  useEffect(() => {
    dispatch(getClientById(id));
    return () => setViewClientActiveTabIndex(0);
  }, [id]);

  useEffect(() => {
    tabActive(viewClientActiveTabIndex);
  }, [viewClientActiveTabIndex]);

  useEffect(() => {
    if (viewClientData?.riskAnalystId && viewClientData?.serviceManagerId) {
      dispatchAssignee({
        type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'riskAnalystId',
        value: {
          label: viewClientData?.riskAnalystId?.name || '',
          value: viewClientData?.riskAnalystId?._id || '',
        },
      });
      dispatchAssignee({
        type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'serviceManagerId',
        value: {
          label: viewClientData?.serviceManagerId?.name || '',
          value: viewClientData?.serviceManagerId?._id || '',
        },
      });
    }
    dispatchAssignee({
      type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'isAutoApproveAllowed',
      value: viewClientData?.isAutoApproveAllowed,
    });
  }, [viewClientData]);

  const onChangeAssignee = useCallback(
    event => {
      const { label, name, value } = event;
      dispatchAssignee({
        type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value: {
          label,
          value,
        },
      });

      const data = {};
      data[`${name}`] = value;
      dispatch(updateSelectedClientData(id, data));
    },
    [dispatchAssignee]
  );

  const onChangeApplicationAutomationSwitch = useCallback(
    event => {
      const { name, checked } = event?.target;
      const data = {};
      data[`${name}`] = checked;
      try {
        dispatch(updateSelectedClientData(id, data));
        dispatchAssignee({
          type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
          name,
          checked,
        });
      } catch (e) {
        /**/
      }
    },
    [dispatchAssignee]
  );

  const syncClientDataClick = useCallback(() => {
    dispatch(syncClientData(id));
  }, [id]);

  const tabComponent = [
    <ClientContactTab />,
    <ClientCreditLimitTab />,
    <ClientApplicationTab />,
    <OverDuesTab />,
    <ClaimsTab />,
    <ClientTaskTab />,
    <ClientPoliciesTab />,
    <ClientDocumentsTab />,
    <ClientNotesTab />,
  ];

  return (
    <>
      {!viewClientPageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToClient}>Client List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>View Client</span>
            </div>
            <div className="buttons-row">
              <Button
                buttonType="secondary"
                title="Sync With CRM"
                onClick={syncClientDataClick}
                isLoading={viewClientSyncWithCRMButtonLoaderAction}
              />
            </div>
          </div>
          <div className="common-white-container client-details-container">
            <span>Name</span>
            <Input
              type="text"
              readOnly
              placeholder="No name added"
              value={viewClientData?.name ?? ''}
            />
            <span>Address</span>
            <Input
              type="text"
              readOnly
              placeholder="No address added"
              value={viewClientData?.address?.city ?? ''}
            />
            <span>Phone</span>
            <Input
              type="text"
              readOnly
              placeholder="No phone number added"
              value={viewClientData?.contactNumber ?? ''}
            />
            <span>ABN</span>
            <Input
              type="number"
              readOnly
              placeholder="No ABN number added"
              value={viewClientData?.abn ?? ''}
            />
            <span>ACN</span>
            <Input
              type="number"
              readOnly
              placeholder="No ACN number added"
              value={viewClientData?.acn ?? ''}
            />
            <span>Referred By</span>
            <Input
              type="text"
              readOnly
              placeholder="N/A"
              value={viewClientData?.referredBy ?? ''}
            />
            <span>Risk Person</span>
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              name="riskAnalystId"
              options={riskAnalysts}
              value={riskAnalystId}
              onChange={onChangeAssignee}
              isSearchable
            />
            <span>Service Person</span>
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select"
              name="serviceManagerId"
              options={serviceManagers}
              value={serviceManagerId}
              onChange={onChangeAssignee}
              isSearchable
            />
            <span>Insurer Name</span>
            <Input
              type="text"
              readOnly
              placeholder="N/A"
              value={viewClientData?.insurerId?.name ?? ''}
            />
            <span>IBIS Sector</span>
            <Input
              type="text"
              readOnly
              placeholder="No IBIS sector added"
              value={viewClientData?.sector ?? ''}
            />
            <span>Sales Person</span>
            <Input
              type="text"
              readOnly
              placeholder="No sales person added"
              value={viewClientData?.salesPerson ?? ''}
            />
            <span>Website</span>
            <Input
              type="text"
              readOnly
              placeholder="No website added"
              value={viewClientData?.website ?? ''}
            />
            <span>Trading As</span>
            <Input type="text" readOnly placeholder="N/A" />
            <span>Inception Date</span>
            <div className="date-picker-container">
              <DatePicker
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
                placeholderText="No inception date added"
                selected={new Date(viewClientData?.inceptionDate ?? null)}
                disabled
                popperProps={{ positionFixed: true }}
              />
            </div>
            <span>Expiry Date</span>
            <div className="date-picker-container">
              <DatePicker
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
                placeholderText="No expiry date added"
                selected={new Date(viewClientData?.expiryDate ?? null)}
                disabled
                popperProps={{ positionFixed: true }}
              />
            </div>
            <span>Automate Applications</span>
            <Switch
              id="automate-applications"
              name="isAutoApproveAllowed"
              checked={isAutoApproveAllowed}
              onChange={onChangeApplicationAutomationSwitch}
            />
          </div>
          <Tab
            tabs={tabs}
            tabActive={tabActive}
            activeTabIndex={activeTabIndex}
            className="mt-15"
          />
          <div className="common-white-container">{tabComponent[activeTabIndex]}</div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewClient;

import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import moment from 'moment';
import _ from 'lodash';
import Button from '../../../common/Button/Button';
import Tab from '../../../common/Tab/Tab';
import {
  getClientById,
  resetViewClientData,
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
import ClientOverdueTab from '../component/ClientOverdueTab';
import ClientClaimsTab from '../component/ClientClaimsTab';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';

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

const CLIENT_TABS_CONSTANTS = [
  { label: 'Contacts', component: <ClientContactTab /> },
  { label: 'Credit Limit', component: <ClientCreditLimitTab /> },
];
const CLIENT_TABS_WITH_ACCESS = [
  { label: 'Application', component: <ClientApplicationTab />, name: 'application' },
  { label: 'Overdues', component: <ClientOverdueTab />, name: 'overdue' },
  { label: 'Claims', component: <ClientClaimsTab />, name: 'claim' },
  { label: 'Tasks', component: <ClientTaskTab />, name: 'task' },
  { label: 'Policies', component: <ClientPoliciesTab />, name: 'policy' },
  { label: 'Documents', component: <ClientDocumentsTab />, name: 'document' },
  { label: 'Notes', component: <ClientNotesTab />, name: 'note' },
];

const ViewClient = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [{ riskAnalystId, serviceManagerId, isAutoApproveAllowed }, dispatchAssignee] = useReducer(
    assigneeReducer,
    initialAssigneeState
  );

  const { viewClientSyncWithCRMButtonLoaderAction, viewClientPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
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

  const viewClientActiveTabIndex = useSelector(
    ({ clientManagement }) => clientManagement?.viewClientActiveTabIndex ?? 0
  );

  const viewClientData = useSelector(
    ({ clientManagement }) => clientManagement?.selectedClient || {}
  );
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);
  const access = module => useModulePrivileges(module).hasReadAccess;
  const finalTabs = useMemo(() => {
    const tabs = [...CLIENT_TABS_CONSTANTS];
    CLIENT_TABS_WITH_ACCESS.forEach(tab => {
      if (access(tab.name)) {
        tabs.push(tab);
      }
    });
    return tabs ?? [];
  }, [access, CLIENT_TABS_CONSTANTS, CLIENT_TABS_WITH_ACCESS, userPrivilegesData]);

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
    return () => {
      setViewClientActiveTabIndex(0);
      dispatch(resetViewClientData());
    };
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

  return (
    <>
      {!viewClientPageLoaderAction ? (
        (() =>
          !_.isEmpty(viewClientData) ? (
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
                <span>Client Code</span>
                <div className="client-detail">{viewClientData?.clientCode || 'N/A'}</div>
                <span>Name</span>
                <div className="client-detail">{viewClientData?.name || 'No name added'}</div>
                <span>Address</span>
                <div className="client-detail">
                  {viewClientData?.address?.city || 'No address added'}
                </div>
                <span>Phone</span>
                <div className="client-detail">
                  {viewClientData?.contactNumber || 'No phone number added'}
                </div>
                <span>ABN</span>
                <div className="client-detail">{viewClientData?.abn || 'No ABN number added'}</div>
                <span>ACN</span>
                <div className="client-detail">{viewClientData?.acn || 'No ACN number added'}</div>
                <span>Risk Person</span>
                <ReactSelect
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select"
                  name="riskAnalystId"
                  options={riskAnalysts}
                  value={riskAnalystId || []}
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
                  value={serviceManagerId || []}
                  onChange={onChangeAssignee}
                  isSearchable
                />
                <span>Insurer Name</span>
                <div className="client-detail">{viewClientData?.insurerId?.name || 'N/A'}</div>
                <span>Sales Person</span>
                <div className="client-detail">
                  {viewClientData?.salesPerson || 'No sales person added'}
                </div>
                <span>IBIS Sector</span>
                <div className="client-detail">
                  {viewClientData?.sector || 'No IBIS sector added'}
                </div>
                <span>Website</span>
                <div className="client-detail mail-id-value">
                  {viewClientData?.website || 'No website added'}
                </div>
                <span>Trading As</span>
                <div className="client-detail">{viewClientData?.tradingName || 'N/A'}</div>
                <span>Referred By</span>
                <div className="client-detail">{viewClientData?.referredBy || 'N/A'}</div>
                <span>Inception Date</span>
                <div className="client-detail">
                  {moment(viewClientData?.inceptionDate).format('DD/MM/YYYY') || 'N/A'}
                </div>
                <span>Expiry Date</span>
                <div className="client-detail">
                  {moment(viewClientData?.expiryDate).format('DD/MM/YYYY') || 'N/A'}
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
                tabs={finalTabs?.map(tab => tab?.label)}
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

export default ViewClient;

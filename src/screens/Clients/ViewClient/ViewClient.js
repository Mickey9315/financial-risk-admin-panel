import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ViewClient.scss';
import { useHistory, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import Tab from '../../../common/Tab/Tab';
import ContactsTab from '../../../common/Tab/ContactsTab/ContactsTab';
import CreditLimitTab from '../../../common/Tab/CreditLimitTab/CreditLimitTab';
import ApplicationTab from '../../../common/Tab/ApplicationTab/ApplicationTab';
import OverDuesTab from '../../../common/Tab/OverduesTab/OverduesTab';
import ClaimsTab from '../../../common/Tab/ClaimsTab/ClaimsTab';
import TasksTab from '../../../common/Tab/TasksTab/TasksTab';
import PoliciesTab from '../../../common/Tab/PoliciesTab/PoliciesTab';
import DocumentsTab from '../../../common/Tab/DocumentsTab/DocumentsTab';
import NotesTab from '../../../common/Tab/NotesTab/Notestab';
import { getClientById } from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';

const initialAssigneeState = {
  riskAnalystId: '',
  serviceManagerId: '',
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
  const [{ riskAnalystId, serviceManagerId }, dispatchAssignee] = useReducer(
    assigneeReducer,
    initialAssigneeState
  );

  const tabActive = index => {
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
  const viewClientData = useSelector(({ clientManagement }) => clientManagement.selectedClient);

  const riskAnalysts = useMemo(
    () =>
      viewClientData
        ? viewClientData.riskAnalystList.map(e => ({
            label: e.name,
            value: e._id,
          }))
        : [],
    [viewClientData]
  );

  const serviceManagers = useMemo(
    () =>
      viewClientData
        ? viewClientData.serviceManagerList.map(e => ({
            label: e.name,
            value: e._id,
          }))
        : [],
    [viewClientData]
  );

  useEffect(() => {
    dispatch(getClientById(id));
  }, []);

  const onChangeAssignee = useCallback(
    event => {
      dispatchAssignee({
        type: ASSIGNEE_REDUCER_ACTIONS.UPDATE_DATA,
        name: event.target.name,
        value: event.target.value,
      });
    },
    [dispatchAssignee]
  );

  if (!viewClientData) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToClient}>Client List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View Client</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="secondary" title="Sync With CRM" />
        </div>
      </div>
      <div className="common-white-container client-details-container">
        <span>Name</span>
        <Input
          type="text"
          placeholder="Enter Name"
          value={viewClientData.name ? viewClientData.name : ''}
        />
        <span>Address</span>
        <Input type="text" placeholder="Enter Address" value={viewClientData.address.city} />
        <span>Phone</span>
        <Input type="text" placeholder="1234567890" value={viewClientData.contactNumber} />
        <span>ABN</span>
        <Input type="number" placeholder="1234567890" value={viewClientData.abn} />
        <span>ACN</span>
        <Input type="number" placeholder="1234567890" value={viewClientData.acn} />
        <span>Referred By</span>
        <Input type="text" placeholder="Lorem Ipsum" value={viewClientData.referredBy} />
        <span>Risk Person</span>
        <Select
          placeholder="Select"
          name="riskAnalystId"
          options={riskAnalysts}
          value={riskAnalystId}
          onChange={onChangeAssignee}
        />
        <span>Service Person</span>
        <Select
          placeholder="Select"
          name="serviceManagerId"
          options={serviceManagers}
          value={serviceManagerId}
          onChange={onChangeAssignee}
        />
        <span>IBIS Sector</span>
        <Input type="text" placeholder="Lorem Ipsum" value={viewClientData.sector} />
        <span>Sales Person</span>
        <Input type="text" placeholder="Lorem Ipsum" value={viewClientData.salesPerson} />
        <span>Website</span>
        <Input type="text" placeholder="Lorem Ipsum" value={viewClientData.website} />
        <span>Trading As</span>
        <Input type="text" placeholder="Lorem Ipsum" />
        <span>Inception Date</span>
        <div className="date-picker-container">
          <DatePicker />
        </div>
        <span>Expiry Date</span>
        <div className="date-picker-container">
          <DatePicker />
        </div>
      </div>
      <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
      <div className="common-white-container">
        {activeTabIndex === 0 && <ContactsTab />}
        {activeTabIndex === 1 && <CreditLimitTab />}
        {activeTabIndex === 2 && <ApplicationTab />}
        {activeTabIndex === 3 && <OverDuesTab />}
        {activeTabIndex === 4 && <ClaimsTab />}
        {activeTabIndex === 5 && <TasksTab />}
        {activeTabIndex === 6 && <PoliciesTab />}
        {activeTabIndex === 7 && <DocumentsTab />}
        {activeTabIndex === 8 && <NotesTab />}
      </div>
    </>
  );
};

export default ViewClient;

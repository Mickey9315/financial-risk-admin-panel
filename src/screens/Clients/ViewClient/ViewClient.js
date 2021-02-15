import React, { useState } from 'react';
import './ViewClient.scss';
import { useHistory } from 'react-router-dom';
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

const ViewClient = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const backToClient = () => {
    history.push('/clients');
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
        <Input type="text" placeholder="Enter Name" />
        <span>Address</span>
        <Input type="text" placeholder="Enter Address" />
        <span>Brokers Commission</span>
        <Input type="text" placeholder="Enter Commission" />
        <span>Phone</span>
        <div className="phone-number-input">
          <div className="phone-code">+01</div>
          <input placeholder="1234567890" />
        </div>
        <span>ABN</span>
        <Input type="number" placeholder="1234567890" />
        <span>ACN</span>
        <Input type="number" placeholder="1234567890" />
        <span>Referred By</span>
        <Input type="text" placeholder="Lorem Ipsum" />
        <span>Referred By</span>
        <Input type="text" placeholder="Lorem Ipsum" />
        <span>Risk Person</span>
        <Select placeholder="Select" />
        <span>Service Person</span>
        <Select placeholder="Select" />
        <span>IBIS Sector</span>
        <Input type="text" placeholder="Lorem Ipsum" />
        <span>Sales Person</span>
        <Input type="text" placeholder="Lorem Ipsum" />
        <span>Website</span>
        <Input type="text" placeholder="Lorem Ipsum" />
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

import React, { useState } from 'react';
import './ViewInsurer.scss';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import { USER_ROLES } from '../../../constants/UserlistConstants';
import Tab from '../../../common/Tab/Tab';
import ContactsTab from '../../../common/Tab/ContactsTab/ContactsTab';
import PoliciesTab from '../../../common/Tab/PoliciesTab/PoliciesTab';

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const tabs = ['Policies', 'Contacts', 'Matrix'];
  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span>Insurer List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Add Insurer</span>
        </div>
      </div>

      <div className="common-detail-container">
        <div className="common-detail-grid">
          <div className="common-detail-field">
            <span className="common-detail-title">Name</span>
            <Input type="text" name="name" placeholder="Jason Gatt" />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Address</span>
            <Input type="text" name="address" placeholder="Enter Address" />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Contact Person</span>
            <Select name="contact_person" options={USER_ROLES} />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Phone Number</span>
            <Input name="contactNumber" type="text" placeholder="1234567890" />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Email</span>
            <Input type="email" name="email" placeholder="jason@trad.com" />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Website</span>
            <Input name="website" type="text" placeholder="www.trad.com" />
          </div>
        </div>
      </div>
      <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
      <div className="common-white-container">
        {activeTabIndex === 0 && <PoliciesTab />}
        {activeTabIndex === 1 && <ContactsTab />}
        {activeTabIndex === 2 && <ContactsTab />}
      </div>
    </>
  );
};

export default ViewInsurer;

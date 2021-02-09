import React from 'react';
import './AddUser.scss';
import Dashboard from '../../../common/Dashboard/Dashboard';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';

const AddUser = () => {
  return (
    <Dashboard>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span>User List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View User</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="background-color" title="Close" />
          <Button buttonType="primary" title="Save" />
        </div>
      </div>

      <div className="add-user-detail-container">
        <div className="add-user-detail">
          <span className="font-primary">Name</span>
          <Input type="text" className="add-user-input" placeholder="Jason Gatt" />
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Email</span>
          <Input type="email" className="add-user-input" placeholder="jason@trad.au" />
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Phone Number</span>
          <div className="phone-number-input">
            <div className="phone-code">+01</div>
            <input placeholder="1234567890" />
          </div>
        </div>
        <div className="add-user-detail">
          <span className="font-primary">Role</span>
          <Select className="add-user-select" />
        </div>
      </div>
      <div className="module-container">
        <div className="module">
          <div className="module-title">Module 1</div>
          <Checkbox title="Read Access" />
          <Checkbox title="Write Access" />
          <Checkbox title="All Access" />
        </div>
        <div className="module">
          <div className="module-title">Module 1</div>
          <Checkbox title="Read Access" />
          <Checkbox title="Write Access" />
          <Checkbox title="All Access" />
        </div>
        <div className="module">
          <div className="module-title">Module 1</div>
          <Checkbox title="Read Access" />
          <Checkbox title="Write Access" />
          <Checkbox title="All Access" />
        </div>
        <div className="module">
          <div className="module-title">Module 1</div>
          <Checkbox title="Read Access" />
          <Checkbox title="Write Access" />
          <Checkbox title="All Access" />
        </div>
      </div>
    </Dashboard>
  );
};

export default AddUser;

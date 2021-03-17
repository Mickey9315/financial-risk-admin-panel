import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Tab from '../../common/Tab/Tab';
import './MyWork.scss';
import IconButton from '../../common/IconButton/IconButton';
import Button from '../../common/Button/Button';
import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';

const MyWork = () => {
  const myWorkTabs = ['Tasks', 'Notifications'];
  const myWorkTabContent = [<MyWorkTasks />, <MyWorkNotifications />];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const addTask = useCallback(() => {
    history.push('/my-work/add');
  }, [history]);
  return (
    <>
      <div className="my-work-tab-button-row">
        <Tab
          tabs={myWorkTabs}
          tabActive={tabActive}
          activeTabIndex={activeTabIndex}
          className="my-work-tab"
        />
        <div className="d-flex">
          {activeTabIndex === 0 ? (
            <>
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on user list"
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
              />
              <Button buttonType="success" title="Add" onClick={addTask} />
            </>
          ) : (
            <div className="date-picker-container">
              <DatePicker placeholderText="Select date..." />
              <span className="material-icons-round">event_available</span>
            </div>
          )}
        </div>
      </div>
      <div className="common-white-container my-work-tab-content-container">
        {myWorkTabContent[activeTabIndex]}
      </div>
    </>
  );
};

export default MyWork;

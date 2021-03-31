import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '../../common/Tab/Tab';
import './MyWork.scss';
import IconButton from '../../common/IconButton/IconButton';
import Button from '../../common/Button/Button';
import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';
import CustomFieldModal from '../../common/Modal/CustomFieldModal/CustomFieldModal';
import {
  changeTaskListColumnStatus,
  getTaskListColumnList,
  saveTaskListColumnListName,
} from './redux/MyWorkAction';

const MyWork = () => {
  const dispatch = useDispatch();
  const myWorkTabs = ['Tasks', 'Notifications'];

  const taskColumnListData = useSelector(({ myWorkReducer }) => myWorkReducer.task.columnList);

  const myWorkTabContent = [<MyWorkTasks />, <MyWorkNotifications />];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const addTask = useCallback(() => {
    history.push('/my-work/add');
  }, [history]);

  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickCloseColumnSelection = useCallback(async () => {
    await dispatch(getTaskListColumnList());
    toggleCustomField();
  }, [toggleCustomField]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveTaskListColumnListName({ isReset: true }));
    dispatch(getTaskListColumnList());
    toggleCustomField();
  }, [toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveTaskListColumnListName({ taskColumnListData }));
    toggleCustomField();
  }, [toggleCustomField, taskColumnListData]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseColumnSelection },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [toggleCustomField, onClickSaveColumnSelection, onClickResetDefaultColumnSelection]
  );

  const { defaultFields, customFields } = useMemo(
    () => taskColumnListData || { defaultFields: [], customFields: [] },
    [taskColumnListData]
  );
  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeTaskListColumnStatus(data));
  }, []);

  useEffect(() => {
    dispatch(getTaskListColumnList());
  }, []);

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
                buttonTitle="Click to apply filters on task list"
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={toggleCustomField}
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
      <div className="my-work-tab-content-container">{myWorkTabContent[activeTabIndex]}</div>
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldsModalButtons}
        />
      )}
    </>
  );
};

export default MyWork;

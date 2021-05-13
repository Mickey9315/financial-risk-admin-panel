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
import { getClientById, syncClientData, updateSelectedClientData } from '../redux/ClientAction';
import Loader from '../../../common/Loader/Loader';
import ClientPoliciesTab from '../component/ClientPoliciesTab';
import ClientNotesTab from '../component/ClientNotesTab';
import ClientDocumentsTab from '../component/ClientDocumentsTab';
import ClientCreditLimitTab from '../component/ClientCreditLimitTab';
import ClientContactTab from '../component/ClientContactTab';
import ClientApplicationTab from '../component/ClientApplicationTab';
import ClientTaskTab from '../component/ClientTaskTab';

const initialAssigneeState = {
  riskAnalystId: [],
  serviceManagerId: [],
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
  }, []);

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

  const syncClientDataClick = useCallback(() => {
    dispatch(syncClientData(id));
  }, [id]);

  if (!viewClientData) {
    return <Loader />;
  }
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
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToClient}>Client List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View Client</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="secondary" title="Sync With CRM" onClick={syncClientDataClick} />
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
        <Input type="text" readOnly placeholder="N/A" value={viewClientData?.referredBy ?? ''} />
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
      </div>
      <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
      <div className="common-white-container">{tabComponent[activeTabIndex]}</div>
    </>
  );
};

export default ViewClient;

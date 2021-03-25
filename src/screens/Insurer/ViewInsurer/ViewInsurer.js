import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './ViewInsurer.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../common/Input/Input';
import Tab from '../../../common/Tab/Tab';
import { getInsurerById, syncInsurerData } from '../redux/InsurerAction';
import InsurerContactTab from '../Components/InsurerContactTab';
import InsurerPoliciesTab from '../Components/InsurerPoliciesTab';
import Button from '../../../common/Button/Button';
import InsurerMatrixTab from '../Components/InsurerMatrixTab/InsurerMatrixTab';
import Loader from '../../../common/Loader/Loader';

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setActiveTabIndex(index);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const backToInsurer = () => {
    history.replace('/insurer');
  };

  const tabs = ['Policies', 'Contacts', 'Matrix'];
  const insurerData = useSelector(({ insurer }) => insurer.insurerViewData);
  const { name, address, contactNumber, website, email } = useMemo(() => insurerData, [
    insurerData,
  ]);
  useEffect(() => {
    dispatch(getInsurerById(id));
  }, []);

  const syncInsurersDataOnClick = useCallback(() => {
    dispatch(syncInsurerData(id));
  }, [id]);

  if (!insurerData.name) {
    return <Loader />;
  }
  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToInsurer}>Insurer List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>View Insurer</span>
        </div>
        <div className="buttons-row">
          <Button buttonType="secondary" title="Sync With CRM" onClick={syncInsurersDataOnClick} />
        </div>
      </div>

      <div className="common-detail-container">
        <div className="common-detail-grid">
          <div className="common-detail-field">
            <span className="common-detail-title">Name</span>
            <Input
              type="text"
              value={name || '-'}
              name="name"
              placeholder="Please enter name"
              disabled
              borderClass="disabled-control"
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Address</span>
            <Input
              type="text"
              name="address"
              value={
                address ? `${address?.addressLine} ${address?.city}, ${address?.country}` : '-'
              }
              placeholder="Please enter address"
              disabled
              borderClass="disabled-control"
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Phone Number</span>
            <Input
              type="text"
              name="contactNumber"
              value={contactNumber || '-'}
              placeholder="1234567890"
              disabled
              borderClass="disabled-control"
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Email</span>
            <Input
              type="email"
              name="email"
              value={email || '-'}
              placeholder="abc@xyz.com"
              disabled
              borderClass="disabled-control"
            />
          </div>
          <div className="common-detail-field">
            <span className="common-detail-title">Website</span>
            <Input
              name="website"
              type="text"
              value={website || '-'}
              placeholder="www.trad.com"
              disabled
              borderClass="disabled-control"
            />
          </div>
        </div>
      </div>
      <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
      <div className="common-white-container">
        {activeTabIndex === 0 && <InsurerPoliciesTab />}
        {activeTabIndex === 1 && <InsurerContactTab />}
        {activeTabIndex === 2 && <InsurerMatrixTab />}
      </div>
    </>
  );
};

export default ViewInsurer;

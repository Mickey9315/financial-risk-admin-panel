import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Tab from '../../../common/Tab/Tab';
import {
  getInsurerById,
  resetInsurerViewData,
  setViewInsurerActiveTabIndex,
  syncInsurerData,
} from '../redux/InsurerAction';
import InsurerContactTab from '../Components/InsurerContactTab';
import Button from '../../../common/Button/Button';
import InsurerMatrixTab from '../Components/InsurerMatrixTab/InsurerMatrixTab';
import Loader from '../../../common/Loader/Loader';
import InsurerPoliciesTab from '../Components/InsurerPoliciesTab';

const INSURER_TABS_CONSTANTS = [
  { label: 'Contacts', component: <InsurerContactTab /> },
  { label: 'Matrix', component: <InsurerMatrixTab /> },
];

const ViewInsurer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const backToInsurer = () => {
    history.replace('/insurer');
  };
  const tabActive = index => {
    setViewInsurerActiveTabIndex(index);
    setActiveTabIndex(index);
  };

  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const viewInsurerActiveTabIndex = useSelector(
    ({ insurer }) => insurer?.viewInsurerActiveTabIndex ?? 0
  );
  const insurerData = useSelector(({ insurer }) => insurer?.insurerViewData ?? {});
  const { viewInsurerSyncInsurerDataButtonLoaderAction, viewInsurerPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const checkAccess = useCallback(
    accessFor => {
      const availableAccess =
        userPrivilegesData.filter(module => module.accessTypes.length > 0) ?? [];
      const isAccessible = availableAccess.filter(module => module?.name === accessFor);
      return isAccessible?.length > 0;
    },
    [userPrivilegesData]
  );

  const finalTabs = useMemo(() => {
    let temp = [...INSURER_TABS_CONSTANTS];
    if (checkAccess('policy')) {
      temp.splice(0, 0, { label: 'Policies', component: <InsurerPoliciesTab /> });
    }
    if (insurerData?.isDefault) temp = temp.filter(e => e.label !== 'Contacts');
    return temp;
  }, [INSURER_TABS_CONSTANTS, insurerData?.isDefault, checkAccess]);

  const { name, address, contactNumber, website, email } = useMemo(() => insurerData, [
    insurerData,
  ]);
  useEffect(() => {
    dispatch(getInsurerById(id));
    return () => {
      setViewInsurerActiveTabIndex(0);
      dispatch(resetInsurerViewData());
    };
  }, [id]);

  useEffect(() => {
    tabActive(viewInsurerActiveTabIndex);
  }, [viewInsurerActiveTabIndex]);

  const syncInsurersDataOnClick = useCallback(() => {
    dispatch(syncInsurerData(id));
  }, [id]);

  return (
    <>
      {!viewInsurerPageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToInsurer}>Insurer List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>View Insurer</span>
            </div>
            {!_.isEmpty(insurerData) && !insurerData?.isDefault && (
              <div className="buttons-row">
                <Button
                  buttonType="secondary"
                  title="Sync With CRM"
                  onClick={syncInsurersDataOnClick}
                  isLoading={viewInsurerSyncInsurerDataButtonLoaderAction}
                />
              </div>
            )}
          </div>
          {!_.isEmpty(insurerData) ? (
            <>
              <div className="common-detail-container">
                <div className="common-detail-grid view-insurer-grid">
                  <div className="common-detail-field">
                    <span className="common-detail-title">Name</span>
                    <span className="view-insurer-value">{name ?? '-'}</span>
                  </div>
                  <div className="common-detail-field">
                    <span className="common-detail-title">Address</span>
                    <span className="view-insurer-value">{`${
                      address
                        ? `${address?.addressLine}${address?.addressLine && ' '}${address?.city}${
                            address?.city && ', '
                          }${address?.country}`
                        : '-'
                    }`}</span>
                  </div>
                  <div className="common-detail-field">
                    <span className="common-detail-title">Phone Number</span>
                    <span className="view-insurer-value">
                      {contactNumber?.toString()?.trim()?.length > 0 ? contactNumber : '-'}
                    </span>
                  </div>
                  <div className="common-detail-field">
                    <span className="common-detail-title">Email</span>
                    <span className="view-insurer-value mail-id-value">{email ?? '-'}</span>
                  </div>
                  <div className="common-detail-field view-insurer-website">
                    <span className="common-detail-title">Website</span>
                    <a
                      href={website ?? ''}
                      target="_blank"
                      className="mail-id-value"
                      rel="noreferrer"
                      name="website"
                      placeholder="No value"
                    >
                      {website?.toString()?.trim()?.length > 0 ? website : '-'}
                    </a>
                  </div>
                </div>
              </div>
              <Tab
                tabs={finalTabs?.map(e => e.label)}
                tabActive={tabActive}
                activeTabIndex={activeTabIndex}
                className="mt-15"
              />
              <div className="common-white-container">{finalTabs?.[activeTabIndex]?.component}</div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default ViewInsurer;

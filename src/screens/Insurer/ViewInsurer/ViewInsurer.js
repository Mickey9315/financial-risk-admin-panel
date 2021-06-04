import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tab from "../../../common/Tab/Tab";
import { getInsurerById, setViewInsurerActiveTabIndex, syncInsurerData } from "../redux/InsurerAction";
import InsurerContactTab from "../Components/InsurerContactTab";
import InsurerPoliciesTab from "../Components/InsurerPoliciesTab";
import Button from "../../../common/Button/Button";
import InsurerMatrixTab from "../Components/InsurerMatrixTab/InsurerMatrixTab";
import Loader from "../../../common/Loader/Loader";

const INSURER_TABS = ["Policies", "Contacts", "Matrix"];

const ViewInsurer = () => {
  const TAB_COMPONENTS = [<InsurerPoliciesTab />, <InsurerContactTab />, <InsurerMatrixTab />];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const backToInsurer = () => {
    history.replace("/insurer");
  };
  const tabActive = index => {
    setViewInsurerActiveTabIndex(index);
    setActiveTabIndex(index);
  };

  const viewInsurerActiveTabIndex = useSelector(
    ({ insurer }) => insurer?.viewInsurerActiveTabIndex ?? 0
  );
  const insurerData = useSelector(({ insurer }) => insurer?.insurerViewData ?? {});
  const { viewInsurerSyncInsurerDataButtonLoaderAction, viewInsurerPageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const finalTabs = useMemo(() => {
    const temp = [...INSURER_TABS];
    if (insurerData?.isDefault) {
      temp.splice(0, 1);
    }
    return temp;
  }, [INSURER_TABS, insurerData?.isDefault]);

  const finalComponents = useMemo(() => {
    const temp = [...TAB_COMPONENTS];
    if (insurerData?.isDefault) {
      temp.splice(0, 1);
    }
    return temp;
  }, [TAB_COMPONENTS, insurerData?.isDefault]);

  const { name, address, contactNumber, website, email } = useMemo(
    () => insurerData,
    [insurerData]
  );
  useEffect(() => {
    dispatch(getInsurerById(id));
    return () => setViewInsurerActiveTabIndex(0);
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
            {!insurerData?.isDefault && (
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

          <div className="common-detail-container">
            <div className="common-detail-grid view-insurer-grid">
              <div className="common-detail-field">
                <span className="common-detail-title">Name</span>
                <span className="view-insurer-value">{name ?? "-"}</span>
              </div>
              <div className="common-detail-field">
                <span className="common-detail-title">Address</span>
                <span className="view-insurer-value">{`${
                  address
                    ? `${address?.addressLine}${address?.addressLine && " "}${address?.city}${
                      address?.city && ", "
                    }${address?.country}`
                    :"-"
                }`}</span>
              </div>
              <div className="common-detail-field">
                <span className="common-detail-title">Phone Number</span>
                <span className="view-insurer-value">
              {contactNumber?.toString()?.trim()?.length > 0 ? contactNumber:"-"}
            </span>
              </div>
              <div className="common-detail-field">
                <span className="common-detail-title">Email</span>
                <span className="view-insurer-value mail-id-value">{email ?? "-"}</span>
              </div>
              <div className="common-detail-field view-insurer-website">
                <span className="common-detail-title">Website</span>
                <a
                  href={website ?? ""}
                  target="_blank"
                  className="mail-id-value"
                  rel="noreferrer"
                  name="website"
                  placeholder="No value"
                >
                  {website?.toString()?.trim()?.length > 0 ? website:"-"}
                </a>
              </div>
            </div>
          </div>
          <Tab
            tabs={finalTabs}
            tabActive={tabActive}
            activeTabIndex={activeTabIndex}
            className="mt-15"
          />
          <div className="common-white-container">{finalComponents[activeTabIndex]}</div>
        </>
      ):(
        <Loader />
      )}
    </>
  );
};

export default ViewInsurer;

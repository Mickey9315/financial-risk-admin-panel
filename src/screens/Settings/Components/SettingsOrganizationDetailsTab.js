import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import Loader from '../../../common/Loader/Loader';
import {
  changeOrganizationDetails,
  getOrganizationDetails,
  resetSettingTabsData,
  updateOrganizationDetails,
} from '../redux/SettingAction';
import { errorNotification } from '../../../common/Toast';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const SettingsOrganizationDetailsTab = () => {
  const organizationDetail = useSelector(
    ({ settingReducer }) => settingReducer?.organizationDetails ?? {}
  );

  const {
    settingUpdateOrganizationDetailsButtonLoaderAction,
    settingOrganizationTabLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrganizationDetails());
  }, []);

  const [isEdit, setIsEdit] = useState(false);
  const isSettingsUpdatable = useModulePrivileges(SIDEBAR_NAMES.SETTINGS).hasWriteAccess;

  const settingsOrganizationDetails = [
    {
      title: 'Company Name',
      name: 'name',
      errorName: 'company name',
      placeholder: 'Enter company name',
      value: organizationDetail?.name,
    },
    {
      title: 'Website',
      name: 'website',
      errorName: 'website',
      placeholder: 'Enter website',
      value: organizationDetail?.website,
    },
    {
      title: 'Contact',
      name: 'contactNumber',
      errorName: 'contact number',
      placeholder: 'Enter contact',
      value: organizationDetail?.contactNumber,
    },
    {
      title: 'Location',
      name: 'address',
      errorName: 'location',
      placeholder: 'Enter location',
      value: organizationDetail?.address,
    },
    {
      title: 'Email',
      name: 'email',
      errorName: 'email',
      placeholder: 'Enter email',
      value: organizationDetail?.email,
    },
  ];

  const onChangeOrganization = e => {
    const { name, value } = e.target;
    dispatch(changeOrganizationDetails({ name, value }));
  };

  const [errorElementList, setErrorElementList] = useState([]);

  const onSaveOrganizationDetails = useCallback(async () => {
    let checkCondition = false;
    let tempArray = [];
    settingsOrganizationDetails.forEach((record, index) => {
      if (record.value.toString().trim().length === 0) {
        tempArray = tempArray.concat([index]);
        checkCondition = true;
        errorNotification('No value should be blank');
      }
    });
    setErrorElementList(tempArray);
    if (!checkCondition) {
      try {
        await dispatch(updateOrganizationDetails({ ...organizationDetail }));
        setErrorElementList([]);
        setIsEdit(false);
      } catch (e) {
        /**/
      }
    }
  }, [setIsEdit, organizationDetail]);

  const onCancelEdit = useCallback(() => {
    if (errorElementList.length <= 0) {
      setIsEdit(false);
      dispatch(getOrganizationDetails());
      setErrorElementList([]);
    }
  }, [setIsEdit]);

  useEffect(() => {
    return () => {
      dispatch(resetSettingTabsData());
    };
  }, []);

  return (
    <>
      {!settingOrganizationTabLoader ? (
        (() =>
          !_.isEmpty(organizationDetail) ? (
            <>
              <div className="d-flex just-end mt-15">
                {isSettingsUpdatable && (
                  <Button buttonType="primary" title="Edit" onClick={() => setIsEdit(true)} />
                )}
                {isEdit && (
                  <div className="buttons-row">
                    <Button
                      buttonType="primary"
                      title="Save"
                      onClick={onSaveOrganizationDetails}
                      isLoading={settingUpdateOrganizationDetailsButtonLoaderAction}
                    />
                    <Button buttonType="danger" title="Cancel" onClick={onCancelEdit} />
                  </div>
                )}
              </div>
              <div className="common-white-container settings-organization-details">
                <div className="settings-organization-details-row">
                  {settingsOrganizationDetails.map((detail, index) => (
                    <>
                      <span>{detail.title}</span>
                      <div>
                        {isEdit ? (
                          <Input
                            type="text"
                            name={detail.name}
                            placeholder={detail.placeholder}
                            onChange={e => onChangeOrganization(e)}
                            value={detail?.value}
                          />
                        ) : (
                          <div
                            className={`settings-organization-details-value ${
                              detail?.title === 'website' || ('email' && 'mail-id-value')
                            }`}
                          >
                            {detail?.value}
                          </div>
                        )}

                        {errorElementList.includes(index) && (
                          <div className="settings-no-value-error">
                            Please enter {detail.errorName}.
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};
export default SettingsOrganizationDetailsTab;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import Loader from '../../../common/Loader/Loader';
import {
  changeApiIntegrationDetails,
  getApiIntegration,
  resetSettingTabsData,
  testApiIntegrationDetails,
  updateApiIntegrationDetails,
} from '../redux/SettingAction';

const SettingsApiIntegrationTab = () => {
  const dispatch = useDispatch();
  const apiIntegrationData = useSelector(
    ({ settingReducer }) => settingReducer?.apiIntegration ?? {}
  );

  const apiIntegrationDetails = useMemo(() => apiIntegrationData?.integration ?? {}, [
    apiIntegrationData,
  ]);

  const [errorElementList, setErrorElementList] = useState([]);
  const { illion, rss, abn, nzbn } = useMemo(() => apiIntegrationDetails ?? {}, [
    apiIntegrationDetails,
  ]);

  const settingsApiIntegrationRow = useMemo(
    () => [
      // {
      //   title: 'Equifax',
      //   name: 'equifax',
      //   className: 'equifax-row-container',
      //   inputs: [
      //     {
      //       title: 'User name',
      //       name: 'username',
      //       placeholder: 'Enter user name',
      //       value: equifax?.username ?? '-',
      //     },
      //     {
      //       title: 'Password',
      //       name: 'password',
      //       placeholder: 'Enter password',
      //       value: equifax?.password ?? '-',
      //     },
      //   ],
      // },
      {
        title: 'Illion',
        name: 'illion',
        inputs: [
          {
            title: 'User Id',
            name: 'userId',
            placeholder: 'Enter user ID',
            value: illion?.userId ?? '-',
          },
          {
            title: 'Subscriber ID',
            name: 'subscriberId',
            placeholder: 'Enter subscriber ID',
            value: illion?.subscriberId ?? '-',
          },
          {
            title: 'Password',
            name: 'password',
            placeholder: 'Enter password',
            value: illion?.password ?? '-',
          },
        ],
      },
      {
        title: 'Really Simple Systems',
        name: 'rss',
        inputs: [
          {
            title: 'Access Token',
            name: 'accessToken',
            placeholder: 'Enter access token',
            type: 'textarea',
            value: rss?.accessToken ?? '-',
          },
        ],
      },
      {
        title: 'NZBN',
        name: 'nzbn',
        inputs: [
          {
            title: 'Access Token',
            name: 'accessToken',
            placeholder: 'Enter access token',
            type: 'textarea',
            value: nzbn?.accessToken ?? '-',
          },
        ],
      },
      {
        title: 'Australian Business Register',
        name: 'abn',
        inputs: [
          {
            title: 'GUID',
            name: 'guid',
            placeholder: 'Enter GUID',
            value: abn?.guid ?? '-',
            className: 'abn-guid-input',
          },
        ],
      },
    ],
    [apiIntegrationDetails]
  );

  const [isTestItemIndex, setIsTestItemIndex] = useState(null);
  const [isEditItemIndex, setIsEditItemIndex] = useState(null);
  const onEditItemIndex = useCallback(
    i => {
      if (errorElementList.length <= 0) setIsEditItemIndex(i);
    },
    [setIsEditItemIndex, errorElementList]
  );

  const {
    settingApiIntegrationButtonLoaderAction,
    settingApiIntegrationTestButtonLoaderAction,
    settingApiIntegrationDetailsLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const onInputValueChange = useCallback((row, e) => {
    const { name, value } = e.target;
    const apiName = row?.name;
    dispatch(changeApiIntegrationDetails({ name, value, apiName }));
  }, []);

  const onSaveItem = useCallback(
    async row => {
      let checkCondition = false;
      let tempArray = [];

      row.inputs.forEach((input, i) => {
        if ((input?.value?.toString()?.trim()?.length ?? -1) === 0) {
          tempArray = tempArray?.concat([i]) ?? [];
          checkCondition = true;
        }
      });
      setErrorElementList(tempArray);

      if (!checkCondition) {
        const apiName = row?.name;
        await dispatch(updateApiIntegrationDetails({ apiName, ...apiIntegrationDetails[apiName] }));
        setErrorElementList([]);
        setIsEditItemIndex(-1);
      }
    },
    [apiIntegrationDetails, setErrorElementList, setIsEditItemIndex]
  );

  const onTestItem = useCallback(
    async row => {
      let checkCondition = false;
      let tempArray = [];

      row.inputs.forEach((input, i) => {
        if ((input?.value?.toString()?.trim()?.length ?? -1) === 0) {
          tempArray = tempArray?.concat([i]) ?? [];
          checkCondition = true;
        }
      });
      setErrorElementList(tempArray);

      if (!checkCondition) {
        const apiName = row?.name;
        await dispatch(testApiIntegrationDetails({ apiName }));
        setErrorElementList([]);
        setIsTestItemIndex(-1);
      }
    },
    [apiIntegrationDetails, setErrorElementList, setIsTestItemIndex]
  );

  const onCancelEditItemIndex = useCallback(() => {
    if (errorElementList.length <= 0) setIsEditItemIndex(-1);
    dispatch(getApiIntegration());
  }, [setIsEditItemIndex, errorElementList]);

  useEffect(() => {
    dispatch(getApiIntegration());
    setErrorElementList([]);
    return () => {
      dispatch(resetSettingTabsData());
    };
  }, []);

  return (
    <>
      {!settingApiIntegrationDetailsLoader ? (
        (() =>
          !_.isEmpty(apiIntegrationDetails) ? (
            <>
              <div className="common-white-container settings-api-integration-container">
                {settingsApiIntegrationRow.map((row, index) => (
                  <div className="settings-row">
                    <div>
                      <div className="title">{row.title}</div>
                      <div className={`settings-input-container ${row?.className}`}>
                        {row.inputs.map((input, inputIndex) => (
                          <>
                            <span
                              className="settings-row-input-title"
                              style={{ alignSelf: input.type === 'textarea' && 'baseline' }}
                            >
                              {input.title}
                            </span>
                            <div
                              className={`${
                                (input?.name === 'accessToken' || input.name === 'guid') &&
                                'rss-access-token'
                              }`}
                            >
                              {/* eslint-disable-next-line no-nested-ternary */}
                              {input?.type !== 'textarea' ? (
                                <Input
                                  type="text"
                                  placeholder={input.placeholder}
                                  name={input.name}
                                  value={input.value}
                                  testValue={input.value}
                                  onChange={e => onInputValueChange(row, e)}
                                  disabled={index !== isEditItemIndex}
                                  borderClass={`${input?.className} ${
                                    index !== isEditItemIndex ? 'disabled-control' : ''
                                  }`}
                                />
                              ) : index === isEditItemIndex ? (
                                <textarea
                                  rows={8}
                                  name={input.name}
                                  onChange={e => onInputValueChange(row, e)}
                                  placeholder={input.placeholder}
                                  value={input.value}
                                />
                              ) : (
                                <div className="rss-access-token">{input.value}</div>
                              )}{' '}
                              {index === isEditItemIndex &&
                                errorElementList.includes(inputIndex) && (
                                  <div className="settings-no-value-error">
                                    Please enter {input.title}.
                                  </div>
                                )}
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    {index !== isEditItemIndex ? (
                      <div className="buttons-row">
                        <Button
                          buttonType="primary"
                          title="Edit"
                          name={row.name}
                          onClick={() => onEditItemIndex(index)}
                        />
                        <Button
                          buttonType="primary"
                          title="Test"
                          name={row.name}
                          onClick={async () => {
                            setIsTestItemIndex(index);
                            await onTestItem(row, index);
                          }}
                          isLoading={
                            isTestItemIndex === index && settingApiIntegrationTestButtonLoaderAction
                          }
                        />
                      </div>
                    ) : (
                      <div className="buttons-row">
                        <Button
                          buttonType="primary"
                          title="Save"
                          onClick={() => onSaveItem(row, index)}
                          isLoading={
                            isEditItemIndex === index && settingApiIntegrationButtonLoaderAction
                          }
                        />
                        <Button
                          buttonType="danger"
                          title="Cancel"
                          onClick={() => onCancelEditItemIndex(row, index)}
                        />
                      </div>
                    )}
                  </div>
                ))}
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

export default SettingsApiIntegrationTab;

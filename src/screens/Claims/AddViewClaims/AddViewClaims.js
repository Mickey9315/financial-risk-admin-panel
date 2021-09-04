import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Switch from '../../../common/Switch/Switch';
import {
  DL_JUSTIFICATION,
  POD_RECEIVED,
  REIMBURSEMENT_REQUESTED,
  SECTOR,
  STAGE,
  UNDERWRITER,
} from './AddClaimsDropdownHelper';
import {
  getClaimDetails,
  getClaimsEntityList,
  handleClaimChange,
  resetClaimDetails,
} from '../redux/ClaimsAction';
import { addClaimsValidations } from './AddClaimsValidations';
import Loader from '../../../common/Loader/Loader';
import { setViewClientActiveTabIndex } from '../../Clients/redux/ClientAction';
import ClaimsTabContainer from '../components/ClaimsTabContainer';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';

const AddViewClaims = () => {
  const history = useHistory();
  const { isRedirected, redirectedFrom, fromId } = useMemo(
    () => history?.location?.state ?? {},
    [history]
  );
  const dispatch = useDispatch();
  const { type, id } = useParams();
  const clientList = useSelector(({ claims }) => claims?.claimsEntityList ?? []);
  const claimDetails = useSelector(({ claims }) => claims?.claimDetails ?? {});

  const backToClaimsList = useCallback(() => {
    if (isRedirected) {
      if (redirectedFrom === 'client') {
        setViewClientActiveTabIndex(4);
        history.replace(`/clients/client/view/${fromId}`);
      }
    } else history.replace('/claims');
  }, [history, isRedirected, redirectedFrom, fromId]);

  const { viewClaimLoader, saveClaimsButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const claimClientList = clientList?.map(client => {
    return { name: 'accountid', label: client?.label, value: client?.value };
  });

  const changeClaimDetails = useCallback(
    (name, value) => dispatch(handleClaimChange(name, value)),
    []
  );

  const onHandleInputTextChange = useCallback(e => {
    const { name, value } = e.target;
    changeClaimDetails(name, value);
  }, []);

  const onHandleAmountInputTextChange = useCallback(e => {
    const { name, value } = e.target;
    dispatch(handleClaimChange(name, parseInt(value?.toString()?.replaceAll(',', ''), 10)));
  }, []);

  const onHandleSelectChange = useCallback(e => {
    changeClaimDetails(e.name, e);
  }, []);

  const handleDateInputChange = useCallback((name, e) => {
    changeClaimDetails(name, e);
  }, []);

  const onHandleSwitchChange = useCallback(e => {
    const { name, checked } = e.target;
    changeClaimDetails(name, checked);
  }, []);

  const inputClaims = useMemo(
    () => [
      {
        name: 'accountid',
        title: 'Client Name',
        placeholder: 'Select',
        type: 'select',
        options: claimClientList,
        value: claimDetails?.accountid,
        isRequired: true,
      },
      {
        name: 'name',
        title: 'Claim Name',
        isRequired: true,
        placeholder: 'Enter claim name',
        type: 'input',
        value: claimDetails?.name,
      },
      {
        name: 'podreceived',
        title: 'POD Received',
        placeholder: 'Select',
        type: 'select',
        options: POD_RECEIVED,
        value: claimDetails?.podreceived,
      },
      {
        name: 'podsenttouw',
        title: 'POD Sent to U/W',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.podsenttouw,
      },
      {
        name: 'codrequested',
        title: 'COD Requested',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.codrequested,
      },
      {
        name: 'notifiedofcase',
        title: 'Notified of Case',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.notifiedofcase,
      },
      {
        name: 'codreceived',
        title: 'COD Received',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.codreceived,
      },
      {
        name: 'claimsinforequested',
        title: 'Claims Info Requested',
        isRequired: true,
        type: 'switch',
        value: claimDetails?.claimsinforequested,
      },
      {
        name: 'grossdebtamount',
        title: 'Gross Debt Amount',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.grossdebtamount,
      },
      {
        name: 'claimsinforeviewed',
        title: 'Claims Info Reviewed',
        type: 'switch',
        value: claimDetails?.claimsinforeviewed,
      },
      {
        name: 'amountpaid',
        title: 'Amount Paid',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.amountpaid,
      },
      {
        name: 'tradinghistory',
        title: 'Trading History',
        type: 'switch',
        value: claimDetails?.tradinghistory,
      },
      {
        name: 'receivedlolfromuw',
        title: 'Received LOL from U/ W',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.receivedlolfromuw,
      },
      {
        name: 'dljustification',
        title: 'D/ L Justification',
        placeholder: 'Select',
        type: 'select',
        options: DL_JUSTIFICATION,
        value: claimDetails?.dljustification,
      },
      {
        name: 'claimpaidbyuw',
        title: 'Claim Paid by U/ W',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.claimpaidbyuw,
      },
      {
        name: 'underwriter',
        title: 'Underwriter',
        placeholder: 'Select',
        type: 'select',
        isRequired: true,
        options: UNDERWRITER,
        value: claimDetails?.underwriter,
      },
      {
        name: 'reimbursementrequired',
        title: 'Reimbursement Required',
        type: 'switch',
        value: claimDetails?.reimbursementrequired,
      },
      {
        name: 'reimbursementreceived',
        title: 'Reimbursement Received',
        type: 'date',
        placeholder: 'Select',
        value: claimDetails?.reimbursementreceived,
      },
      {
        name: 'description',
        title: 'Notes',
        placeholder: 'Please enter',
        type: 'input',
        value: claimDetails?.description,
      },
      {
        name: 'reimbursementrequested',
        title: 'Reimbursement Requested',
        placeholder: 'Select',
        type: 'select',
        options: REIMBURSEMENT_REQUESTED,
        value: claimDetails?.reimbursementrequested,
      },
      {
        name: 'stage',
        title: 'Stage',
        placeholder: 'Select',
        type: 'select',
        isRequired: true,
        options: STAGE,
        value: claimDetails?.stage,
      },
      {
        name: 'reimbursementspaid',
        title: 'Reimbursement Paid',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.reimbursementspaid,
      },
      {
        name: 'repaymentplanamount',
        title: 'Repayment Plan Amount',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.repaymentplanamount,
      },
      {
        name: 'dateofoldestinvoice',
        title: 'Date of Oldest Invoice',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.dateofoldestinvoice,
      },
      {
        name: 'instalmentamounts',
        title: 'Instalment Amount',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.instalmentamounts,
      },
      {
        name: 'sector',
        title: 'Sector',
        placeholder: 'Select',
        type: 'select',
        options: SECTOR,
        dropdownPlacement: 'top',
        value: claimDetails?.sector ?? [],
      },
      {
        name: 'frequency',
        title: 'Frequency',
        placeholder: 'Please enter',
        type: 'input',
        value: claimDetails?.frequency,
      },
      {
        name: 'datesubmittedtouw',
        title: 'Date Submitted to U/ W',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.datesubmittedtouw,
      },
      {
        name: 'repaymentplanlength',
        title: 'Repayment Plan Length',
        placeholder: 'Please enter',
        type: 'input',
        value: claimDetails?.repaymentplanlength,
      },
      {
        name: 'finalpaymentdate',
        title: 'Final Payment Date',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.finalpaymentdate,
      },
    ],
    [claimDetails, claimClientList]
  );

  const getComponentByType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'select':
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">
                  {input.value && input.value.toString().trim().length > 0 ? input?.value : '-'}
                </div>
              ) : (
                <ReactSelect
                  placeholder={input.placeholder}
                  options={input?.options}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={onHandleSelectChange}
                  menuPlacement={input?.dropdownPlacement}
                  value={input?.value ?? []}
                />
              )}
            </>
          );
          break;

        case 'date':
          component = (
            <>
              {type === 'view' ? (
                <span className="view-claim-detail">
                  {input?.value ? moment(input?.value).format('DD/MM/YYYY') : '-'}
                </span>
              ) : (
                <div className="date-picker-container">
                  <DatePicker
                    placeholderText={input.placeholder}
                    selected={input.value || null}
                    onChange={date => handleDateInputChange(input.name, date)}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    popperProps={{ positionFixed: true }}
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
              )}
            </>
          );
          break;

        case 'switch':
          component = (
            <Switch
              id={input.name}
              disabled={type === 'view'}
              name={input?.name}
              className={type === 'view' && 'view-claim-switch-disabled'}
              onChange={onHandleSwitchChange}
              checked={input?.value ?? false}
            />
          );
          break;

        case 'amount':
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">{NumberCommaSeparator(input?.value) ?? '-'}</div>
              ) : (
                <Input
                  type="text"
                  name={input?.name}
                  placeholder={input.placeholder}
                  onChange={onHandleAmountInputTextChange}
                  value={NumberCommaSeparator(input.value) ?? ''}
                />
              )}
            </>
          );
          break;

        default:
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">{input?.value ?? '-'}</div>
              ) : (
                <Input
                  type="text"
                  name={input?.name}
                  placeholder={input.placeholder}
                  onChange={onHandleInputTextChange}
                  value={input.value ?? ''}
                />
              )}
            </>
          );
          break;
      }
      return (
        <div className="d-flex align-center w-100">
          <span className="claims-title">
            {input.title}
            {input?.isRequired && <b className="f-16"> *</b>}
          </span>

          <div>
            {component}
            {claimDetails?.errors && (
              <div className="ui-state-error">{claimDetails?.errors?.[input.name]}</div>
            )}
          </div>
        </div>
      );
    },
    [inputClaims, claimDetails]
  );

  const onAddClaim = useCallback(async () => {
    await addClaimsValidations(dispatch, history, claimDetails);
  }, [claimDetails]);

  useEffect(() => {
    return () => {
      dispatch(resetClaimDetails());
    };
  }, []);

  useEffect(() => {
    dispatch(getClaimsEntityList());
    if (type === 'view') dispatch(getClaimDetails(id));
  }, [id, type]);

  return (
    <>
      {!viewClaimLoader ? (
        <>
          {' '}
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToClaimsList}>Claims List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>{type === 'view' ? 'View' : 'New'} Claim</span>
            </div>
          </div>
          <div
            className={`common-white-container add-claims-content ${
              type === 'view' && 'view-claim-content'
            }`}
          >
            {inputClaims.map(getComponentByType)}
          </div>
          {type === 'view' && <ClaimsTabContainer />}
          {type === 'add' && (
            <div className="add-overdues-save-button">
              <Button
                buttonType="primary"
                title="Save"
                onClick={onAddClaim}
                isLoading={saveClaimsButtonLoaderAction}
              />
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AddViewClaims;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { changeApplicationStatus } from '../../redux/ApplicationAction';
import Select from '../../../../common/Select/Select';
import { useModulePrivileges } from '../../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../../constants/SidebarConstants';
import { APPLICATION_REDUX_CONSTANTS } from '../../redux/ApplicationReduxConstants';

const LimitTypeOptions = [
  {
    label: 'Endorsed Limit',
    value: 'ENDORSED',
    name: 'limitType',
  },
  {
    label: 'Credit Check',
    value: 'CREDIT_CHECK',
    name: 'limitType',
  },
  {
    label: 'Credit Check NZ',
    value: 'CREDIT_CHECK_NZ',
    name: 'limitType',
  },
  {
    label: 'Health Check',
    value: 'HEALTH_CHECK',
    name: 'limitType',
  },
  {
    label: '24/7 Alerts',
    value: '247_ALERT',
    name: 'limitType',
  },
];

const ViewApplicationEditableRowComponent = props => {
  const { isApprovedOrDeclined } = props;

  const dispatch = useDispatch();
  const { id } = useParams();

  const [selectedLimitType, setSelectedLimitType] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
  const isUpdatable = useModulePrivileges(SIDEBAR_NAMES.APPLICATION).hasWriteAccess;
  const { applicationDetail } = useSelector(({ application }) => application?.viewApplication ?? {});

  const { limitType, isAllowToUpdate, expiryDate } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);
  const handleApplicationLimitTypeChange = 
    e => {
      setSelectedLimitType(e);
      try {
        const data = {
          update: 'field',
          limitType: e?.value,
        };
        dispatch(changeApplicationStatus(id, data));
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_EDITABLE_ROW_FIELD_CHANGE,
          fieldName: 'limitType',
          value: e?.value,
        });
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_EDITABLE_ROW_FIELD_CHANGE,
          fieldName:'limitTypeError',
          value:undefined
        });
      } catch (err) {
        /**/
      }
    }

  const aYearFromNow = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

  const handleExpiryDateChange = useCallback(
    e => {
      if(e === null){
        setSelectedExpiryDate(null);
        try {
          const dataNew = {
            update: 'field',
            expiryDate: aYearFromNow,
          };
          dispatch(changeApplicationStatus(id, dataNew));
          dispatch({
            type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_EDITABLE_ROW_FIELD_CHANGE,
            fieldName: 'expiryDate',
            value: aYearFromNow,
          });
        } catch (err) {
          /**/
        }
      }else{
      setSelectedExpiryDate(e);
      try {
        const data = {
          update: 'field',
          expiryDate: moment(e),
        };
        dispatch(changeApplicationStatus(id, data));
      } catch (err) {
        /**/
      }
      }
    },
    [id],
  );


  useEffect(() => {
    setSelectedLimitType(LimitTypeOptions.filter(e => e.value === limitType) ?? []);
    setSelectedExpiryDate(expiryDate);
  }, [limitType, expiryDate]);

  return (
    <div className="application-editable-row-grid">
      <div>
        <div className="font-field mt-10">Limit Type</div>
        <div className="mt-5 mr-10 view-application-select">
          <Select
            placeholder={!isApprovedOrDeclined && isAllowToUpdate ? 'Select Limit Type' : '-'}
            name="applicationStatus"
            className={
              !isUpdatable || !isAllowToUpdate || (isApprovedOrDeclined && 'view-application-limit-type-disabled')
            }
            value={selectedLimitType ?? []}
            options={LimitTypeOptions}
            isDisabled={!isUpdatable || !isAllowToUpdate || isApprovedOrDeclined}
            onChange={handleApplicationLimitTypeChange}
          />
          {applicationDetail?.limitTypeError && (
            <div className="ui-state-error">{applicationDetail?.limitTypeError}</div>
          )}
        </div>
      </div>
      <div className={!isUpdatable && 'ml-15'}>
        <div className="font-field mt-10">Expiry Date</div>
        {isUpdatable && isAllowToUpdate && !isApprovedOrDeclined  ? (
          <div
            className={`date-picker-container view-application-status `}
          >
            <DatePicker
              selected={selectedExpiryDate ? new Date(selectedExpiryDate) : null}
              onChange={handleExpiryDateChange}
              placeholderText='Select Expiry Date'
              minDate={new Date()}
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              dateFormat="dd/MM/yyyy"
            />
            <span className="material-icons-round">event</span>
          </div>
        ) : (
          <div className="f-14 font-primary mt-10 pt-5">
            {selectedExpiryDate
              ? moment(new Date(selectedExpiryDate)).format('DD-MM-YYYY')
              : moment(new Date(aYearFromNow)).format('DD-MM-YYYY')}
          </div>
        )}
      </div>
    </div>
  );
};

ViewApplicationEditableRowComponent.propTypes = {
  isApprovedOrDeclined: PropTypes.string.isRequired,
};

export default ViewApplicationEditableRowComponent;

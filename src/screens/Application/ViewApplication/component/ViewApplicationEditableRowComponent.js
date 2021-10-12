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
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { limitType, isAllowToUpdate, expiryDate } = useMemo(
    () => applicationDetail ?? {},
    [applicationDetail]
  );
  const handleApplicationLimitTypeChange = useCallback(
    e => {
      setSelectedLimitType(e);
      try {
        const data = {
          update: 'field',
          limitType: e?.value,
        };
        dispatch(changeApplicationStatus(id, data));
      } catch (err) {
        /**/
      }
    },
    [id]
  );

  const handleExpiryDateChange = useCallback(
    e => {
      setSelectedExpiryDate(e);
      try {
        const data = {
          update: 'field',
          expiryDate: e,
        };
        dispatch(changeApplicationStatus(id, data));
      } catch (err) {
        /**/
      }
    },
    [id]
  );

  useEffect(() => {
    setSelectedLimitType(LimitTypeOptions.filter(e => e.value === limitType) ?? []);
    setSelectedExpiryDate(expiryDate);
  }, [limitType, expiryDate]);

  return (
    <div className="application-editable-row-grid">
      <div>
        <div className="font-field mt-10">Limit Type</div>
        <div className="view-application-status">
          {isUpdatable ? (
            <Select
              placeholder={!isApprovedOrDeclined ? 'Select Limit Type' : '-'}
              name="applicationStatus"
              value={selectedLimitType ?? []}
              options={LimitTypeOptions}
              isDisabled={!isAllowToUpdate || isApprovedOrDeclined}
              onChange={handleApplicationLimitTypeChange}
            />
          ) : (
            selectedLimitType?.label ?? '-'
          )}
        </div>
      </div>
      <div className={!isUpdatable && 'ml-15'}>
        <div className="font-field mt-10">Expiry Date</div>
        {isUpdatable ? (
          <div
            className={`date-picker-container ${
              isApprovedOrDeclined && 'disabled-control'
            } view-application-status `}
          >
            <DatePicker
              selected={selectedExpiryDate ? new Date(selectedExpiryDate) : null}
              onChange={handleExpiryDateChange}
              placeholderText={!isApprovedOrDeclined ? 'Select Expiry Date' : '-'}
              minDate={new Date()}
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              disabled={!isAllowToUpdate || isApprovedOrDeclined}
              dateFormat="dd/MM/yyyy"
            />
            {isAllowToUpdate && !isApprovedOrDeclined && (
              <span className="material-icons-round">event</span>
            )}
          </div>
        ) : (
          <div className="view-application-status">
            {selectedExpiryDate ? moment(new Date(selectedExpiryDate)).format('DD-MM-YYYY') : '-'}
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

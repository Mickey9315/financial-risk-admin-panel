import ReactSelect from 'react-select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';
import { changeApplicationStatus } from '../../redux/ApplicationAction';

const LimitTypeOptions = [
  {
    label: 'Endorsed',
    value: 'ENDORSED',
    name: 'limitType',
  },
  {
    label: 'Discretionary Limit',
    value: 'DISCRETIONARY_LIMIT',
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
    label: 'Monitoring',
    value: 'MONITORING',
    name: 'limitType',
  },
];

const ViewApplicationEditableRowComponent = props => {
  const { isApprovedOrDeclined } = props;

  const dispatch = useDispatch();
  const { id } = useParams();

  const [selectedLimitType, setSelectedLimitType] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);

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
          <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder={!isApprovedOrDeclined ? 'Select Limit Type' : '-'}
            name="applicationStatus"
            value={selectedLimitType ?? []}
            options={LimitTypeOptions}
            isDisabled={!isAllowToUpdate || isApprovedOrDeclined}
            onChange={handleApplicationLimitTypeChange}
          />
        </div>
      </div>
      <div>
        <div className="font-field mt-10">Expiry Date</div>
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
            <span className="material-icons-round">event_available</span>
          )}
        </div>
      </div>
    </div>
  );
};

ViewApplicationEditableRowComponent.propTypes = {
  isApprovedOrDeclined: PropTypes.string.isRequired,
};

export default ViewApplicationEditableRowComponent;

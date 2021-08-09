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

  const { limitType, isAllowToUpdate, expiryDate } = useMemo(() => applicationDetail ?? {}, [
    applicationDetail,
  ]);

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
    setSelectedLimitType(limitType);
    setSelectedExpiryDate(expiryDate);
  }, [limitType]);

  return (
    <div className="application-editable-row-grid">
      <div>
        <div className="font-field mt-10">Limit Type</div>
        <div className="view-application-status">
          <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Limit Type"
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
        <div className="date-picker-container filter-date-picker-container view-application-status">
          <DatePicker
            className="filter-date-picker"
            selected={selectedExpiryDate ?? null}
            onChange={handleExpiryDateChange}
            placeholderText="Expiry Date"
            minDate={new Date()}
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            dateFormat="dd/MM/yyyy"
          />
          <span className="material-icons-round">event_available</span>
        </div>
      </div>
    </div>
  );
};

ViewApplicationEditableRowComponent.propTypes = {
  isApprovedOrDeclined: PropTypes.string.isRequired,
};

export default ViewApplicationEditableRowComponent;

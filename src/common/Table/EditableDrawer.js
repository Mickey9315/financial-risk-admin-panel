import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { changeApplicationStatus } from '../../screens/Application/redux/ApplicationAction';
import Select from '../Select/Select';

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

const EditableDrawer = props => {
  const { row, editableField, id, drawerData } = props;
  const dispatch = useDispatch();

  const [selectedLimitType, setSelectedLimitType] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(new Date());
  const isApprovedOrDeclined = useMemo(() => {
    const status = drawerData.find(data => data.label === 'Status');
    if (['Approved', 'Declined'].includes(status?.value)) return true;
    return false;
  }, [drawerData]);

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

  useEffect(() => {
    setSelectedLimitType(LimitTypeOptions.find(limitType => limitType?.name === row?.value));
    setSelectedExpiryDate(new Date(row?.value));
  }, [row]);

  return (
    <>
      {editableField === 'LIMIT_TYPE' &&
        (isApprovedOrDeclined ? (
          <div className="editable-drawer-field">
            <Select
              placeholder="Select Limit Type"
              name="limitType"
              value={selectedLimitType ?? []}
              options={LimitTypeOptions}
              onChange={handleApplicationLimitTypeChange}
            />
          </div>
        ) : (
          <div>{row?.value || '-'}</div>
        ))}
      {editableField === 'EXPIRY_DATE' &&
        (!isApprovedOrDeclined ? (
          <div className="editable-drawer-field">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedExpiryDate || new Date()}
                onChange={handleExpiryDateChange}
                placeholderText="Select Expiry Date"
                minDate={new Date()}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
              />
              <span className="material-icons-round">event_available</span>
            </div>
          </div>
        ) : (
          <div>{row?.value ? moment(row?.value)?.format('DD-MMM-YYYY') : '-'}</div>
        ))}
    </>
  );
};

EditableDrawer.propTypes = {
  row: PropTypes.object.isRequired,
  editableField: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  drawerData: PropTypes.array.isRequired,
};
export default EditableDrawer;

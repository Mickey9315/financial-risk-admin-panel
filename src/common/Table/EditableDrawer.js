import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { changeApplicationStatus } from '../../screens/Application/redux/ApplicationAction';
import Select from '../Select/Select';

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

const EditableDrawer = props => {
  const { row, editableField, dateType, id, drawerData } = props;
  const dispatch = useDispatch();

  const [selectedLimitType, setSelectedLimitType] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState('');
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

  const handleapprovalOrDecliningDate = useCallback(
    async e => {
      setSelectedExpiryDate(e);
      try {
        const data = {
          update: 'field',
          approvalOrDecliningDate: e,
        };
        await dispatch(changeApplicationStatus(id, data));
      } catch (err) {
        setSelectedExpiryDate(null);
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
    setSelectedLimitType(LimitTypeOptions.find(limitType => limitType?.value === row?.value));

    setSelectedExpiryDate(row?.value ? new Date(row?.value) : new Date());
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
      {editableField === 'DATE' &&
        (isApprovedOrDeclined ? (
          <div className="editable-drawer-field">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedExpiryDate ? new Date(selectedExpiryDate) : null}
                placeholderText="Select Expiry Date"
                onChange={
                  (dateType === 'Expiry Date' && handleExpiryDateChange) ||
                  (dateType === 'Approval Date' && handleapprovalOrDecliningDate)
                }
                minDate={dateType === 'Expiry Date' && new Date()}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
              />
              <span className="material-icons-round">event</span>
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
  dateType: PropTypes.string,
  drawerData: PropTypes.array.isRequired,
};

EditableDrawer.defaultProps = {
  dateType: '',
};

export default EditableDrawer;

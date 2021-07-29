import moment from 'moment';
import { NumberCommaSeparator } from './NumberCommaSeparator';

export const ALERT_TYPE_ROW = {
  Moderate: 'red-tag',
  High: 'secondary-tag',
  Low: 'alert-blue-tag',
};

export const checkAlertValue = row => {
  switch (row.type) {
    case 'dollar':
      return row?.value ? `$ ${NumberCommaSeparator(row?.value)}` : '-';
    case 'percent':
      return row?.value ? `${row?.value} %` : '-';
    case 'date':
      return row?.value ? moment(row?.value)?.format('DD-MMM-YYYY') : '-';
    default:
      return row?.value || '-';
  }
};

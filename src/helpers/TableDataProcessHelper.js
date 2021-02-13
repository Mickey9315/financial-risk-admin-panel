import moment from 'moment';

export const processTableDataByType = (type, rawValue) => {
  switch (type) {
    case 'date':
      return moment(rawValue).format('DD-MMM-YYYY');

    default:
      return rawValue;
  }
};

import moment from 'moment';

export const processTableDataByType = (type, rawValue) => {
  switch (type) {
    case 'date':
      return moment(rawValue).format('DD-MMM-YYYY');
    case 'modal':
      return <a href={`#${rawValue.value}`}>{rawValue.value}</a>;

    default:
      return rawValue;
  }
};

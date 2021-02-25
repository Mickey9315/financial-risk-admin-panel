import moment from 'moment';

export const processTableDataByType = ({ header, row, actions }) => {
  const { type } = header;
  const currentData = row[`${header.name}`];
  const { handleDrawerState } = actions;

  switch (type) {
    case 'date':
      return moment(currentData).format('DD-MMM-YYYY');
    case 'modal':
      return (
        <div className="link" onClick={() => handleDrawerState(header, currentData)}>
          {currentData.value}
        </div>
      );

    default:
      return currentData;
  }
};

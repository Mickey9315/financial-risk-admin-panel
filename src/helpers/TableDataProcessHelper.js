import moment from 'moment';
import React from 'react';
import Checkbox from '../common/Checkbox/Checkbox';

export const processTableDataByType = ({ header, row, actions }) => {
  const { type } = header;
  const currentData = row[`${header.name}`];
  const { handleDrawerState, handleCheckBoxState } = actions;

  switch (type) {
    case 'date':
      return moment(currentData).format('DD-MMM-YYYY');
    case 'modal':
      return (
        <div className="link" onClick={() => handleDrawerState(header, currentData)}>
          {currentData.value}
        </div>
      );
    case 'boolean':
      return (
        <Checkbox
          title={null}
          checked={currentData.value}
          onChange={e => handleCheckBoxState(e.target.checked, header, currentData)}
        />
      );
    case 'booleanString':
      return currentData ? 'Yes' : 'No';

    default:
      return currentData;
  }
};

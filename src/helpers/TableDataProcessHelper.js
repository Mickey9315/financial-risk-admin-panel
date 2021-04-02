import moment from 'moment';
import React from 'react';
import Checkbox from '../common/Checkbox/Checkbox';

export const processTableDataByType = ({ header, row, actions }) => {
  const { type } = header;
  const currentData = row[`${header.name}`];
  const { handleDrawerState, handleCheckBoxState, handleViewDocument } = actions;

  switch (type) {
    case 'date':
      return moment(currentData).format('DD-MMM-YYYY');
    case 'modal':
      return (
        <div className="link" onClick={() => handleDrawerState(header, currentData, row)}>
          {currentData.value || currentData}
        </div>
      );
    case 'boolean':
      return (
        <Checkbox
          title={null}
          checked={currentData?.value || currentData}
          onChange={e => handleCheckBoxState(e.target.checked, header, currentData, row)}
        />
      );
    case 'booleanString':
      return currentData ? 'Yes' : 'No';
    case 'link':
      return (
        <div className="link" onClick={() => handleViewDocument(header, row)}>
          {currentData}
        </div>
      );

    default:
      return currentData;
  }
};

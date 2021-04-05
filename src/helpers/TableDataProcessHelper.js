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
        <div className="d-flex just-center w-100">
          <Checkbox
            title={null}
            checked={currentData.value}
            onChange={e => handleCheckBoxState(e.target.checked, header, currentData)}
          />
        </div>
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

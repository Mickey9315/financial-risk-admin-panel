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
      if (currentData?.value) {
        return (
          <div
            className="link"
            onClick={e => {
              e.stopPropagation();
              handleDrawerState(header, currentData, row);
            }}
          >
            {currentData?.value}
          </div>
        );
      }
      return '-';

    case 'boolean':
      return (
        <div className="table-checkbox">
          <Checkbox
            title={null}
            checked={currentData?.value ?? currentData}
            onChange={e => handleCheckBoxState(e.target.checked, header, currentData, row)}
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

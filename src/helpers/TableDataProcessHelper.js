import moment from 'moment';
import React from 'react';
import Checkbox from '../common/Checkbox/Checkbox';
import { NumberCommaSeparator } from './NumberCommaSeparator';

export const processTableDataByType = ({ header, row, actions }) => {
  const { type } = header;
  const currentData = row[`${header.name}`];
  const { handleDrawerState, handleCheckBoxState, handleViewDocument, handleRedirectClick } =
    actions;

  switch (type) {
    case 'date':
      return currentData ? moment(currentData).format('DD-MMM-YYYY') : '-';
    case 'modal':
      if (currentData?.value) {
        return (
          <>
            {currentData?._id || currentData?.id ? (
              <div
                className="link"
                onClick={e => {
                  e.stopPropagation();
                  handleDrawerState(header, currentData, row);
                }}
              >
                {currentData?.value}
              </div>
            ) : (
              <div>{currentData?.value}</div>
            )}
          </>
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

    case 'endorsedString':
      return currentData && 'yes';

    case 'link':
      return (
        <div className="link" onClick={() => handleViewDocument(header, row)}>
          {currentData}
        </div>
      );

    case 'amount':
      return currentData ? NumberCommaSeparator(parseFloat(currentData)) : '-';

    case 'redirectLink':
      return <div onClick={() => handleRedirectClick(row)}>{currentData}</div>;

    default:
      return currentData;
  }
};

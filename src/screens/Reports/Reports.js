import React from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import { Link } from 'react-router-dom';
import { reportType } from '../../helpers/reportTypeHelper';

const Reports = () => {
  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Select Report Type</div>
      </div>
      <div className="report-container">
        {reportType.map(report => (
          <Tooltip
            overlayClassName="tooltip-top-class"
            placement="topLeft"
            mouseEnterDelay={0.5}
            overlay={
              <>
                Click to view <span className="report-tooltip">{`${report.name}`}</span>
              </>
            }
          >
            <Link to={`reports/${report.url}`} className="report">
              <span className="material-icons-round icon">assignment</span>
              <div className="report-title">{report.name}</div>
            </Link>
          </Tooltip>
        ))}
      </div>
    </>
  );
};

export default Reports;

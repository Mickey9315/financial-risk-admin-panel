import React from "react";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';

const Reports = () => {
    const reportType = [
        {
            name: 'Client List',
            onClick: ''
        },
        {
            name: 'Limit List',
            onClick: ''
        },
        {
            name: 'Pending Applications',
            onClick: ''
        },
        {
            name: 'Review Report',
            onClick: ''
        },
        {
            name: 'Usage Report',
            onClick: ''
        },
        {
            name: 'Usage per Client Report',
            onClick: ''
        },
        {
            name: 'Limit History Report',
            onClick: ''
        },
        {
            name: 'Claims Report',
            onClick: ''
        }
    ]
    return(<>
        <div className="page-header">
            <div className="page-header-name">Select Report Type</div>
        </div>
            <div className="report-container">
                {reportType.map((report, index) => (
                        <Tooltip overlayClassName="tooltip-top-class" placement="topLeft" mouseEnterDelay={0.5}
                                 overlay={<>Click to view <span className='report-tooltip'>{`${report.name}`}</span></>}>
                        <div className={`report ${index === 0 && 'report-selected'}`}>
                            <span className='material-icons-round icon'>assignment</span>
                            <div className="report-title">{report.name}</div>
                        </div>
                        </Tooltip>
                ))}

        </div></>)
}

export default Reports;

import React, { useMemo } from 'react';
import Tooltip from 'rc-tooltip';
import { useSelector } from 'react-redux';
import Table from '../../../../../common/Table/Table';

const ImportApplicationABNLookUpStep = () => {
  const { docs, headers, toBeProcessedApplicationCount } = useSelector(
    ({ application }) => application?.importApplication?.importData ?? {}
  );
  const ReasonColumn = useMemo(
    () => [
      data => (
        <span className="material-icons-round font-danger cursor-pointer">
          <Tooltip
            overlayClassName="tooltip-top-class"
            mouseEnterDelay={0.5}
            overlay={<span>{data?.reason ?? 'No value'}</span>}
            placement="topLeft"
          >
            <span>error</span>
          </Tooltip>
        </span>
      ),
    ],
    []
  );
  return (
    <div className="ia-validate-step">
      <div className="ia-validate-count">
        <div className="font-success f-16">{`To Be Processes : ${
          toBeProcessedApplicationCount ?? 0
        }`}</div>
        <div className="font-danger f-16 mt-10">{`Rejected : ${docs?.length ?? 0}`}</div>
      </div>
      {docs?.length > 0 && (
        <div className="ia-validate-table mt-10">
          <Table
            align="left"
            valign="center"
            tableClass="main-list-table"
            data={docs}
            headers={headers}
            rowClass="cursor-pointer"
            stepperColumn={ReasonColumn}
          />
        </div>
      )}
    </div>
  );
};

export default ImportApplicationABNLookUpStep;

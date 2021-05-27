import React from 'react';
import PropsType from 'prop-types';

const headers = ['Legal/Business Name', 'Location', 'Status', 'ABN'];

const ApplicationEntityNameTable = props => {
  const { data, handleEntityNameSelect } = props;
  return (
    <table className="table-class">
      <thead>
        {headers?.map(column => (
          <th width={10} style={{ backgroundColor: 'white' }}>
            {column}
          </th>
        ))}
      </thead>
      <tbody>
        {data?.map(row => (
          <tr>
            <td>
              <div className="link" onClick={() => handleEntityNameSelect(row)}>
                {typeof row?.label === 'string' ? row?.label : '-'}
              </div>
            </td>
            <td>
              {typeof row?.state === 'string' ? row?.state : '-'}/
              {typeof row?.postCode === 'string' ? row?.postCode : '-'}
            </td>
            <td>{typeof row?.status === 'string' ? row?.status : '-'}</td>
            <td>{typeof row?.abn === 'string' ? row?.abn : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

ApplicationEntityNameTable.propTypes = {
  data: PropsType.arrayOf(PropsType.object).isRequired,
  handleEntityNameSelect: PropsType.func.isRequired,
};

ApplicationEntityNameTable.defaultProps = {};

export default ApplicationEntityNameTable;

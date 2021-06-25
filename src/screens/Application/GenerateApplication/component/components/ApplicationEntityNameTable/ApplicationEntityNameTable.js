import React, { useCallback, useEffect, useState } from 'react';
import PropsType from 'prop-types';
import Loader from '../../../../../../common/Loader/Loader';

const ausHeaders = ['Legal/Business Name', 'Location', 'Status', 'ABN'];
const nzlHeaders = ['Legal/Business Name', 'Status', 'NZBN', 'NCN'];

const ApplicationEntityNameTable = props => {
  const {
    data,
    handleEntityNameSelect,
    selectedCountry,
    setCurrentPage,
    requestNewPage,
    hasMoreRecords,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  const headers = selectedCountry === 'NZL' ? nzlHeaders : ausHeaders;

  const handleScroll = useCallback(
    e => {
      if (
        e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
        hasMoreRecords &&
        selectedCountry === 'NZL'
      ) {
        setIsFetching(true);
        setCurrentPage(page => page + 1);
      }
    },
    [data?.length, hasMoreRecords]
  );

  useEffect(() => {
    if (!isFetching) return;
    setTimeout(async () => {
      await requestNewPage();
      setIsFetching(false);
    }, [500]);
  }, [isFetching]);

  return (
    <div className="application-entity-name-modal-search-records" onScroll={handleScroll}>
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
              {selectedCountry !== 'NZL' && (
                <td>
                  {typeof row?.state === 'string' ? row?.state : '-'}/
                  {typeof row?.postCode === 'string' ? row?.postCode : '-'}
                </td>
              )}
              <td>{typeof row?.status === 'string' ? row?.status : '-'}</td>
              <td>{typeof row?.abn === 'string' ? row?.abn : '-'}</td>{' '}
              {selectedCountry === 'NZL' && (
                <td>{typeof row?.acn === 'string' ? row?.acn : '-'}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isFetching && <Loader />}
    </div>
  );
};

ApplicationEntityNameTable.propTypes = {
  data: PropsType.arrayOf(PropsType.object).isRequired,
  handleEntityNameSelect: PropsType.func.isRequired,
  selectedCountry: PropsType.string.isRequired,
  setCurrentPage: PropsType.func.isRequired,
  requestNewPage: PropsType.func.isRequired,
  hasMoreRecords: PropsType.bool.isRequired,
};
export default ApplicationEntityNameTable;

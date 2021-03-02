import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Pagination from '../../../common/Pagination/Pagination';
import Table from '../../../common/Table/Table';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import Loader from '../../../common/Loader/Loader';
import { getClientNotesListDataAction } from '../redux/ClientAction';

const ClientNotesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // const [customFieldModal, setCustomFieldModal] = useState(false);
  // const toggleCustomField = () => setCustomFieldModal(e => !e);
  const clientNotesList = useSelector(({ clientManagement }) => clientManagement.notes.notesList);

  const { total, pages, page, limit, docs, headers } = useMemo(() => clientNotesList, [
    clientNotesList,
  ]);

  const getClientNotesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientNotesListDataAction(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getClientNotesList({ page: 1, limit: newLimit });
    },
    [getClientNotesList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientNotesList({ page: newPage, limit });
    },
    [limit, getClientNotesList]
  );

  useEffect(() => {
    getClientNotesList();
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Notes</div>
        <div className="buttons-row">
          <BigInput
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
          />
          <Button buttonType="success" title="Add" />
        </div>
      </div>
      {docs ? (
        <>
          <div className="common-list-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              headers={headers}
              refreshData={getClientNotesList}
            />
          </div>
          <Pagination
            className="common-list-pagination"
            total={total}
            pages={pages}
            page={page}
            limit={limit}
            pageActionClick={pageActionClick}
            onSelectLimit={onSelectLimit}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ClientNotesTab;

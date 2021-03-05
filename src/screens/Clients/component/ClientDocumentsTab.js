import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Pagination from '../../../common/Pagination/Pagination';
import Table from '../../../common/Table/Table';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import Loader from '../../../common/Loader/Loader';
import { getClientDocumentsListData } from '../redux/ClientAction';
import { errorNotification } from '../../../common/Toast';

const ClientDocumentsTab = () => {
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();

  const defaultFields = [
    'Name',
    'Job Title',
    'Email',
    'Portal Access',
    'Decision Maker',
    'Left Company',
  ];
  const customFields = [
    'Phone',
    'Trading As',
    'Net of brokerage',
    'Policy Type',
    'Expiry Date',
    'Inception Date',
  ];
  /* const columnStructure = {
    columns: [
      {
        type: 'checkbox',
        name: 'checkbox',
        value: 'checked',
      },
      {
        type: 'link',
        name: 'Claim',
        value: 'claim',
      },
      {
        type: 'date',
        name: 'Date Submitted',
        value: 'date_submitted',
      },
      {
        type: 'link',
        name: 'Debtor Name',
        value: 'debtor_name',
      },
      {
        type: 'text',
        name: 'Gross Debt Amount',
        value: 'gross_debt_amount',
      },
      {
        type: 'text',
        name: 'Amount Paid',
        value: 'amount_paid',
      },
      {
        type: 'text',
        name: 'Underwriter',
        value: 'underwriter',
      },
      {
        type: 'text',
        name: 'Stage',
        value: 'stage',
      },
    ],
    actions: [
      {
        type: 'edit',
        name: 'Edit',
        icon: 'edit-outline',
      },
      {
        type: 'delete',
        name: 'Delete',
        icon: 'trash-outline',
      },
    ],
  }; */

  const clientDocumentsList = useSelector(
    ({ clientManagement }) => clientManagement.documents.documentsList
  );
  const { total, pages, page, limit, docs, headers } = useMemo(() => clientDocumentsList, [
    clientDocumentsList,
  ]);
  const getClientDocumentsList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientDocumentsListData(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (e.target.value.trim().toString().length <= 1) {
      getClientDocumentsList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientDocumentsList({ search: searchKeyword.trim().toString() });
      } else {
        getClientDocumentsList();
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const pageActionClick = useCallback(
    newPage => {
      getClientDocumentsList({ page: newPage, limit });
    },
    [limit, getClientDocumentsList]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      getClientDocumentsList({ page: 1, limit: newLimit });
    },
    [getClientDocumentsList]
  );
  useEffect(() => {
    getClientDocumentsList();
  }, []);
  console.log('document list', clientDocumentsList);
  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Documents</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyDown={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
          <IconButton buttonType="primary" title="cloud_upload" />
          <IconButton buttonType="primary-1" title="cloud_download" />
          <Button buttonType="secondary" title="Sync With CRM" />
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
              // recordActionClick={onSelectUserRecordActionClick}
              refreshData={getClientDocumentsList}
              haveActions
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
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default ClientDocumentsTab;

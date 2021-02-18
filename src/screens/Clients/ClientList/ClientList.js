import React, { useCallback, useEffect, useMemo } from 'react';
import './ClientList.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';
import Select from '../../../common/Select/Select';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { getClientList } from '../redux/ClientAction';
import { processTableDataByType } from '../../../helpers/TableDataProcessHelper';

const ClientList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clientListWithPageData = useSelector(({ clientManagement }) => clientManagement.clientList);
  const { docs, headers } = useMemo(() => clientListWithPageData, [clientListWithPageData]);
  const tableData = useMemo(() => {
    return docs.map(e => {
      const finalObj = {
        id: e._id,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = processTableDataByType(f.type, e[`${f.name}`]);
      });

      return finalObj;
    });
  }, [docs]);

  useEffect(() => {
    dispatch(getClientList());
  }, []);

  const { total, pages, page, limit } = clientListWithPageData;

  const onSelectLimit = newLimit => {
    dispatch(getClientList({ page, limit: newLimit }));
  };

  const lastClick = newPage => {
    dispatch(getClientList({ page: newPage, limit }));
  };

  const firstClick = newPage => {
    dispatch(getClientList({ page: newPage, limit }));
  };

  const prevClick = newPage => {
    dispatch(getClientList({ page: newPage, limit }));
  };

  const nextClick = newPage => {
    dispatch(getClientList({ page: newPage, limit }));
  };

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = () => setFilterModal(e => !e);
  const filterModalButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: toggleFilterModal },
    { title: 'Apply', buttonType: 'primary' },
  ];
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = () => setCustomFieldModal(e => !e);
  const customFieldsModalButtons = [
    { title: 'Reset Defaults', buttonType: 'outlined-primary' },
    { title: 'Close', buttonType: 'primary-1', onClick: toggleCustomField },
    { title: 'Save', buttonType: 'primary' },
  ];
  const defaultFields = [
    'Client Name',
    'Client Id',
    'Country',
    'Address',
    'Created Date',
    'Modified Date',
  ];
  const customFields = [
    'Phone',
    'Trading As',
    'Net of brokerage',
    'Policy Type',
    'Expiry Date',
    'Inception Date',
  ];
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const onClickAddFromCRM = useCallback(() => {}, []);

  const openViewClient = useCallback(
    id => {
      history.replace(`/clients/client/view/${id}`);
    },
    [history]
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Client List</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            onClick={toggleFilterModal}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            className="mr-10"
            onClick={toggleCustomField}
          />
          <Button title="Add From CRM" buttonType="success" onClick={onClickAddFromCRM} />
        </div>
      </div>
      <div className="common-list-container">
        <Table
          align="left"
          valign="center"
          recordSelected={openViewClient}
          data={tableData}
          header={headers}
          rowClass="client-list-row"
        />
      </div>
      <Pagination
        className="common-list-pagination"
        total={total}
        pages={pages}
        page={page}
        limit={limit}
        nextClick={nextClick}
        prevClick={prevClick}
        firstClick={firstClick}
        lastClick={lastClick}
        onSelectLimit={onSelectLimit}
      />
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Role</div>
            <Select className="filter-select" placeholder="Select" />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
                className="filter-date-picker"
                selected={endDate}
                onChange={date => setEndDate(date)}
              />
              <span className="material-icons-round">event_available</span>
            </div>
          </div>
        </Modal>
      )}
      {customFieldModal && (
        <Modal
          headerIcon="format_line_spacing"
          header="Custom Fields"
          buttons={customFieldsModalButtons}
          className="custom-field-modal"
        >
          <div className="custom-field-content">
            <div>
              <div className="custom-field-title">Default Fields</div>
              {defaultFields.map(e => (
                <Checkbox title={e} />
              ))}
            </div>
            <div>
              <div className="custom-field-title">Custom Fields</div>
              {customFields.map(e => (
                <Checkbox title={e} />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ClientList;

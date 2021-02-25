import React, {useCallback, useEffect, useMemo} from 'react';
import './ClientList.scss';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-dropdown-select';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';
// import Checkbox from '../../../common/Checkbox/Checkbox';
import {
  changeClientColumnListStatus,
  getClientColumnListName,
  getClientList,
  saveClientColumnListName,
} from '../redux/ClientAction';
import {processTableDataByType} from '../../../helpers/TableDataProcessHelper';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import Drawer from '../../../common/Drawer/Drawer';
import { saveUserColumnListName } from '../../Users/redux/UserManagementAction';

// import { changeUserColumnListStatus } from '../../Users/redux/UserManagementAction';

const ClientList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clientListWithPageData = useSelector(({ clientManagement }) => clientManagement.clientList);
  const clientColumnList = useSelector(
    ({ clientManagementColumnList }) => clientManagementColumnList
  );
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

  const getClientListByFilter = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientList(data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientListByFilter({ page: newPage, limit });
    },
    [dispatch, limit, getClientListByFilter]
  );
  const onSelectLimit = useCallback(
    newLimit => {
      getClientListByFilter({ page: 1, limit: newLimit });
    },
    [dispatch, getClientListByFilter]
  );

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = () => setFilterModal(e => !e);
  const filterModalButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: toggleFilterModal },
    { title: 'Apply', buttonType: 'primary' },
  ];
  const [customFieldModal, setCustomFieldModal] = React.useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickSaveColumnSelection = useCallback(async () => {
    await dispatch(saveClientColumnListName({ clientColumnList }));
    toggleCustomField();
  }, [dispatch, toggleCustomField, clientColumnList]);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveUserColumnListName({ isReset: true }));
    dispatch(getClientColumnListName());
    toggleCustomField();
  }, [dispatch, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleCustomField() },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );
  /*  const defaultFields = [
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
  ]; */
  useEffect(() => {
    dispatch(getClientColumnListName());
  }, []);

  const { defaultFields, customFields } = useMemo(
    () => clientColumnList || { defaultFields: [], customFields: [] },
    [clientColumnList]
  );
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeClientColumnListStatus(data));
    },
    [dispatch]
  );

  const [addFromCRM, setAddFromCRM] = React.useState(false);
  const onClickAddFromCRM = useCallback(
    value => setAddFromCRM(value !== undefined ? value : e => !e),
    [setAddFromCRM]
  );
  const toggleAddFromCRM = () => setAddFromCRM(e => !e);
  const addToCRMButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: toggleAddFromCRM },
    { title: 'Add', buttonType: 'primary' },
  ];
  const openViewClient = useCallback(
    id => {
      history.replace(`/clients/client/view/${id}`);
    },
    [history]
  );
  const [searchClients, setSearchClients] = React.useState(false);
  const checkIfEnterKeyPressed = e => {
    if (e.key === 'Enter') {
      setSearchClients(val => !val);
    }
  };
  const crmList = [
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
    'A B Plastics Pty Ltd',
  ];
  const [state, setState] = React.useState(false);
  const clientListClicked = () => {
    setState(e => !e);
  };
  return (
    <>
      <div className="page-header">
        <div className="page-header-name" onClick={clientListClicked}>
          Client List
        </div>
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
            onClick={() => toggleCustomField()}
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
          headers={headers}
          rowClass="client-list-row"
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
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Role</div>
            <ReactSelect className="filter-select" placeholder="Select" searchable={false} />
          </div>
          <div className="filter-modal-row">
            <div className="form-title">Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                className="filter-date-picker"
                selected={startDate}
                onChange={date => setStartDate(date)}
                placeholderText="From Date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
            <div className="date-picker-container filter-date-picker-container">
              <DatePicker
                className="filter-date-picker"
                selected={endDate}
                onChange={date => setEndDate(date)}
                placeholderText="To Date"
              />
              <span className="material-icons-round">event_available</span>
            </div>
          </div>
        </Modal>
      )}
      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldsModalButtons}
        />
      )}
      {addFromCRM && (
        <Modal header="Add From CRM" className="add-to-crm-modal" buttons={addToCRMButtons}>
          <BigInput
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search clients"
            type="text"
            onKeyDown={checkIfEnterKeyPressed}
          />
          {searchClients && crmList.length > 0 && (
            <>
              <Checkbox title="Name" className="check-all-crmList" />
              <div className="crm-checkbox-list-container">
                {crmList.map(crm => (
                  <Checkbox title={crm} className="crm-checkbox-list" />
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
      <Drawer header="Contact Details" drawerState={state}>
        <div className="contacts-grid">
          <div className="title">Name</div>
          <div>Lorem ipsum</div>
          <div className="title">Job Title</div>
          <div>Lorem ipsum</div>
          <div className="title">Department</div>
          <div>$10000</div>
          <div className="title">Mainline</div>
          <div>Lorem ipsum</div>
          <div className="title">Direct</div>
          <div>Lorem ipsum</div>
          <div className="title">Mobile</div>
          <div>1234567890</div>
          <div className="title">Email</div>
          <div>lorem@email.com</div>
          <div className="title">Role</div>
          <div>Lorem ipsum</div>
          <div className="title">Decision Maker</div>
          <div>No</div>
          <div className="title">Hold</div>
          <div>No</div>
          <div className="title">Operator Code</div>
          <div>-</div>
          <div className="title">Password</div>
          <div>-</div>
          <div className="title">Link</div>
          <div>-</div>
          <div className="title">Left Company</div>
          <div>Yes</div>
          <div className="title">Local AddressLine</div>
          <div>-</div>
          <div className="title">Local City</div>
          <div>-</div>
          <div className="title">Local County/State</div>
          <div>-</div>
        </div>
      </Drawer>
    </>
  );
};

export default ClientList;

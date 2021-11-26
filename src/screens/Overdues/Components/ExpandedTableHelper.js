import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import TableApiService from '../../../common/Table/TableApiService';
import Drawer from '../../../common/Drawer/Drawer';
import { changeOverdueStatus } from '../redux/OverduesAction';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import Select from '../../../common/Select/Select';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
  id: '',
  drawerHeader: '',
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
        id: action.id,
        drawerHeader: action.drawerHeader,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return drawerInitialState;

    default:
      return state;
  }
};

const overdueStatusList = [
  { label: 'Reported to Insurer', value: 'REPORTED_TO_INSURER', name: 'status' },
  { label: 'Not Reportable', value: 'NOT_REPORTABLE', name: 'status' },
];

const ExpandedTableHelper = props => {
  const { docs, isRowExpanded, refreshData } = props;
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const handleDrawerState = useCallback(async data => {
    try {
      const response = await TableApiService.tableActions({
        url: 'overdue/details',
        method: 'get',
        id: data?._id,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data.response,
        drawerHeader: response.data.data.header,
        id: data?._id,
      });
    } catch (e) {
      /**/
    }
  }, []);

  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
    if (isStatusChanged) {
      setTimeout(() => refreshData(), 500);
    }
    setIsStatusChanged(false);
  }, [isStatusChanged, refreshData]);

  return (
    <>
      <TableLinkDrawer
        drawerState={drawerState}
        closeDrawer={closeDrawer}
        setIsStatusChanged={setIsStatusChanged}
      />
      <tr className={`expandable-table ${isRowExpanded && 'show-table'}`}>
        <td colSpan={20}>
          <div>
            <table width={100} cellSpacing={0}>
              <tr>
                <th>Name</th>
                <th>ACN</th>
                <th>Overdue Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
                <th>Submitted By</th>
              </tr>
              <tbody>
                {docs?.map(data => (
                  <tr
                    onClick={async e => {
                      e.stopPropagation();
                      await handleDrawerState(data);
                    }}
                  >
                    <td>{data?.name?.toString().trim().length > 0 ? data?.name : '-'}</td>
                    <td>{data?.acn?.toString().trim().length > 0 ? data?.acn : '-'}</td>
                    <td>{data?.overdueType ?? '-'}</td>
                    <td>{data?.amount?.toString().trim().length > 0 ? NumberCommaSeparator(data?.amount) : '-'}</td>
                    <td>{data?.overdueAction ?? '-'}</td>
                    <td>{data?.status ?? '-'}</td>
                    <td>{data?.createdById ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};
ExpandedTableHelper.propTypes = {
  docs: PropTypes.array.isRequired,
  isRowExpanded: PropTypes.bool.isRequired,
  refreshData: PropTypes.bool.isRequired,
};
export default ExpandedTableHelper;

const TableLinkDrawer = props => {
  const dispatch = useDispatch();
  const { drawerState, closeDrawer, setIsStatusChanged } = props;
  const isOverdueUpdatable = useModulePrivileges(SIDEBAR_NAMES.OVERDUE).hasWriteAccess;
  const currentStatus = useMemo(
    () => drawerState?.data?.filter(data => data?.type === 'status')?.[0],
    [drawerState]
  );
  const [status, setStatus] = useState(currentStatus?.value);

  const handleOverdueDrawerStatusChange = useCallback(
    async e => {
      try {
        const data = { status: e?.value };
        await dispatch(changeOverdueStatus(drawerState?.id, data));
        setStatus(e);
        setIsStatusChanged(true);
      } catch (err) {
        /**/
      }
    },
    [status, drawerState?.id, setIsStatusChanged]
  );
  const checkValue = row => {
    switch (row.type) {
      case 'status': {
        return isOverdueUpdatable ? (
          <Select
            name="overdueStatus"
            placeholder="Select Status"
            options={overdueStatusList}
            value={status ?? []}
            onChange={handleOverdueDrawerStatusChange}
          />
        ) : (
          <div>{status?.label ?? '-'}</div>
        );
      }
      case 'dollar':
        return row?.value ? `$ ${NumberCommaSeparator(row?.value)}` : '-';
      case 'percent':
        return row?.value ? `${row?.value} %` : '-';
      case 'date':
        return row?.value ? moment(row?.value)?.format('DD-MMM-YYYY') : '-';
      default:
        return row?.value || '-';
    }
  };

  useEffect(() => {
    if (currentStatus?.value?.value === 'SUBMITTED' && isOverdueUpdatable) {
      handleOverdueDrawerStatusChange({ label: 'Pending', value: 'PENDING', name: 'status' });
    } else {
      setStatus(currentStatus?.value);
    }
  }, [currentStatus?.value, SIDEBAR_NAMES, useModulePrivileges]);

  return (
    <Drawer
      header={drawerState.drawerHeader}
      drawerState={drawerState?.visible}
      closeDrawer={closeDrawer}
    >
      <div className="contacts-grid">
        {drawerState?.data?.map(row => (
          <>
            <div className="title">{row?.label}</div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
};

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
  setIsStatusChanged: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};

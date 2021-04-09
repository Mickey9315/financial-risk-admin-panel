import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import './Table.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import '../../../node_modules/react-tooltip/dist/index';
import Drawer from '../Drawer/Drawer';
import { processTableDataByType } from '../../helpers/TableDataProcessHelper';
import TableApiService from './TableApiService';
import Checkbox from '../Checkbox/Checkbox';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

export const TABLE_ROW_ACTIONS = {
  EDIT_ROW: 'EDIT_ROW',
  DELETE_ROW: 'DELETE_ROW',
};

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };

    default:
      return state;
  }
};

const Table = props => {
  const {
    tableClass,
    align,
    valign,
    headers,
    extraColumns,
    headerClass,
    data,
    rowClass,
    recordSelected,
    recordActionClick,
    refreshData,
    haveActions,
    showCheckbox,
    onChangeRowSelection,
  } = props;
  const tableClassName = `table-class ${tableClass}`;
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const handleDrawerState = useCallback(async (header, currentData, row) => {
    try {
      const response = await TableApiService.tableActions({
        url: header.request.url || header.request[currentData.type],
        method: header.request.method,
        id: currentData.id || currentData._id || row._id,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data,
      });
    } catch (e) {
      /**/
    }
  }, []);

  const handleCheckBoxState = useCallback(
    async (value, header, currentData, row) => {
      try {
        await TableApiService.tableActions({
          url: header.request.url,
          method: header.request.method,
          id: currentData.id || row._id,
          data: {
            [`${header.name}`]: value,
          },
        });
        refreshData();
      } catch (e) {
        /**/
      }
    },
    [refreshData]
  );

  const handleViewDocument = useCallback(async (header, row) => {
    try {
      const response = await TableApiService.viewDocument({
        url: header.request.url,
        method: header.request.method,
        id: row._id,
      });
      if (response.data.status === 'SUCCESS') {
        const url = response.data.data;
        window.open(url);
      }
    } catch (e) {
      /**/
    }
  }, []);

  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
  }, []);

  const tableData = useMemo(() => {
    const actions = {
      handleDrawerState,
      handleCheckBoxState,
      handleViewDocument,
    };

    return data.map(e => {
      const finalObj = {
        id: e._id,
      };
      headers.forEach(f => {
        finalObj[`${f.name}`] = processTableDataByType({ header: f, row: e, actions });
      });

      return finalObj;
    });
  }, [data, handleDrawerState, handleCheckBoxState, handleViewDocument]);

  const onRowSelectedDataChange = useCallback(
    current => {
      setSelectedRowData(prev => {
        const finalData = [...prev];
        const find = finalData.findIndex(e => e.id === current.id);

        if (find > -1) {
          finalData.splice(find, 1);
        } else {
          finalData.push(current);
        }

        return finalData;
      });
    },
    [setSelectedRowData, selectedRowData]
  );

  const onSelectAllRow = useCallback(() => {
    if (tableData.length !== 0) {
      if (selectedRowData.length === tableData.length) {
        setSelectedRowData([]);
      } else {
        setSelectedRowData(tableData);
      }
    }
  }, [setSelectedRowData, selectedRowData, tableData]);

  useEffect(() => {
    onChangeRowSelection(selectedRowData);
  }, [selectedRowData]);

  return (
    <>
      <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
      <ReactTooltip effect="float" />
      <table className={tableClassName}>
        <thead>
          {showCheckbox && (
            <th width={10} align={align} valign={valign}>
              <Checkbox
                className="crm-checkbox-list"
                checked={tableData.length !== 0 && selectedRowData.length === tableData.length}
                onChange={onSelectAllRow}
              />
            </th>
          )}
          {headers.length > 0 &&
            headers.map(heading => (
              <th align={align} valign={valign} className={headerClass}>
                {heading.label}
              </th>
            ))}
          {haveActions && <th style={{ position: 'sticky', right: 0 }} />}
        </thead>
        <tbody>
          {tableData.map(e => (
            <Row
              data={e}
              align={align}
              valign={valign}
              extraColumns={extraColumns}
              rowClass={rowClass}
              recordSelected={recordSelected}
              recordActionClick={recordActionClick}
              haveActions={haveActions}
              showCheckbox={showCheckbox}
              isSelected={selectedRowData.some(f => f.id === e.id)}
              onRowSelectedDataChange={onRowSelectedDataChange}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

Table.propTypes = {
  tableClass: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  headers: PropTypes.array,
  extraColumns: PropTypes.arrayOf(PropTypes.element),
  headerClass: PropTypes.string,
  data: PropTypes.array,
  rowClass: PropTypes.string,
  recordSelected: PropTypes.func,
  recordActionClick: PropTypes.func,
  refreshData: PropTypes.func,
  haveActions: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  onChangeRowSelection: PropTypes.func,
};

Table.defaultProps = {
  tableClass: '',
  align: 'left',
  valign: 'left',
  headers: [],
  headerClass: '',
  data: [],
  extraColumns: [],
  rowClass: '',
  haveActions: false,
  showCheckbox: false,
  recordSelected: () => {},
  recordActionClick: () => {},
  refreshData: () => {},
  onChangeRowSelection: () => {},
};

export default Table;

function Row(props) {
  const {
    align,
    valign,
    data,
    rowClass,
    recordSelected,
    haveActions,
    extraColumns,
    recordActionClick,
    showCheckbox,
    isSelected,
    onRowSelectedDataChange,
  } = props;

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const onClickActionToggleButton = useCallback(
    e => {
      e.persist();
      e.stopPropagation();
      const menuTop = e.clientY + 10;
      const menuLeft = e.clientX - 90;
      setShowActionMenu(prev => !prev);
      setMenuPosition({ top: menuTop, left: menuLeft });
      //    const remainingBottomDistance = window.outerHeight - e.screenY;
      //    const remainingRightDistance = window.outerWidth - e.screenX;
    },
    [setShowActionMenu, setMenuPosition]
  );
  const onClickAction = useCallback(
    (e, type) => {
      e.stopPropagation();
      recordActionClick(type, data.id, data);
      setShowActionMenu(false);
    },
    [recordActionClick, data, showActionMenu]
  );

  const onRowSelected = useCallback(() => {
    onRowSelectedDataChange(data);
  }, [onRowSelectedDataChange]);

  return (
    <>
      <tr
        onClick={() => recordSelected(data.id)}
        className={data?.isCompleted?.props.checked ? `completedTask ${rowClass}` : rowClass}
      >
        {showCheckbox && (
          <td width={10} align={align} valign={valign} className={rowClass}>
            <Checkbox className="crm-checkbox-list" checked={isSelected} onChange={onRowSelected} />
          </td>
        )}
        {Object.entries(data).map(([key, value]) => {
          switch (key) {
            case 'id':
              return null;
            case 'priority':
              return (
                <td
                  data-tip={data?.name?.props?.className === 'link' ? '' : value}
                  data-delay-show="100"
                  align={align}
                >
                  <span className={`task-priority-${value}`}>{value || '-'}</span>
                </td>
              );
            default:
              return (
                <td
                  data-tip={data?.name?.props?.className === 'link' ? '' : value}
                  data-delay-show="100"
                  align={align}
                >
                  {value || '-'}
                </td>
              );
          }
        })}
        {haveActions && (
          <td
            align="right"
            valign={valign}
            className={`fixed-action-menu ${showActionMenu && 'fixed-action-menu-clicked'}`}
          >
            <span
              className="material-icons-round cursor-pointer table-action"
              onClick={onClickActionToggleButton}
            >
              more_vert
            </span>
          </td>
        )}
        {extraColumns.map(element => (
          <td
            width={10}
            align={align}
            valign={valign}
            className={data?.isCompleted?.props.checked ? `completedTask ${rowClass}` : rowClass}
          >
            {element(data)}
          </td>
        ))}
      </tr>
      {showActionMenu && (
        <DropdownMenu style={menuPosition} toggleMenu={setShowActionMenu}>
          <div className="menu-name" onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.EDIT_ROW)}>
            <span className="material-icons-round">edit</span> Edit
          </div>
          <div className="menu-name" onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.DELETE_ROW)}>
            <span className="material-icons-round">delete</span> Delete
          </div>
        </DropdownMenu>
      )}
    </>
  );
}

Row.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  data: PropTypes.oneOf([PropTypes.object]),
  extraColumns: PropTypes.arrayOf(PropTypes.element),
  rowClass: PropTypes.string,
  recordSelected: PropTypes.func,
  haveActions: PropTypes.bool,
  isSelected: PropTypes.bool,
  recordActionClick: PropTypes.func,
  onRowSelectedDataChange: PropTypes.func,
  showCheckbox: PropTypes.bool,
};

Row.defaultProps = {
  align: 'left',
  valign: 'left',
  data: {},
  extraColumns: [],
  rowClass: '',
  recordSelected: () => {},
  haveActions: false,
  showCheckbox: false,
  isSelected: false,
  recordActionClick: () => {},
  onRowSelectedDataChange: () => {},
};

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;
  const checkValue = row => {
    switch (row.type) {
      case 'dollar':
        return row.value ? `$ ${row.value}` : '-';
      case 'percent':
        return row.value ? `${row.value} %` : '-';
      case 'date':
        return row.value ? moment(row.value).format('DD-MMM-YYYY') : '-';
      default:
        return row.value || '-';
    }
  };

  return (
    <Drawer header="Contact Details" drawerState={drawerState.visible} closeDrawer={closeDrawer}>
      <div className="contacts-grid">
        {drawerState.data.map(row => (
          <>
            <div className="title">{row.label}</div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
}

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};

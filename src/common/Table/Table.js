import React, { useCallback, useMemo, useReducer, useRef, useEffect } from 'react';
import './Table.scss';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';
import Drawer from '../Drawer/Drawer';
import { processTableDataByType } from '../../helpers/TableDataProcessHelper';
import TableApiService from './TableApiService';
import Checkbox from '../Checkbox/Checkbox';

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
    headerClass,
    data,
    rowClass,
    rowTitle,
    recordSelected,
    recordActionClick,
    refreshData,
    haveActions,
    showCheckbox,
    onChageRowSelection,
  } = props;

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const handleDrawerState = useCallback(async (header, currentData) => {
    try {
      const response = await TableApiService.tableActions({
        url: header.request.url,
        method: header.request.method,
        id: currentData.id,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data,
      });
    } catch (e) {
      /**/
    }
  }, []);

  const handleCheckBoxState = useCallback(async (value, header, currentData) => {
    try {
      await TableApiService.tableActions({
        url: header.request.url,
        method: header.request.method,
        id: currentData.id,
        data: {
          [`${header.name}`]: value,
        },
      });
      refreshData();
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
  }, [data, handleDrawerState, handleCheckBoxState]);

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
    onChageRowSelection(selectedRowData);
  }, [selectedRowData]);

  return (
    <>
      <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
      <table className={tableClass}>
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
          <th />
        </thead>
        <tbody>
          {tableData.map(e => (
            <Row
              data={e}
              align={align}
              valign={valign}
              rowClass={rowClass}
              rowTitle={rowTitle}
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
  headerClass: PropTypes.string,
  data: PropTypes.array,
  rowClass: PropTypes.string,
  rowTitle: PropTypes.string,
  recordSelected: PropTypes.func,
  recordActionClick: PropTypes.func,
  refreshData: PropTypes.func,
  haveActions: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  onChageRowSelection: PropTypes.func,
};

Table.defaultProps = {
  tableClass: '',
  align: 'left',
  valign: 'left',
  headers: [],
  headerClass: '',
  data: [],
  rowClass: '',
  rowTitle: '',
  haveActions: false,
  showCheckbox: false,
  recordSelected: () => {},
  recordActionClick: () => {},
  refreshData: () => {},
  onChageRowSelection: () => {},
};

export default Table;

function Row(props) {
  const {
    align,
    valign,
    data,
    rowClass,
    rowTitle,
    recordSelected,
    haveActions,
    recordActionClick,
    showCheckbox,
    isSelected,
    onRowSelectedDataChange,
  } = props;

  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const actionMenuRef = useRef();

  useOnClickOutside(actionMenuRef, () => setShowActionMenu(false));

  const onClickActionToggleButton = useCallback(
    e => {
      e.persist();
      e.stopPropagation();
      setShowActionMenu(prev => !prev);
    },
    [setShowActionMenu]
  );

  const onClickAction = useCallback(
    (e, type) => {
      e.stopPropagation();
      recordActionClick(type, data.id, data);
    },
    [recordActionClick, data]
  );

  const onRowSelected = useCallback(() => {
    onRowSelectedDataChange(data);
  }, [onRowSelectedDataChange]);

  return (
    <tr onClick={() => recordSelected(data.id)} className={rowClass}>
      {showCheckbox && (
        <td width={10} align={align} valign={valign} className={rowClass}>
          <Checkbox className="crm-checkbox-list" checked={isSelected} onChange={onRowSelected} />
        </td>
      )}
      {Object.entries(data).map(([key, value]) =>
        key !== 'id' ? (
          <td title={rowTitle} align={align}>
            {value}
          </td>
        ) : null
      )}
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
          {showActionMenu && (
            <div className="action-menu" ref={actionMenuRef}>
              <div
                className="menu-name"
                onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.EDIT_ROW)}
              >
                <span className="material-icons-round">edit</span> Edit
              </div>
              <div
                className="menu-name"
                onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.DELETE_ROW)}
              >
                <span className="material-icons-round">delete</span> Delete
              </div>
            </div>
          )}
        </td>
      )}
    </tr>
  );
}

Row.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  data: PropTypes.oneOf([PropTypes.object]),
  rowClass: PropTypes.string,
  rowTitle: PropTypes.string,
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
  rowClass: '',
  rowTitle: '',
  recordSelected: () => {},
  haveActions: false,
  showCheckbox: false,
  isSelected: false,
  recordActionClick: () => {},
  onRowSelectedDataChange: () => {},
};

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;

  return (
    <Drawer header="Contact Details" drawerState={drawerState.visible} closeDrawer={closeDrawer}>
      <div className="contacts-grid">
        {drawerState.data.map(row => (
          <>
            <div className="title">{row.label}</div>
            <div>{row.value}</div>
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

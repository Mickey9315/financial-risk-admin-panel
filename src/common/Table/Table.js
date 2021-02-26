import React, { useCallback, useMemo, useReducer, useRef } from 'react';
import './Table.scss';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';
import Drawer from '../Drawer/Drawer';
import { processTableDataByType } from '../../helpers/TableDataProcessHelper';
import TableApiService from './TableApiService';

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
    align,
    valign,
    headers,
    headerClass,
    data,
    rowClass,
    rowTitle,
    recordSelected,
    recordActionClick,
  } = props;

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);

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

  return (
    <>
      <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
      <table>
        <thead>
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
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

Table.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  headers: PropTypes.array,
  headerClass: PropTypes.string,
  data: PropTypes.array,
  rowClass: PropTypes.string,
  rowTitle: PropTypes.string,
  recordSelected: PropTypes.func,
  recordActionClick: PropTypes.func,
};

Table.defaultProps = {
  align: 'left',
  valign: 'left',
  headers: [],
  headerClass: '',
  data: [],
  rowClass: '',
  rowTitle: '',
  recordSelected: () => {},
  recordActionClick: () => {},
};

export default Table;

function Row(props) {
  const { align, valign, data, rowClass, rowTitle, recordSelected, recordActionClick } = props;

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
      recordActionClick(type, data.id);
    },
    [recordActionClick, data]
  );

  return (
    <tr onClick={() => recordSelected(data.id)} className={rowClass}>
      {Object.entries(data).map(([key, value]) =>
        key !== 'id' ? (
          <td title={rowTitle} align={align}>
            {value}
          </td>
        ) : null
      )}
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
            <div className="menu-name" onClick={e => onClickAction(e, TABLE_ROW_ACTIONS.EDIT_ROW)}>
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
  recordActionClick: PropTypes.func,
};

Row.defaultProps = {
  align: 'left',
  valign: 'left',
  data: {},
  rowClass: '',
  rowTitle: '',
  recordSelected: () => {},
  recordActionClick: () => {},
};

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;
  console.log({ drawerState });
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

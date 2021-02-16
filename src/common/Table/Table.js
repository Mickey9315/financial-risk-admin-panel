import React, { useCallback, useRef } from 'react';
import './Table.scss';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

export const TABLE_ROW_ACTIONS = {
  EDIT_ROW: 'EDIT_ROW',
  DELETE_ROW: 'DELETE_ROW',
};

const Table = props => {
  const {
    align,
    valign,
    headers,
    headerClass,
    data,
    rowClass,
    recordSelected,
    recordActionClick,
  } = props;

  return (
    <table>
      <thead>
        {headers.length > 0 &&
          headers.map(heading => (
            <th align={align} valign={valign} className={headerClass}>
              {heading.label}
            </th>
          ))}
      </thead>
      <tbody>
        {data.map(e => (
          <Row
            data={e}
            align={align}
            valign={valign}
            rowClass={rowClass}
            recordSelected={recordSelected}
            recordActionClick={recordActionClick}
          />
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  headers: PropTypes.array,
  headerClass: PropTypes.string,
  data: PropTypes.array,
  rowClass: PropTypes.string,
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
  recordSelected: () => {},
  recordActionClick: () => {},
};

export default Table;

function Row(props) {
  const { align, valign, data, rowClass, recordSelected, recordActionClick } = props;

  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const actionMenuRef = useRef();

  useOnClickOutside(actionMenuRef, () => setShowActionMenu(false));

  const onClickActionToggleButton = useCallback(
    e => {
      e.persist();
      e.stopPropagation();
      setShowActionMenu(prev => !prev);
      /*  const posX = e.offset().left;
      const posY = e.offset().top; */
      console.log(`e.pageX: ${e.offsetX}, e.pageY:${e.offsetY} `);
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
        key !== 'id' ? <td align={align}>{value}</td> : null
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
  recordSelected: PropTypes.func,
  recordActionClick: PropTypes.func,
};

Row.defaultProps = {
  align: 'left',
  valign: 'left',
  data: {},
  rowClass: '',
  recordSelected: () => {},
  recordActionClick: () => {},
};

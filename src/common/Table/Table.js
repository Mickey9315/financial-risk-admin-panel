import React from 'react';
import './Table.scss';
import PropTypes from 'prop-types';

const Table = props => {
  const { align, valign, headers, headerClass, data, rowClass, recordSelected } = props;

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
};

Table.defaultProps = {
  align: 'left',
  valign: 'left',
  headers: [],
  headerClass: '',
  data: [],
  rowClass: '',
  recordSelected: () => {},
};

export default Table;

function Row(props) {
  const { align, valign, data, rowClass, recordSelected } = props;

  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const onClickAction = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionMenu(prev => !prev);
  };

  return (
    <tr onClick={() => recordSelected(data.id)} className={rowClass}>
      {Object.entries(data).map(([key, value]) =>
        key !== 'id' ? <td align={align}>{value}</td> : null
      )}
      <td align="right" valign={valign} className="fixed-action-menu">
        <span className="material-icons-round cursor-pointer table-action" onClick={onClickAction}>
          more_vert
        </span>
        {showActionMenu && (
          <div className="action-menu">
            <div className="menu-name">
              <span className="material-icons-round">edit</span> Edit
            </div>
            <div className="menu-name">
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
};

Row.defaultProps = {
  align: 'left',
  valign: 'left',
  data: {},
  rowClass: '',
  recordSelected: () => {},
};

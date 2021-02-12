import React from 'react';
import './Table.scss';
import PropTypes from 'prop-types';

const Table = props => {
  const { align, valign, headers, headerClass, data, rowClass, recordSelected } = props;
  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const onClickAction = () => setShowActionMenu(true);

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
          <tr onClick={recordSelected} className={rowClass}>
            {Object.entries(e).map(([key, value]) =>
              key !== 'id' ? <td align={align}>{value}</td> : null
            )}
            <td align="right" valign={valign} className="fixed-action-menu">
              <span
                className="material-icons-round cursor-pointer table-action"
                onClick={onClickAction}
              >
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
  recordSelected: PropTypes.func,
  rowClass: PropTypes.string,
};

Table.defaultProps = {
  align: 'left',
  valign: 'left',
  headers: [],
  headerClass: '',
  rowClass: '',
  data: [],
  recordSelected: '',
};

export default Table;

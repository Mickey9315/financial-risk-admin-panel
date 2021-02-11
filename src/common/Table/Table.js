import React from 'react';
import './Table.scss';
import PropTypes from 'prop-types';

const Table = props => {
  const { align, valign, headers, data } = props;
  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const onClickAction = () => setShowActionMenu(true);
  return (
    <table>
      <thead>
        {headers.columns.length > 0 &&
          headers.columns.map(heading => (
            <th align={align} valign={valign}>
              {heading.name}
            </th>
          ))}
        {headers.actions.length > 0 && <th align={align} valign={valign} />}
      </thead>
      <tbody>
        {data.map(e => (
          <tr>
            {Object.values(e).map(fieldValue => (
              <td align={align}>{fieldValue}</td>
            ))}
            {headers.actions.length > 0 && (
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
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'center', 'bottom']),
  headers: PropTypes.shape({
    columns: PropTypes.array,
    actions: PropTypes.array,
  }),
  data: PropTypes.array,
};

Table.defaultProps = {
  align: 'left',
  valign: 'left',
  headers: {
    columns: [],
    actions: [],
  },
  data: [],
};

export default Table;

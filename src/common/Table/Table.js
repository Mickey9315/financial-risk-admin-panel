import React from 'react';
import './Table.scss';
import PropTypes from 'prop-types';

const Table = props => {
  const { align, valign, header, data } = props;
  return (
    <table>
      <thead>
        {header.columns.length > 0 &&
          header.columns.map(heading => (
            <th align={align} valign={valign}>
              {heading.name}
            </th>
          ))}
        {header.actions.length > 0 && <th align={align} valign={valign} />}
      </thead>
      <tbody>
        {data.map(e => (
          <tr>
            {Object.values(e).map(fieldValue => (
              <td align={align}>{fieldValue}</td>
            ))}
            {header.actions.length > 0 && (
              <td align="right" valign={valign}>
                <span className="material-icons-round cursor-pointer">more_vert</span>
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
  header: PropTypes.shape({
    columns: PropTypes.array,
    actions: PropTypes.array,
  }),
  data: PropTypes.array,
};

Table.defaultProps = {
  align: 'left',
  valign: 'left',
  header: {
    columns: [],
    actions: [],
  },
  data: [],
};

export default Table;

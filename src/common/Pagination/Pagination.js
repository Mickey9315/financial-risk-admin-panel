import React from 'react';
import './Pagination.scss';
import PropTypes from 'prop-types';
import Select from '../Select/Select';

const Pagination = props => {
  const { className, ...restProps } = props;
  const noPerPage = [5, 10, 15, 20, 25, 30];
  const selectedValue = 5;

  const paginationClass = `pagination-container ${className}`;
  return (
    <div className={paginationClass}>
      <div className="records-per-page-container">
        <span className="font-field mr-10">Show </span>
        <Select
          className="no-per-page-select"
          selectedValue={selectedValue}
          options={noPerPage}
          {...restProps}
        />
        <span className="ml-10"> Records 1 to {selectedValue} of 65</span>
      </div>
      <div className="pagination">
        <span className="mr-10">05 Pages</span>
        <div className="page-handler">
          <div className="first-page">
            <span className="material-icons-round">double_arrow</span>
          </div>
          <div className="prev-page">
            <span className="material-icons-round">arrow_back_ios</span>
          </div>
          <div className="page-number">1</div>
          <div className="next-page">
            <span className="material-icons-round">arrow_forward_ios</span>
          </div>
          <div className="last-page">
            <span className="material-icons-round">double_arrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  className: PropTypes.string,
};

Pagination.defaultProps = {
  className: '',
};

export default Pagination;

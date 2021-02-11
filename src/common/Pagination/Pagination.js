import React, { useMemo, useState } from 'react';
import './Pagination.scss';
import PropTypes from 'prop-types';
import Select from '../Select/Select';

const Pagination = props => {
  const {
    total,
    limit,
    pages,
    page,
    className,
    nextClick,
    prevClick,
    firstClick,
    lastClick,
    onSelectLimit,
  } = props;
  const noPerPage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
    { label: '30', value: 30 },
  ];

  const paginationClass = `pagination-container ${className}`;

  const [recordLimit, setRecordLimit] = useState(15);

  const fromRecordCount = useMemo(() => (page - 1) * (limit + 1) + 1, [page, limit, total]);
  const toRecordCount = useMemo(() => (total < page * limit ? total : page * limit), [
    page,
    limit,
    total,
  ]);

  const onNextClick = () => (page < pages ? nextClick(page + 1) : null);
  const onPrevClick = () => (page > 1 ? prevClick(page - 1) : null);
  const onFirstClick = () => firstClick(1);
  const onLastClick = () => lastClick(pages);
  const onChangeLimit = e => {
    setRecordLimit(e.target.value);
    onSelectLimit(e.target.value);
  };

  return (
    <div className={paginationClass}>
      <div className="records-per-page-container">
        <span className="font-field mr-10">Show</span>
        <Select
          className="no-per-page-select"
          options={noPerPage}
          onChange={onChangeLimit}
          value={recordLimit}
        />
        <span className="ml-10">
          {' '}
          Records {fromRecordCount} to {toRecordCount} of {total}
        </span>
      </div>
      <div className="pagination">
        <span className="mr-10">{pages} Pages</span>
        <div className="page-handler">
          <div
            className={`first-page ${page === 1 && 'pagination-button-disabled'}`}
            onClick={onFirstClick}
          >
            <span className="material-icons-round">double_arrow</span>
          </div>
          <div
            className={`prev-page ${page === 1 && 'pagination-button-disabled'}`}
            onClick={onPrevClick}
          >
            <span className="material-icons-round">arrow_back_ios</span>
          </div>
          <div className="page-number">{page}</div>
          <div
            className={`next-page ${page === pages && 'pagination-button-disabled'}`}
            onClick={onNextClick}
          >
            <span className="material-icons-round">arrow_forward_ios</span>
          </div>
          <div
            className={`last-page ${page === pages && 'pagination-button-disabled'}`}
            onClick={onLastClick}
          >
            <span className="material-icons-round">double_arrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  className: PropTypes.string,
  total: PropTypes.number,
  limit: PropTypes.number,
  pages: PropTypes.number,
  page: PropTypes.number,
  nextClick: PropTypes.func,
  prevClick: PropTypes.func,
  firstClick: PropTypes.func,
  lastClick: PropTypes.func,
  onSelectLimit: PropTypes.func,
};

Pagination.defaultProps = {
  className: '',
  total: 0,
  limit: 0,
  pages: 0,
  page: 0,
  nextClick: null,
  prevClick: null,
  firstClick: null,
  lastClick: null,
  onSelectLimit: null,
};

export default Pagination;

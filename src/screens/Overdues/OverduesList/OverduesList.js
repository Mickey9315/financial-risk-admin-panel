import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import { getEntityDetails, getOverdueList, resetOverdueListData } from '../redux/OverduesAction';
import { errorNotification } from '../../../common/Toast';
import Input from '../../../common/Input/Input';
import Loader from '../../../common/Loader/Loader';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/Filter';

const OverduesList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [newSubmissionDetails, setNewSubmissionDetails] = useState({});
  const [newSubmissionModal, setNewSubmissionModal] = useState(false);
  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });

  const entityList = useSelector(({ overdue }) => overdue?.entityList ?? {});

  const { overdueListPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const {
    page: paramPage,
    limit: paramLimit,
    debtorId: paramDebtorId,
    minOutstandingAmount: paramMinOutstandingAmount,
    maxOutstandingAmount: paramMaxOutstandingAmount,
    startDate: paramStartDate,
    endDate: paramEndDate,
  } = useQueryParams();

  const handleStartDateChange = useCallback(
    date => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'startDate',
        value: date.toISOString(),
      });
    },
    [dispatchFilter]
  );

  const handleEndDateChange = useCallback(
    date => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'endDate',
        value: date.toISOString(),
      });
    },
    [dispatchFilter]
  );

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);

  const handleDebtorIdFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'debtorId',
        value: event?.value,
      });
    },
    [dispatchFilter]
  );

  const handleMinOutstandingAmount = useCallback(
    event => {
      const updatedVal = event?.target?.value?.toString()?.replaceAll(',', '');
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'minOutstandingAmount',
        value: parseInt(updatedVal, 10),
      });
    },
    [dispatchFilter]
  );
  const handleMaxOutstandingAmount = useCallback(
    event => {
      const updatedVal = event?.target?.value?.toString()?.replaceAll(',', '');
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'maxOutstandingAmount',
        value: parseInt(updatedVal, 10),
      });
    },
    [dispatchFilter]
  );

  const debtorIdSelectedValue = useMemo(() => {
    const foundValue = entityList?.debtorId?.find(e => {
      return (e?.value ?? '') === tempFilter?.debtorId;
    });
    return foundValue ?? [];
  }, [tempFilter?.debtorId, entityList]);

  // listing
  const overdueListWithPageData = useSelector(({ overdue }) => overdue?.overdueList ?? {});
  const { total, pages, page, limit, docs, headers } = useMemo(() => overdueListWithPageData, [
    overdueListWithPageData,
  ]);

  const getOverdueListByFilter = useCallback(
    async (params = {}, cb) => {
      if (
        tempFilter?.startDate &&
        tempFilter?.endDate &&
        moment(tempFilter?.endDate).isBefore(tempFilter?.startDate)
      ) {
        errorNotification('Please enter a valid date range');
        resetFilterDates();
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          debtorId:
            (tempFilter?.debtorId?.trim()?.length ?? -1) > 0 ? tempFilter?.debtorId : undefined,
          minOutstandingAmount:
            (tempFilter?.minOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
              ? tempFilter?.minOutstandingAmount
              : undefined,
          maxOutstandingAmount:
            (tempFilter?.maxOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
              ? tempFilter?.maxOutstandingAmount
              : undefined,
          startDate: tempFilter?.startDate ?? undefined,
          endDate: tempFilter?.endDate ?? undefined,
          ...params,
        };
        try {
          await dispatch(getOverdueList(data));
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
          });
          if (cb && typeof cb === 'function') {
            cb();
          }
        } catch (e) {
          /**/
        }
      }
    },
    [page, limit, { ...tempFilter }]
  );

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const onClickApplyFilter = useCallback(async () => {
    toggleFilterModal();
    await getOverdueListByFilter({ page: 1, limit: 15 });
  }, [getOverdueListByFilter, toggleFilterModal, page, limit]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: onClickApplyFilter,
      },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      debtorId: (paramDebtorId?.trim()?.length ?? -1) > 0 ? paramDebtorId : undefined,
      minOutstandingAmount:
        (paramMinOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
          ? paramMinOutstandingAmount
          : undefined,
      maxOutstandingAmount:
        (paramMaxOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
          ? paramMaxOutstandingAmount
          : undefined,
      startDate: paramStartDate ? new Date(paramStartDate) : undefined,
      endDate: paramEndDate ? new Date(paramEndDate) : undefined,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getOverdueListByFilter({ ...params, ...filters });
    dispatch(getEntityDetails());
    return () => {
      dispatch(resetOverdueListData());
    };
  }, []);

  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      debtorId:
        (finalFilter?.debtorId?.trim()?.length ?? -1) > 0 ? finalFilter?.debtorId : undefined,
      minOutstandingAmount:
        (finalFilter?.minOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
          ? finalFilter?.minOutstandingAmount
          : undefined,
      maxOutstandingAmount:
        (finalFilter?.maxOutstandingAmount?.toString()?.trim()?.length ?? -1) > 0
          ? finalFilter?.maxOutstandingAmount
          : undefined,
      startDate: finalFilter?.startDate ?? undefined,
      endDate: finalFilter?.endDate ?? undefined,
    },
    [total, pages, page, limit, { ...finalFilter }]
  );

  const pageActionClick = useCallback(
    async newPage => {
      await getOverdueListByFilter({ page: newPage, limit });
    },
    [getOverdueListByFilter, limit]
  );
  const onSelectLimit = useCallback(
    async newLimit => {
      await getOverdueListByFilter({ page: 1, limit: newLimit });
    },
    [getOverdueListByFilter]
  );

  const onAddNewSubmission = useCallback(() => {
    if (
      // eslint-disable-next-line no-prototype-builtins
      !newSubmissionDetails.hasOwnProperty('clientId') ||
      // eslint-disable-next-line no-prototype-builtins
      !newSubmissionDetails.hasOwnProperty('submissionDate')
    ) {
      errorNotification('Please select client and month/year to add new submission');
    } else {
      history.push(
        `over-dues/${newSubmissionDetails?.clientId?.value}/${moment(
          newSubmissionDetails?.submissionDate
        )?.format('MMMM-YYYY')}`
      );
    }
  }, [newSubmissionDetails]);

  const onCloseNewSubmissionModal = useCallback(() => {
    setNewSubmissionDetails({});
    setNewSubmissionModal(e => !e);
  }, []);

  const newSubmissionButtons = useMemo(
    () => [
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: onCloseNewSubmissionModal,
      },
      {
        title: 'Add',
        buttonType: 'primary',
        onClick: onAddNewSubmission,
      },
    ],
    [onAddNewSubmission, onCloseNewSubmissionModal]
  );

  return (
    <>
      {!overdueListPageLoaderAction ? (
        <>
          <div className="page-header">
            <div className="page-header-name">List of Overdues</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on application list"
                onClick={() => toggleFilterModal()}
              />
              <Button
                buttonType="success"
                title="New Submission"
                onClick={() => setNewSubmissionModal(e => !e)}
              />
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  isExpandable
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                  refreshData={getOverdueListByFilter}
                  rowClass="cursor-pointer"
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}
          {newSubmissionModal && (
            <Modal
              header="New Submission"
              className="new-submission-modal"
              headerClassName="left-aligned-modal-header"
              buttons={newSubmissionButtons}
              hideModal={onCloseNewSubmissionModal}
            >
              <ReactSelect
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Client"
                name="role"
                options={entityList?.clientId}
                value={newSubmissionDetails?.clientId}
                onChange={e => setNewSubmissionDetails({ ...newSubmissionDetails, clientId: e })}
                isSearchble
              />
              <div className="date-picker-container month-year-picker">
                <DatePicker
                  placeholderText="Select month and year"
                  onChange={date =>
                    setNewSubmissionDetails({ ...newSubmissionDetails, submissionDate: date })
                  }
                  dateFormat="MM/yyyy"
                  selected={newSubmissionDetails?.submissionDate}
                  showMonthYearPicker
                  showYearDropdown
                  showFullMonthYearPicker
                />
                <span className="material-icons-round">expand_more</span>
              </div>
            </Modal>
          )}
          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="Filter"
              buttons={filterModalButtons}
              className="filter-modal overdue-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Debtor Name</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Debtor"
                  name="role"
                  options={entityList?.debtorId}
                  value={debtorIdSelectedValue}
                  onChange={handleDebtorIdFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Minimum Outstanding Amount</div>
                <Input
                  type="text"
                  name="min-limit"
                  value={
                    tempFilter?.minOutstandingAmount
                      ? NumberCommaSeparator(tempFilter?.minOutstandingAmount)
                      : undefined
                  }
                  placeholder="0"
                  onChange={handleMinOutstandingAmount}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Maximum Outstanding Amount</div>
                <Input
                  type="text"
                  name="max-limit"
                  value={
                    tempFilter?.maxOutstandingAmount
                      ? NumberCommaSeparator(tempFilter?.maxOutstandingAmount)
                      : undefined
                  }
                  placeholder="0"
                  onChange={handleMaxOutstandingAmount}
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Date</div>
                <div className="date-picker-container month-year-picker">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showYearDropdown
                    showFullMonthYearPicker
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
                <div className="date-picker-container month-year-picker">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter.endDate ? new Date(tempFilter?.endDate) : null}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showYearDropdown
                    showFullMonthYearPicker
                  />
                  <span className="material-icons-round">event_available</span>
                </div>
              </div>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default OverduesList;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import Button from '../../../common/Button/Button';
import Modal from '../../../common/Modal/Modal';
import {
  getDebtorOverdueEntityDetails,
  getDebtorOverdueList,
  resetDebtorOverdueListData,
} from '../redux/DebtorsAction';

const ClientOverdueTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [newSubmissionDetails, setNewSubmissionDetails] = useState({});
  const [newSubmissionModal, setNewSubmissionModal] = useState(false);

  const entityList = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.overdue?.entityList ?? {}
  );

  const { debtorOverdueListPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const overdueListWithPageData = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.overdue?.overdueList ?? {}
  );
  const { total, pages, page, limit, docs, headers } = useMemo(() => overdueListWithPageData, [
    overdueListWithPageData,
  ]);

  const getOverdueListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      try {
        await dispatch(getDebtorOverdueList(data, id));
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [page, limit, id]
  );

  useEffect(async () => {
    dispatch(getDebtorOverdueEntityDetails());
    return () => {
      dispatch(resetDebtorOverdueListData());
    };
  }, []);

  useEffect(async () => {
    await getOverdueListByFilter();
  }, [id]);

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
        `/over-dues/${newSubmissionDetails?.clientId?.value}/${moment(
          newSubmissionDetails?.submissionDate
        )?.format('MMMM-YYYY')}`,
        { isRedirected: true, redirectedFrom: 'debtor', fromId: id }
      );
    }
  }, [newSubmissionDetails, id]);

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

  // const checkIfEnterKeyPressed = e => {
  //   const searchKeyword = searchInputRef?.current?.value;
  //   if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
  //     getClientApplicationList();
  //   } else if (e.key === 'Enter') {
  //     if (searchKeyword?.trim()?.toString()?.length !== 0) {
  //       getClientApplicationList({ search: searchKeyword?.trim()?.toString() });
  //     } else {
  //       errorNotification('Please enter any value than press enter');
  //     }
  //   }
  // };
  return (
    <>
      {!debtorOverdueListPageLoaderAction ? (
        <>
          <div className="tab-content-header-row">
            <div className="tab-content-header">Overdue</div>
            <div className="buttons-row">
              <BigInput
                // ref={searchInputRef}
                type="text"
                className="search"
                borderClass="tab-search"
                prefix="search"
                prefixClass="font-placeholder"
                placeholder="Search here"
                // onKeyUp={checkIfEnterKeyPressed}
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
                  tableClass="main-list-table white-header-table"
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
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ClientOverdueTab;

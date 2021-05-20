import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import logo from '../../../assets/images/logo.svg';
import { deleteMyWorkNotification, getMyWorkNotificationList } from '../redux/MyWorkAction';
import Loader from '../../../common/Loader/Loader';
import Pagination from '../../../common/Pagination/Pagination';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import IconButton from '../../../common/IconButton/IconButton';
import Modal from '../../../common/Modal/Modal';

const MyWorkNotifications = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, notificationList, limit, page, pages, total } = useSelector(
    ({ myWorkReducer }) => myWorkReducer?.notification ?? {}
  );
  const notifications = useMemo(() => notificationList ?? {}, [notificationList]);

  const [filterDate, setFilterDate] = useState(new Date());
  const { month, year } = useMemo(() => {
    const data = {
      month: filterDate?.getMonth() + 1 ?? undefined,
      year: filterDate?.getFullYear() ?? undefined,
    };
    return data;
  }, [filterDate]);

  const handleSelectDateChange = useCallback(
    date => {
      setFilterDate(date);
    },
    [setFilterDate]
  );

  const getMyWorkNotificationListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        month: month ?? undefined,
        year: year ?? undefined,
        ...params,
      };
      try {
        await dispatch(getMyWorkNotificationList(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [total, pages, page, limit, month, year]
  );

  // filter
  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const closeFilterOnClick = useCallback(() => {
    toggleFilterModal();
  }, [toggleFilterModal]);

  const applyFilterOnClick = useCallback(() => {
    toggleFilterModal();
    getMyWorkNotificationListByFilter({ page: 1, limit });
  }, [getMyWorkNotificationListByFilter, limit, toggleFilterModal]);

  const resetFilterOnClick = useCallback(() => {
    setFilterDate(new Date());
    applyFilterOnClick();
  }, []);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: resetFilterOnClick,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: closeFilterOnClick },
      {
        title: 'Apply',
        buttonType: 'primary',
        onClick: applyFilterOnClick,
      },
    ],
    [resetFilterOnClick, toggleFilterModal, applyFilterOnClick, applyFilterOnClick]
  );

  const pageActionClick = useCallback(
    async newPage => {
      await getMyWorkNotificationListByFilter({ page: newPage, limit });
    },
    [getMyWorkNotificationListByFilter, limit]
  );

  const onSelectLimit = useCallback(
    async newLimit => {
      await getMyWorkNotificationListByFilter({ page: 1, limit: newLimit });
    },
    [getMyWorkNotificationListByFilter]
  );

  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      month: month ?? undefined,
      year: year ?? undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.push(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit, month, year]);

  const {
    page: paramPage,
    limit: paramLimit,
    month: paramMonth,
    year: paramYear,
  } = useQueryParams();

  useEffect(async () => {
    const params = {
      page: page ?? paramPage ?? 1,
      limit: limit ?? paramLimit ?? 15,
    };
    const filters = {
      month: paramMonth ?? undefined,
      year: paramYear ?? undefined,
    };
    await getMyWorkNotificationListByFilter({ ...params, ...filters });
  }, []);

  return (
    <>
      <div className="my-work-task-action-row">
        {!isLoading && notifications && (
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on task list"
            onClick={toggleFilterModal}
          />
        )}
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && notifications ? (
        notifications?.length > 0 ? (
          <>
            <div className="common-white-container notification-white-container">
              {notifications?.map(e => (
                <>
                  <div className="notification-date">{moment(e?.title).format('DD-MMM-YYYY')}</div>
                  <div className="notification-container">
                    {e?.data?.map(data => (
                      <div className="notification-row">
                        <div className="notification-circle-container">
                          <div className="notification-vertical-line" />
                          <div className="notification-circle">
                            <img src={logo} alt="logo" />
                          </div>
                        </div>

                        <div className="notification-detail-row">
                          <span className="font-field">{data?.description}</span>
                          <span className="notification-time">
                            {moment(data?.createdAt).format('hh:mm A')}
                          </span>
                          <span
                            className="material-icons-round"
                            onClick={() => dispatch(deleteMyWorkNotification(data?._id))}
                          >
                            delete_outline
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </div>
          </>
        ) : (
          <div className="no-record-found">No record found</div>
        )
      ) : (
        <Loader />
      )}
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="Filter"
          buttons={filterModalButtons}
          className="filter-modal application-filter-modal"
        >
          <div className="filter-modal-row">
            <div className="form-title">Select Date</div>
            <div className="date-picker-container filter-date-picker-container mr-15">
              <DatePicker
                selected={filterDate ?? new Date()}
                onChange={handleSelectDateChange}
                showMonthYearPicker
                placeholderText="From Date"
                dateFormat="MMM yyyy"
              />
              <span className="material-icons-round">event_available</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MyWorkNotifications;

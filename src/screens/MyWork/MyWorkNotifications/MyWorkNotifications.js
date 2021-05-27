import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import logo from '../../../assets/images/logo.svg';
import {
  clearNotificationData,
  deleteMyWorkNotification,
  getMyWorkNotificationList,
} from '../redux/MyWorkAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import IconButton from '../../../common/IconButton/IconButton';
import Modal from '../../../common/Modal/Modal';
import Loader from '../../../common/Loader/Loader';

const MyWorkNotifications = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(false);
  const { isLoading, notificationList, page, pages, total, hasMoreData } = useSelector(
    ({ myWorkReducer }) => myWorkReducer?.notification ?? {}
  );

  const sortedList = _.orderBy(notificationList, ['title'], ['desc']);

  const [filterDate, setFilterDate] = useState(undefined);

  const { month, year } = useMemo(() => {
    const data = {
      month: filterDate?.getMonth() + 1 || undefined,
      year: filterDate?.getFullYear() || undefined,
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
        page: page || 1,
        month: month || undefined,
        year: year || undefined,
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
    [total, pages, page, month, year]
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

  const applyFilterOnClick = useCallback(async () => {
    toggleFilterModal();
    await dispatch(clearNotificationData());
    await getMyWorkNotificationListByFilter({ page: 1 });
  }, [getMyWorkNotificationListByFilter, toggleFilterModal]);

  const resetFilterOnClick = useCallback(() => {
    setFilterDate(undefined);
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

  useEffect(() => {
    const params = {
      month: month || undefined,
      year: year || undefined,
    };
    const url = Object.entries(params)
      .filter(arr => arr[1] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    history.push(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, month, year]);

  const { month: paramMonth, year: paramYear } = useQueryParams();

  useEffect(async () => {
    const filters = {
      month: paramMonth ?? undefined,
      year: paramYear ?? undefined,
    };
    await getMyWorkNotificationListByFilter({ ...filters });
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearNotificationData());
    };
  }, []);

  const handleScroll = e => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
      if (sortedList?.length > 0) {
        setIsFetching(true);
      }
  };

  const fetchMoreListItems = () => {
    try {
      setTimeout(async () => {
        const changedPage = page + 1;
        await getMyWorkNotificationListByFilter({ page: changedPage });
        setIsFetching(false);
      }, [500]);
    } catch (e) {
      /**/
    }
  };

  useEffect(() => {
    if (!isFetching) return;
    if (hasMoreData) fetchMoreListItems();
  }, [isFetching, hasMoreData]);

  return (
    <>
      <div className="my-work-task-action-row">
        {!isLoading && sortedList && (
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on task list"
            onClick={toggleFilterModal}
          />
        )}
      </div>
      {sortedList?.length > 0 ? (
        <>
          <div
            className="common-white-container notification-white-container"
            onScroll={handleScroll}
          >
            {sortedList?.map(e => (
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
            {hasMoreData && <Loader />}
          </div>
        </>
      ) : (
        <div className="no-record-found">No record found</div>
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
                selected={filterDate}
                onChange={handleSelectDateChange}
                showMonthYearPicker
                placeholderText="Select Month"
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

import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DATE_FORMAT, DATE_FORMAT_CONSTANT_FOR_CALENDER } from '../../../constants/DateFormatConstants';
import { ALERT_TYPE_ROW, checkAlertValue } from '../../../helpers/AlertHelper';
import { handleGlobalSearchSelect } from '../../../helpers/GlobalSearchHelper';
import Drawer from '../../Drawer/Drawer';
import IconButton from '../../IconButton/IconButton';
import Loader from '../../Loader/Loader';
import Modal from '../../Modal/Modal';
import { errorNotification } from '../../Toast';
import {
  clearNotificationAlertDetails,
  getHeaderNotificationListURL,
  getNotificationAlertsDetail,
  markAllNotificationAsRead,
  markNotificationAsReadAndDeleteAction,
} from '../redux/HeaderAction';

const HeaderNotification = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { notificationData, alertDetail } = useSelector(
    ({ headerNotificationReducer }) => headerNotificationReducer ?? {},
  );

  const { notificationList, page, pages, total } = notificationData ?? {};
  const { notificationAlertDetailsLoader, markAllAsReadLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false,
  );

  const sortedNotificationList = useMemo(() => {
    let list = [];
    if (notificationList?.length > 0) {
      list = Object.values(
        notificationList?.reduce((acc, cur) => {
          if (!acc[moment(cur.createdAt).format('DD/MM/YYYY')])
            acc[moment(cur.createdAt).format('DD/MM/YYYY')] = {
              createdAt: moment(cur.createdAt).format('DD/MM/YYYY'),
              notifications: [],
            };
          acc[moment(cur.createdAt).format('DD/MM/YYYY')].notifications.push(cur);
          return acc;
        }, {}),
      );
      list?.sort((a, b) => moment(b.createdAt, 'DD/MM/YYYY').toDate() - moment(a.createdAt, 'DD/MM/YYYY').toDate());
    }
    return list ?? [];
  }, [notificationList]);

  const openNotificationDrawer = useCallback(value => setNotificationDrawer(value !== undefined ? value : e => !e), []);

  const onClickNotification = useCallback(notification => {
    if (notification?.entityType === 'alert') {
      setNotificationDrawer(false);
      dispatch(getNotificationAlertsDetail(notification?.entityId?._id));
      setIsAlertModal(true);
    } else {
      const { entityType, entityId, hasSubModule, subModule, description } = notification;
      handleGlobalSearchSelect(history, entityType, entityId, hasSubModule, subModule, description);
      setNotificationDrawer(false);
    }
  }, []);

  const onCloseAlertModal = useCallback(() => {
    setIsAlertModal(false);
    dispatch(clearNotificationAlertDetails());
  }, []);

  const alertModalButtons = useMemo(
    () => [{ title: 'Close', buttonType: 'primary-1', onClick: onCloseAlertModal }],
    [],
  );

  const NotificationDrawerHeader = () => {
    return (
      <div className="notification-drawer-title">
        <span className="material-icons-round">notifications_active</span> Notifications
      </div>
    );
  };

  const markAllAsRead = useCallback(() => {
    if (sortedNotificationList?.length > 0 && !markAllAsReadLoader) {
      dispatch(markAllNotificationAsRead());
    } else {
      errorNotification('Nothing To Mark.');
    }
  }, [sortedNotificationList, markAllAsReadLoader]);

  const fetchMoreListItems = () => {
    try {
      setTimeout(async () => {
        const changedPage = page + 1;
        await dispatch(getHeaderNotificationListURL({ page: changedPage }));
        setIsFetching(false);
      }, [500]);
    } catch (e) {
      /**/
    }
  };

  const handleScroll = e => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
      if (sortedNotificationList?.length > 0) {
        setIsFetching(true);
      }
  };

  useEffect(() => {
    if (!isFetching) return;
    if (pages > page) fetchMoreListItems();
  }, [isFetching, pages, page]);

  return (
    <>
      <IconButton
        isBadge={total > 0}
        title="notifications_active"
        buttonType="outlined-bg"
        className="notification"
        onClick={openNotificationDrawer}
        badgeCount={total}
      />
      <Drawer
        header={<NotificationDrawerHeader />}
        drawerState={notificationDrawer}
        closeDrawer={() => setNotificationDrawer(false)}
        onDrawerScroll={handleScroll}
      >
        <>
          {sortedNotificationList?.length > 0 && (
            <div className="notification-clear-all-wrapper">
              <span className="notification-clear-all-btn f-14" onClick={markAllAsRead}>
                Mark All As Read
              </span>
            </div>
          )}
          {sortedNotificationList?.length > 0
            ? sortedNotificationList?.map(notification => (
                <div className="notification-set">
                  <div className="notification-set-title">
                    {moment(notification?.createdAt, DATE_FORMAT).calendar(null, DATE_FORMAT_CONSTANT_FOR_CALENDER)}
                  </div>
                  {notification?.notifications?.map(singleNotification => (
                    <div
                      className={`notification-item-wrapper ${
                        singleNotification?.entityType === 'alert'
                          ? `${ALERT_TYPE_ROW[singleNotification?.entityId?.priority]} cursor-pointer`
                          : 'secondary-tag'
                      }`}
                      key={singleNotification?._id}
                      onClick={() => onClickNotification(singleNotification)}
                    >
                      <div className="notification-date-row">
                        <div className="notification-date-row-left">
                          <span className="font-field mr-5">Date:</span>
                          <span className="font-primary">
                            {moment(singleNotification?.createdAt).format('DD-MMM-YYYY')}
                          </span>
                          {singleNotification?.entityType === 'alert' && (
                            <span className="ml-10 d-flex align-center">
                              <span className="material-icons-round">warning</span>
                              {singleNotification?.entityId?.priority}
                            </span>
                          )}
                        </div>
                        <span
                          className="material-icons-round font-placeholder cursor-pointer"
                          onClick={() =>
                            dispatch(e => markNotificationAsReadAndDeleteAction(e, singleNotification?._id))
                          }
                        >
                          cancel
                        </span>
                      </div>
                      <div className="font-field">Description:</div>
                      <div className="font-primary">{singleNotification?.description}</div>
                    </div>
                  ))}
                </div>
              ))
            : !notificationList?.length && <div className="no-record-found">No new notification</div>}
          {pages > page && <Loader />}
        </>
      </Drawer>
      {isAlertModal && (
        <Modal header="Alerts" buttons={alertModalButtons} className="alert-details-modal">
          {!notificationAlertDetailsLoader ? (
            (() =>
              !_.isEmpty(alertDetail) ? (
                <>
                  <div className={`alert-type ${ALERT_TYPE_ROW[alertDetail?.priority]}`}>
                    <span className="material-icons-round f-h2">warning</span>
                    <div className="alert-type-right-texts">
                      <div className="f-16 f-bold">{alertDetail?.priority}</div>
                      <div className="font-primary f-14">{alertDetail?.name}</div>
                    </div>
                  </div>
                  {alertDetail?.generalDetails?.length > 0 && (
                    <div className="alert-details-wrapper f-14">
                      <span className="font-primary f-16 f-bold">General Details</span>
                      <div className="alert-general-details">
                        {alertDetail?.generalDetails?.map(detail => (
                          <>
                            <span>{detail?.label}</span>
                            <div className="alert-detail-value-field">{checkAlertValue(detail)}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                  {alertDetail?.alertDetails?.length > 0 && (
                    <div className="alert-details-wrapper">
                      <span className="font-primary f-16 f-bold">Alert Details</span>
                      <div className="alert-detail">
                        {alertDetail?.alertDetails?.map(detail => (
                          <>
                            <span>{detail?.label}</span>
                            <div className="alert-detail-value-field">{checkAlertValue(detail)}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-record-found">No record found</div>
              ))()
          ) : (
            <Loader />
          )}
        </Modal>
      )}
    </>
  );
};
export default HeaderNotification;

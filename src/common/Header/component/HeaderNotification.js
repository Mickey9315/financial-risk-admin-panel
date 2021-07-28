import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DATE_FORMAT,
  DATE_FORMAT_CONSTANT_FOR_CALENDER,
} from '../../../constants/DateFormatConstants';
import { markNotificationAsReadAndDeleteAction } from '../redux/HeaderAction';
import Drawer from '../../Drawer/Drawer';
import IconButton from '../../IconButton/IconButton';

const HeaderNotification = () => {
  const dispatch = useDispatch();
  const [notificationDrawer, setNotificationDrawer] = useState(false);

  const { notificationList } = useSelector(
    ({ headerNotificationReducer }) => headerNotificationReducer ?? []
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
        }, {})
      );
      list?.sort(function (a, b) {
        return (
          moment(b.createdAt, 'DD/MM/YYYY').toDate() - moment(a.createdAt, 'DD/MM/YYYY').toDate()
        );
      });
    }
    return list ?? [];
  }, [notificationList]);

  const openNotificationDrawer = useCallback(
    value => setNotificationDrawer(value !== undefined ? value : e => !e),
    []
  );

  const notificationBadge = useMemo(() => {
    const result = notificationList?.filter(notification => notification?.isRead !== true);
    return result?.length ?? 0;
  }, [notificationList]);

  const NotificationDrawerHeader = () => {
    return (
      <div className="notification-drawer-title">
        <span className="material-icons-round">notifications_active</span> Notifications
      </div>
    );
  };
  return (
    <>
      <IconButton
        isBadge={notificationBadge > 0}
        title="notifications_active"
        buttonType="outlined-bg"
        className="notification"
        onClick={openNotificationDrawer}
        badgeCount={notificationBadge}
      />
      <Drawer
        header={<NotificationDrawerHeader />}
        drawerState={notificationDrawer}
        closeDrawer={() => setNotificationDrawer(false)}
      >
        {sortedNotificationList?.length > 0 ? (
          sortedNotificationList?.map(notification => (
            <div className="notification-set">
              <div className="notification-set-title">
                {moment(notification?.createdAt, DATE_FORMAT).calendar(
                  null,
                  DATE_FORMAT_CONSTANT_FOR_CALENDER
                )}
              </div>
              {notification?.notifications?.map(singleNotification => (
                <div
                  className="common-accordion-item-content-box high-alert"
                  key={singleNotification?._id}
                >
                  <div className="date-owner-row just-bet">
                    <span className="title mr-5">Date:</span>
                    <span className="details">
                      {moment(singleNotification?.createdAt).format('DD-MMM-YYYY')}
                    </span>
                    <span />
                    <span
                      className="material-icons-round font-placeholder"
                      style={{ textAlign: 'end', fontSize: '18px', cursor: 'pointer' }}
                      onClick={() =>
                        dispatch(markNotificationAsReadAndDeleteAction(singleNotification?._id))
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
        ) : (
          <div className="no-record-found">No record found</div>
        )}
      </Drawer>
    </>
  );
};
export default HeaderNotification;

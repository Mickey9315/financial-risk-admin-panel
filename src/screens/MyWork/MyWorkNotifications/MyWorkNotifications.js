import React from 'react';
import './MyWorkNotifications.scss';
import logo from '../../../assets/images/logo.svg';

const MyWorkNotifications = () => {
  const notifications = [
    {
      date: '31-Dec-2021',
      data: [
        {
          notification:
            'A new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty LtdA new application created by A B Plastics Pty Ltd',
          time: '03:26 PM',
        },
        {
          notification: 'New client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification:
            'New client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification: 'A new application created by A B Plastics Pty Ltd',
          time: '03:26 PM',
        },
        {
          notification:
            'A new application created by A B Plastics Pty LtdNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '3:26 PM',
        },
      ],
    },
    {
      date: '30-Dec-2021',
      data: [
        {
          notification: 'D S Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification:
            'Application created by A C Plastics Pty LtdNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification:
            'D S Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification: 'D S Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification:
            'Application created by A C Plastics Pty LtdNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
        {
          notification:
            'D S Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia MotteramNew client A B Plastics Pty Ltd assigned to you by Mia Motteram',
          time: '03:26 PM',
        },
      ],
    },
  ];
  return (
    <>
      {notifications.map(record => (
        <>
          <div className="notification-date">{record.date}</div>
          <div className="notification-container">
            {record.data.map(notification => (
              <div className="notification-row">
                <div className="notification-circle-container">
                  <div className="notification-vertical-line" />
                  <div className="notification-circle">
                    <img src={logo} alt="logo" />
                  </div>
                </div>

                <div className="notification-detail-row">
                  <span className="font-field">{notification.notification}</span>
                  <span className="notification-time">{notification.time}</span>
                  <span className="material-icons-round">delete</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ))}
    </>
  );
};

export default MyWorkNotifications;

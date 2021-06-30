import ReactSelect from 'react-select';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  getDashboardDetails,
  getDashboardUserList,
  resetDashboardDetails,
} from './redux/DashboardAction';
import Loader from '../../common/Loader/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardUserList = useSelector(({ dashboard }) => dashboard?.dashboardUserList ?? []);
  const dashboardDetails = useSelector(({ dashboard }) => dashboard?.dashboardDetails ?? {});
  const { applications, tasks } = useMemo(() => dashboardDetails ?? {}, [dashboardDetails]);

  const { dashboardDetailsLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const userListData = useMemo(() => {
    const userList = dashboardUserList || [];
    return userList.map(user => ({
      label: user.name,
      value: user._id,
    }));
  }, [dashboardUserList]);

  const getDetailsOnSelectedUsersChange = useCallback(value => {
    const users = value.map(user => user.value).join(',');
    dispatch(getDashboardDetails(users));
  }, []);

  useEffect(() => {
    dispatch(getDashboardUserList());
    dispatch(getDashboardDetails());
    return () => dispatch(resetDashboardDetails());
  }, []);


  return (
    <>
      <ReactSelect
        isMulti
        className="react-select-container dashboard-select-container"
        options={userListData}
        classNamePrefix="react-select"
        onChange={getDetailsOnSelectedUsersChange}
        placeholder="Select person"
      />
      {!dashboardDetailsLoader ? (
        (() =>
          !_.isEmpty(dashboardDetails) ? (
            <>
              {' '}
              <div className="dashboard-grid">
                <div className="dashboard-white-container">
                  <div className="dashboard-white-container-icon">
                    <span className="material-icons-round">assignment</span>{' '}
                  </div>
                  <div className="title">Pending Application</div>
                  <div className="readings">{applications}</div>
                  <div className="dashboard-white-container-stripe" />
                </div>
                <div className="dashboard-white-container">
                  <div className="dashboard-white-container-icon">
                    <span className="material-icons-round">task</span>{' '}
                  </div>
                  <div className="title">Pending Tasks</div>
                  <div className="readings">{tasks}</div>
                  <div className="dashboard-white-container-stripe" />
                </div>
              </div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Dashboard;

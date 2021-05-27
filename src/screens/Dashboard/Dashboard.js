import ReactSelect from 'react-select';

const Dashboard = () => {
  return (
    <>
      <ReactSelect
        isMulti
        className="react-select-container dashboard-select-container"
        classNamePrefix="react-select"
        placeholder="Select person"
      />
      <div className="dashboard-grid">
        <div className="dashboard-white-container">
          <div className="dashboard-white-container-icon">
            <span className="material-icons-round">assignment</span>{' '}
          </div>
          <div className="title">Pending Application</div>
          <div className="readings">51</div>
          <div className="dashboard-white-container-stripe" />
        </div>
        <div className="dashboard-white-container">
          <div className="dashboard-white-container-icon">
            <span className="material-icons-round">task</span>{' '}
          </div>
          <div className="title">Pending Tasks</div>
          <div className="readings">22</div>
          <div className="dashboard-white-container-stripe" />
        </div>
      </div>
    </>
  );
};
export default Dashboard;

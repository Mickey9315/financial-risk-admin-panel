import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reportType } from '../../../helpers/reportTypeHelper';
import { useOnClickOutside } from '../../../hooks/UserClickOutsideHook';
import { getAllClientList } from '../../Users/redux/UserManagementAction';
import Input from '../../../common/Input/Input';

const ViewReport = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { type } = useParams();
  const customDropdownRef = useRef();
  const [isOpenCustomSelect, setIsOpenCustomSelect] = useState(false);

  const allClientList = useSelector(
    ({ userManagementClientList }) => userManagementClientList ?? {}
  );
  const reportName = useMemo(() => {
    const selectedReport = reportType.filter(report => report.url === type);
    return selectedReport ? selectedReport?.[0].name : '';
  }, [type]);
  const backToReports = useCallback(() => history.replace('/reports'), [history]);
  useOnClickOutside(customDropdownRef, () => setIsOpenCustomSelect(false));
  const [selectedClientList, setSelectedClientList] = useState([]);
  const [notSelectedClientList, setNotSelectedClientList] = useState(
    allClientList?.riskAnalystList
  );
  const onClientSelection = useCallback(
    clickedClient => {
      setSelectedClientList([...selectedClientList, clickedClient]);
      setNotSelectedClientList(
        notSelectedClientList.filter(client => client?._id !== clickedClient?._id)
      );
    },
    [selectedClientList, notSelectedClientList]
  );

  const onClientUnselect = useCallback(
    clickedClient => {
      console.log('fired');
      setSelectedClientList(
        selectedClientList.filter(client => client?._id !== clickedClient?._id)
      );
      setNotSelectedClientList([...notSelectedClientList, clickedClient]);
    },
    [selectedClientList, notSelectedClientList]
  );

  useEffect(() => {
    setNotSelectedClientList(allClientList?.riskAnalystList);
  }, [allClientList?.riskAnalystList]);

  useEffect(() => {
    dispatch(getAllClientList());
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToReports}>Reports</span>
          <span className="material-icons-round">navigate_next</span>
          <span>{reportName}</span>
        </div>
        <div className="custom-select">
          <div className="custom-select__control" onClick={() => setIsOpenCustomSelect(e => !e)}>
            <Input
              type="search"
              value={selectedClientList?.[0]?.name}
              placeholder="Select client"
            />
            {selectedClientList.length > 1 && (
              <div className="more-text">+{selectedClientList.length - 1} more</div>
            )}
            <span className={`material-icons-round ${isOpenCustomSelect && 'font-field'}`}>
              expand_more
            </span>
          </div>
          <div
            ref={customDropdownRef}
            className={`custom-select-dropdown ${
              isOpenCustomSelect && 'active-custom-select-dropdown'
            }`}
          >
            <div>
              <ul className="selected-client-list">
                {selectedClientList?.map(selectedClient => (
                  <li onClick={() => onClientUnselect(selectedClient)}>
                    <>{selectedClient?.name}</>
                    <span className="material-icons-round">task_alt</span>
                  </li>
                ))}
              </ul>
              <ul>
                {notSelectedClientList?.map(unselectedClient => (
                  <li onClick={() => onClientSelection(unselectedClient)}>
                    {unselectedClient?.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReport;

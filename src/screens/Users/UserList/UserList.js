import { useEffect, useMemo } from 'react';
import './UserList.scss';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../../../common/Dashboard/Dashboard';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import { getUserManagementList } from '../redux/UserManagementAction';

const UserList = () => {
  const dispatch = useDispatch();
  const userListWithPageData = useSelector(({ userManagementList }) => userManagementList);
  const userData = useMemo(() => userListWithPageData?.docs || [], [userListWithPageData]);

  useEffect(() => {
    dispatch(getUserManagementList());
  }, []);

  const columnStructure = {
    columns: [
      {
        type: 'text',
        name: 'Name',
        value: 'name',
      },
      {
        type: 'text',
        name: 'Email',
        value: 'email',
      },
      {
        type: 'text',
        name: 'Phone',
        value: 'phone',
      },
      {
        type: 'text',
        name: 'Role',
        value: 'role',
      },
      {
        type: 'text',
        name: 'Date',
        value: 'date',
      },
    ],
    actions: [
      {
        type: 'edit',
        name: 'Edit',
        icon: 'edit-outline',
      },
      {
        type: 'delete',
        name: 'Delete',
        icon: 'trash-outline',
      },
    ],
  };
  return (
    <>
      <Dashboard>
        <div className="page-header">
          <div className="page-header-name">User List</div>
          <div className="page-header-button-container">
            <IconButton buttonType="secondary" title="filter_list" className="mr-10" />
            <IconButton buttonType="primary" title="format_line_spacing" className="mr-10" />
            <Button title="Add User" buttonType="success" />
          </div>
        </div>
        <div className="user-list-container">
          <Table align="left" valign="center" data={userData} header={columnStructure} />
        </div>
        <Pagination className="user-list-pagination" />
      </Dashboard>
    </>
  );
};

export default UserList;

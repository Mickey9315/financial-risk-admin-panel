import React from 'react';
import './UserList.scss';
import Dashboard from '../../../common/Dashboard/Dashboard';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';

const UserList = () => {
  const userList = [
    {
      name: 'Mcleod Austin',
      email: 'mcleodaustin@grupoli.com',
      phone: '+1 (851) 418-3775',
      role: 'Risk Analyst',
      date: '08-Aug-2014',
    },
    {
      name: 'Price Rice',
      email: 'pricerice@grupoli.com',
      phone: '+1 (895) 422-3794',
      role: 'Service Manager',
      date: '04-Nov-2017',
    },
    {
      name: 'Kerr Dunlap',
      email: 'kerrdunlap@grupoli.com',
      phone: '+1 (903) 564-2411',
      role: 'Admin',
      date: '16-Jun-2020',
    },
    {
      name: 'Christensen Gould',
      email: 'christensengould@grupoli.com',
      phone: '+1 (953) 507-3287',
      role: 'Service Manager',
      date: '28-Jun-2014',
    },
    {
      name: 'Knox Higgins',
      email: 'knoxhiggins@grupoli.com',
      phone: '+1 (938) 487-2020',
      role: 'Service Manager',
      date: '15-Jul-2018',
    },
    {
      name: 'Gilmore Hamilton',
      email: 'gilmorehamilton@grupoli.com',
      phone: '+1 (825) 442-3749',
      role: 'Admin',
      date: '31-Aug-2020',
    },
    {
      name: 'Blanche Bean',
      email: 'blanchebean@grupoli.com',
      phone: '+1 (970) 526-3446',
      role: 'Risk Analyst',
      date: '01-Aug-2017',
    },
    {
      name: 'Kane Acevedo',
      email: 'kaneacevedo@grupoli.com',
      phone: '+1 (910) 411-2506',
      role: 'Risk Analyst',
      date: '13-Mar-2016',
    },
    {
      name: 'Leonard Graham',
      email: 'leonardgraham@grupoli.com',
      phone: '+1 (955) 537-3657',
      role: 'Risk Analyst',
      date: '03-Apr-2019',
    },
    {
      name: 'Sargent Simmons',
      email: 'sargentsimmons@grupoli.com',
      phone: '+1 (815) 594-2653',
      role: 'Admin',
      date: '08-Dec-2017',
    },
    {
      name: 'Wiley Mcgowan',
      email: 'wileymcgowan@grupoli.com',
      phone: '+1 (989) 522-3290',
      role: 'Manager',
      date: '14-Nov-2014',
    },
    {
      name: 'Rhonda Webb',
      email: 'rhondawebb@grupoli.com',
      phone: '+1 (865) 519-2224',
      role: 'Risk Analyst',
      date: '28-Dec-2014',
    },
    {
      name: 'Montgomery Hess',
      email: 'montgomeryhess@grupoli.com',
      phone: '+1 (826) 530-3967',
      role: 'Service Manager',
      date: '18-Feb-2014',
    },
    {
      name: 'Maude Mooney',
      email: 'maudemooney@grupoli.com',
      phone: '+1 (861) 521-2137',
      role: 'Risk Analyst',
      date: '25-Aug-2015',
    },
    {
      name: 'Shields Carson',
      email: 'shieldscarson@grupoli.com',
      phone: '+1 (813) 567-3414',
      role: 'Manager',
      date: '01-May-2014',
    },
    {
      name: 'Freida Burgess',
      email: 'freidaburgess@grupoli.com',
      phone: '+1 (811) 592-3831',
      role: 'Manager',
      date: '28-Aug-2018',
    },
    {
      name: 'Mueller Fleming',
      email: 'muellerfleming@grupoli.com',
      phone: '+1 (819) 486-3184',
      role: 'Manager',
      date: '09-Feb-2016',
    },
  ];
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
          <Table align="left" valign="center" data={userList} header={columnStructure} />
        </div>
        <Pagination className="user-list-pagination" />
      </Dashboard>
    </>
  );
};

export default UserList;

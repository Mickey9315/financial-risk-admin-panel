import React from 'react';
import './Dashboard.scss'
import SideMenu from "../SideMenu/SideMenu";
import Header from "../Header/Header";

const Dashboard = () => {
    return(
        <div className="dashboard-container">
            <SideMenu></SideMenu>
            <div className="right-side-container">
                <Header/>
            </div>
        </div>
    )
}

export default Dashboard;

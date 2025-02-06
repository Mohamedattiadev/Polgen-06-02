import React from 'react';
import { useOutletContext } from 'react-router-dom';
import UserStaticTables from '../../../../components/OrderComponent/UserComponent/UserStaticTables/UserStaticTables'; // Import the combined tables
import styles from './UserDashboard.module.css'; // Import CSS module for styling
import UserTables from '../../../../components/OrderComponent/UserComponent/UserTables/UserTables';

const UserDashboard = () => {
  const { userProfile } = useOutletContext(); // Access userProfile from the layout context

  return (
    <div className={styles['dashboard-container']}>
      <h1 className={styles['dashboard-title']}>Welcome, {userProfile.username}</h1>
      <UserStaticTables userRole={userProfile.role} userId={userProfile.id} />
                  <UserTables userRole={userProfile.role} userId={userProfile.id}/>
    </div>
  );
};

export default UserDashboard;



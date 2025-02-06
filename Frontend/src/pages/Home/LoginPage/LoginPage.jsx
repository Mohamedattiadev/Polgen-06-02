import React from 'react';
import Login from "../../../components/HomeComponent/Login/Login.jsx";
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Login />
    </div>
  );
};

export default LoginPage;


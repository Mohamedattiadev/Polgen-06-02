import React from 'react';
import styles from './Error404.module.css'; // Importing the CSS module
import {Link} from "react-router-dom"
const Error404 = () => {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>Error 404</h2>
      <p className={styles.errorMessage}>
        The page you are looking for does not exist. Return to{' '}
        <Link to="/" className={styles.errorLink}>Home</Link>.
      </p>
    </div>
  );
};

export default Error404;


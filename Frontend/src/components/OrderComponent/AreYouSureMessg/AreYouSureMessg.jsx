import React from "react";
import styles from "./AreYouSureMessg.module.css";

const AreYouSureMsg = ({ onConfirm, onCancel, message }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{message}</h3>
        <div className={styles.buttons}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSureMsg;

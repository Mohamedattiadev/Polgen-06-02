import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AdminShowGroupInfo.module.css";
import { getGroupById } from "../../../../api/product";
import AdminDuringProcessTables from "../AdminDuringProcessTables/AdminDuringProcessTables";

const AdminShowGroupInfo = ({ groupId, onClose }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group data
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        setGroup(response); // Set the group data
      } catch (err) {
        setError("Failed to load group data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  // Close the popup when clicking outside
  const handleOverlayClick = (event) => {
    if (
      typeof event.target.className === "string" &&
      event.target.className.includes(styles.popupOverlay)
    ) {
      onClose();
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={handleOverlayClick}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <h2>Group Information (ID: {groupId})</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className={styles.popupContent}>
            <h3>Products in this group:</h3>
            <AdminDuringProcessTables groupId={groupId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShowGroupInfo;

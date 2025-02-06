import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getUserById } from "../../../../api/auth";
import UserTablesShowInfo from "../../UserComponent/UserTablesShowInfo/UserTablesShowInfo";
import styles from "./ShowUserInfo.module.css";

const ShowUserInfo = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId);
        if (response && response.user) {
          setUser(response.user);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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
          <h2>User Information</h2>
          <button className={styles.closeButton} onClick={onClose}>
            {/* &times; */}
            <CloseIcon />
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <div className={styles.popupContent}>
              <p>
                <strong>Name:</strong> {user.username || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "N/A"}
              </p>
            </div>
            <div className={styles.userOrders}>
              <h3>User Orders</h3>
              <UserTablesShowInfo userRole="user" userId={user.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowUserInfo;

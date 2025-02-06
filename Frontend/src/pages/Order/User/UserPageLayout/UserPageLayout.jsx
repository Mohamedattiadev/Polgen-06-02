import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { getUserProfile } from "../../../../api/auth";
import Navbar from "../../../../components/OrderComponent/Navbar/DashboardNavbar";
import Sidebar from "../../../../components/OrderComponent/Sidebar/Sidebar";
import AreYouSureMsg from "../../../../components/OrderComponent/AreYouSureMessg/AreYouSureMessg";
import styles from "./UserPageLayout.module.css";
import { CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const UserPageLayout = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const sessionId = sessionStorage.getItem("sessionId");

  useEffect(() => {
    if (!username) {
      console.error("Username is missing in URL parameters.");
      navigate("/Error404");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(username, navigate);
        // console.log("Fetched profile:", profile);

        if (profile.username.toLowerCase() !== username.toLowerCase()) {
          console.warn(
            "Username mismatch between URL and fetched profile:",
            username,
            profile.username
          );
          navigate("/login");
          return;
        }

        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user profile.");
        if (err.response?.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        } else {
          navigate("/Error404");
        }
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  useEffect(() => {
    const channel = new BroadcastChannel(`user-session-${sessionId}`);
    channel.onmessage = (message) => {
      if (
        message.data.type === "logout" &&
        message.data.sessionId === sessionId
      ) {
        sessionStorage.removeItem(`auth_${sessionId}`);
        sessionStorage.removeItem("sessionId");
        navigate("/login");
      }
    };

    return () => {
      channel.close();
    };
  }, [sessionId, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    const channel = new BroadcastChannel(`user-session-${sessionId}`);
    channel.postMessage({ type: "logout", sessionId });
    sessionStorage.removeItem(`auth_${sessionId}`);
    sessionStorage.removeItem("sessionId");
    navigate("/login");
  };

  const cancelSignOut = () => {
    setShowSignOutModal(false);
  };

  if (error) {
    return (
      <div className={styles.centered}>
        <ErrorOutlineIcon className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={styles.centered}>
        <CircularProgress className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar
        userType="user"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSignOut={handleSignOut}
      />
      <main className={styles.mainContent}>
        <Outlet context={{ userProfile, setUserProfile }} />
      </main>
      {showSignOutModal && (
        <AreYouSureMsg
          onConfirm={confirmSignOut}
          onCancel={cancelSignOut}
          message="are you sure u want to sign out?"
        />
      )}
    </div>
  );
};

export default UserPageLayout;

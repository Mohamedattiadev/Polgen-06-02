import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Added useLocation
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import GradingIcon from "@mui/icons-material/Grading";
import ScienceIcon from "@mui/icons-material/Science";
import SummarizeIcon from "@mui/icons-material/Summarize";
import styles from "./Sidebar.module.css";
import AdminFinishedOrders from "../../../pages/Order/Admin/AdminFinishedOrders/AdminFinishedOrders";

const Sidebar = ({ userType, isSidebarOpen, toggleSidebar, onSignOut }) => {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation(); // Get the current route

  // Define nav items for user and admin separately
  const USER_NAV_ITEMS = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: `/user/${username}/dashboard`,
    },
    {
      title: "Order",
      icon: <ShoppingCartIcon />,
      path: `/user/${username}/order`,
    },
    {
      title: "Add Product",
      icon: <AddIcon />,
      path: `/user/${username}/add-product`,
    },

    {
      title: "Profile",
      icon: <AccountCircleIcon />,
      path: `/user/${username}/profile`,
    },
  ];

  const ADMIN_NAV_ITEMS = [
  {
      title: "All Orders",
      icon: <ShoppingCartIcon />,
      path: `/admin/${username}/orders`,
    },
    {
      title: "approving Orders",
      icon: <SummarizeIcon />,
      path: `/admin/${username}/approvingOrders`,
    },
  
    {
      title: "Approved Orders",
      icon: <GradingIcon />,
      path: `/admin/${username}/approvedOrders`,
    },
    {
      title: "Synth Orders",
      icon: <ScienceIcon />,
      path: `/admin/${username}/synthingOrders`,
    },
    {
      title: "Approve Mails",
      icon: <MarkEmailReadIcon />,
      path: `/admin/${username}/approveMails`,
    },

    {
      title: "finished Orders",
      icon: <CheckCircleIcon />,
      path: `/admin/${username}/finishedOrders`,  
    },
  ];

  // Determine which nav items to display based on userType
  const NAV_ITEMS = userType === "admin" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <ul>
          {NAV_ITEMS.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <div
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.selected : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className={styles.signOut} onClick={onSignOut}>
        <span className={styles.icon}>
          <CloseIcon />
        </span>
        <span className={styles.label}>Sign Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;

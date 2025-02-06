import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "../../shared/ThemeToggle/ThemeToggle";
import styles from "./DashboardNavbar.module.css";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className={styles.header}>
      <span className={styles.menuToggle} onClick={toggleSidebar}>
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </span>
      <div className={styles.logo}>Dashboard</div>
      <div className={styles.headerActions}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;

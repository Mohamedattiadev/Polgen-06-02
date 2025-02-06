import React, { useState, useEffect } from "react";
import styles from "./ThemeToggle.module.css";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button className={styles.themeToggle} onClick={toggleTheme}>
      {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </button>
  );
};

export default ThemeToggle;

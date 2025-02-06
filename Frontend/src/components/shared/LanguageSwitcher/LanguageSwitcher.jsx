import React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import styles from "./LanguageSwitcher.module.css"; // Create a CSS module for the switcher
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.languageSwitcher}>
      <LanguageIcon />
      <div className={styles.dropdown}>
        <button onClick={() => changeLanguage("en")}>en</button>
        <button onClick={() => changeLanguage("tr")}>tr</button>
        <button onClick={() => changeLanguage("ar")}>ar</button>
        <button onClick={() => changeLanguage("fr")}>fr</button>
        <button onClick={() => changeLanguage("ru")}>ru</button>
        <button onClick={() => changeLanguage("gr")}>gr</button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

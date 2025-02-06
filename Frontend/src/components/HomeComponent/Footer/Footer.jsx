import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      {/* Top Section */}
      <div className={styles.footerTop}>
        <div className={styles.footerInfo}>
          {/* Company Information */}
          <div className={styles.companyInfo}>
            <h6 className={styles.footerTitle}>{t("footer.company_name")}</h6>
            <p className={styles.footerDescription}>
              {t("footer.description")}
            </p>
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <p>{t("footer.address")}</p>
            <p>{t("footer.phone")}</p>
            <p>{t("footer.mobile_phone")}</p>
            <p>{t("footer.email")}</p>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className={styles.socialMedia}>
        <a
          href="https://x.com/PolgenB"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("footer.social_media.twitter")}
        >
          <TwitterIcon />
        </a>
        <a
          href="https://www.linkedin.com/company/polgen-biyoteknoloji"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("footer.social_media.linkedin")}
        >
          <LinkedInIcon />
        </a>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} {t("footer.company_name")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

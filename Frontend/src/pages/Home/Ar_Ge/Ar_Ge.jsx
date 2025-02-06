import styles from "./Ar_Ge.module.css";
import { useTranslation } from "react-i18next";

const Ar_Ge = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t("ar_ge.title")}</h1>
        <p>{t("ar_ge.description")}</p>
      </header>

      <section className={styles.projects}>
        <div className={styles.project}>
          <div className={styles.project_img}>
            <img src="/crispr1.jpeg" alt={t("ar_ge.project_1_title")} />
          </div>
          <div className={styles.project_text}>
            <h3>{t("ar_ge.project_1_title")}</h3>
            <p>{t("ar_ge.project_1_description")}</p>
          </div>
        </div>

        <div className={styles.project}>
          <div className={styles.project_img}>
            <img src="/crispr2.png" alt={t("ar_ge.project_2_title")} />
          </div>
          <div className={styles.project_text}>
            <h3>{t("ar_ge.project_2_title")}</h3>
            <p>{t("ar_ge.project_2_description")}</p>
          </div>
        </div>

        <div className={styles.project}>
          <div className={styles.project_img}>
            <img src="/crispr3.jpg" alt={t("ar_ge.project_3_title")} />
          </div>
          <div className={styles.project_text}>
            <h3>{t("ar_ge.project_3_title")}</h3>
            <p>{t("ar_ge.project_3_description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ar_Ge;

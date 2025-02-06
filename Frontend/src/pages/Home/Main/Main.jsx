import Slider from "../../../components/HomeComponent/Slider/Slider.jsx";
import styles from "./Main.module.css";
import { useTranslation } from "react-i18next";

const Main = () => {
  const { t } = useTranslation();

  const sections = t("main.sections", { returnObjects: true });

  return (
    <>
      {/* Slider Section */}
      <Slider />

      {/* Content Sections */}
      <div className={styles.container}>
        {sections.map((section, index) => (
          <div key={index} className={styles.section}>
            <div className={styles.imageContent}>
              <img
                src={t(`main.sections.${index}.imgSrc`)}
                alt={section.title}
                className={styles.image}
              />
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>{section.title}</h2>
              <p className={styles.description}>{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;

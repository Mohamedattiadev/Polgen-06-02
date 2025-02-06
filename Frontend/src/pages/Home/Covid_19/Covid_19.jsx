import styles from "./Covid_19.module.css";
import { useTranslation } from "react-i18next";

const Covid_19 = () => {
  const { t } = useTranslation();

  // Fetch data from the translation keys
  const covidData = t("covid_19", { returnObjects: true });

  // Render the stats dynamically from the JSON structure
  const stats = [
    {
      value: covidData.stat1.value,
      label: covidData.stat1.label,
      description: covidData.stat1.description,
    },
    {
      value: covidData.stat2.value,
      label: covidData.stat2.label,
      description: covidData.stat2.description,
    },
    {
      value: covidData.stat3.value,
      label: covidData.stat3.label,
      description: covidData.stat3.description,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <img
          src="/covid_19.jpg"
          alt={covidData.title}
          className={styles.image}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <h1 className={styles.title}>{covidData.title}</h1>
        <p className={styles.description}>{covidData.description}</p>

        {/* Stats Section */}
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <h3 className={styles.statNumber}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statDescription}>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Covid_19;

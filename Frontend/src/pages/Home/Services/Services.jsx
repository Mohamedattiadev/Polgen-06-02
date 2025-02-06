import React, { useState } from "react";
import styles from "./Services.module.css";
import { useTranslation } from "react-i18next"; // Import the translation hook

const Services = () => {
  const { t } = useTranslation();

  // Services data (replace with complete details from the website)
  const services = [
    {
      title: t("services.service_1_title"),
      description: t("services.service_1_desc"),
      subcategories: [
        t("services.service_1_sub_1"),
        t("services.service_1_sub_2"),
        t("services.service_1_sub_3"),
      ],
    },
    {
      title: t("services.service_2_title"),
      description: t("services.service_2_desc"),
      subcategories: [
        t("services.service_2_sub_1"),
        t("services.service_2_sub_2"),
        t("services.service_2_sub_3"),
      ],
    },
    {
      title: t("services.service_3_title"),
      description: t("services.service_3_desc"),
      subcategories: [
        t("services.service_3_sub_1"),
        t("services.service_3_sub_2"),
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t("services.title")}</h2>
      <div className={styles.accordion}>
        {services.map((service, index) => (
          <div
            key={index}
            className={`${styles.accordionItem} ${
              activeIndex === index ? styles.active : ""
            }`}
          >
            <div
              className={styles.accordionHeader}
              onClick={() => toggleAccordion(index)}
            >
              <h3 className={styles.accordionTitle}>{service.title}</h3>
              <span className={styles.icon}>
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className={styles.accordionContent}>
                <p>{service.description}</p>
                <ul className={styles.subcategories}>
                  {service.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;


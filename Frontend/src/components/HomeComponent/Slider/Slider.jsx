import { Carousel } from 'react-bootstrap';
import slider1 from "../../../assets/Slider_images/slider1.jpg";
import slider2 from "../../../assets/Slider_images/slider2.jpg";
import slider3 from "../../../assets/Slider_images/slider3.jpg";
import styles from './Slider.module.css';
import { useTranslation } from 'react-i18next';

const Slider = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.carouselContainer}>
      <Carousel>
        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles.carouselImage}`}
            src={slider1}
            alt={t('main.slider_1')}
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{t('main.slider_1')}</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles.carouselImage}`}
            src={slider2}
            alt={t('main.slider_2')}
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{t('main.slider_2')}</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles.carouselImage}`}
            src={slider3}
            alt={t('main.slider_3')}
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <h3>{t('main.slider_3')}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Slider;


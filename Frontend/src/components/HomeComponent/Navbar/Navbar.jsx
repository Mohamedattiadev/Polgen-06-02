import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageSwitcher from '../../shared/LanguageSwitcher/LanguageSwitcher.jsx';
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle.jsx';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const Logo = '/polgen-logo.png';

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <nav className={`${styles.links} ${isMenuOpen ? styles.open : ''}`}>
        <ul>
          <li><Link to="/about">{t('navbar.about_us')}</Link></li>
          <li><Link to="/contact">{t('navbar.contact_us')}</Link></li>
          <li><Link to="/services">{t('navbar.our_services')}</Link></li>
          <li><Link to="/covid_19_test">{t('navbar.covid_19_test')}</Link></li>
          <li><Link to="/Ar-Ge">{t('navbar.ar_ge')}</Link></li>
        </ul>
      </nav>

      <div className={styles.icons}>
        <Link to="/login" className={styles.shoppingLink}>
          <ShoppingBagIcon />
        </Link>
        <LanguageSwitcher />
        <ThemeToggle />
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;


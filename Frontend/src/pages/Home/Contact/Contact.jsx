import styles from './Contact.module.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { contact } from '../../../api/auth'; // Import the contact API function

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setError(false);
    setLoading(true);

    try {
      const response = await contact(formData); // Call the contact API
      setStatusMessage(response.message); // Use the message from the response
      setFormData({ name: '', email: '', message: '' }); // Clear the form
    } catch (err) {
      console.error('Error sending contact message:', err);
      setStatusMessage(t('contact.form.error'));
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('contact.title')}</h1>
      <p className={styles.description}>{t('contact.description')}</p>
      <p className={styles.contactInfo}>{t('contact.email')}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          {t('contact.form.name')}:
          <input
            type="text"
            name="name"
            className={styles.input}
            placeholder={t('contact.form.name')}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          {t('contact.form.email')}:
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder={t('contact.form.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          {t('contact.form.message')}:
          <textarea
            name="message"
            className={styles.textarea}
            placeholder={t('contact.form.message')}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? t('contact.form.loading') : t('contact.form.submit')}
        </button>
      </form>
      {statusMessage && (
        <p className={`${styles.statusMessage} ${error ? styles.error : styles.success}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default Contact;


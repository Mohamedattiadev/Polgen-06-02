import React, { useState } from 'react';
import { forgotPassword } from '../../../api/auth';
import { useTranslation } from 'react-i18next';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.emailExists) {
        setMessage(
          response.message || t('forgot_password.success_message', 'A reset link has been sent to your email.')
        );
      } else {
        setError(
          response.message || t('forgot_password.email_not_found', 'Email does not exist in our records.')
        );
      }
    } catch (err) {
      setError(
        err.error || t('forgot_password.error_message', 'Something went wrong. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h3>{t('forgot_password.title', 'Forgot Password')}</h3>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <input
            className={styles.inputField}
            type="email"
            placeholder={t('forgot_password.email_placeholder', 'Enter your email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? t('forgot_password.loading', 'Submitting...') : t('forgot_password.submit', 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;


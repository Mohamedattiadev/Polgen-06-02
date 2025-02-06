import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams(); // Extract token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t('reset_password.passwords_do_not_match'));
      setLoading(false);
      return;
    }

    try {
      console.log('Token being sent:', token); // Debugging
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: password,
      });

      setMessage(response.data.message); // Success message
      setTimeout(() => {
        navigate('/login');
      }, 5000); // Redirect to login page after 5 seconds
    } catch (err) {
      const backendError =
        err.response?.data?.validationErrors?.[0]?.msg || err.response?.data?.error;
      console.error('Reset Password Error:', err.response || err.message || err);
      setError(backendError || t('reset_password.error_message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h3>{t('reset_password.title')}</h3>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleResetPassword}>
          <input
            className={styles.inputField}
            type="password"
            placeholder={t('reset_password.new_password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder={t('reset_password.confirm_password')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? t('reset_password.loading') : t('reset_password.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;


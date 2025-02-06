import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/auth.js"; // Make sure your auth file is correct
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ email, password }, navigate); // Pass navigate here

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.role === "admin") {
        navigate(`/admin/${response.user.username}/Orders`);
      } else {
        navigate(`/user/${response.user.username}/dashboard`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || t("login.error_message");

      if (err.response?.status === 403) {
        setError("Your account has not been approved by the admin.");
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h3>{t("login.title")}</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={t("login.email")}
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("login.password")}
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.loginButton}>
            {t("login.submit")}
          </button>
        </form>
        <p className={styles.signup}>
          {t("login.no_account")}{" "}
          <Link to="/register">{t("login.signup")}</Link>
        </p>
        <p className={styles.forgotPassword}>
          <Link to="/Forgot_password">{t("login.forgot_password")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

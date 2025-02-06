import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AdminSendingMail.module.css";
import sendSpecificMail from "../../../../api/mail";

const AdminSendingMail = ({ onClose, data, loading, error }) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(""); // New state for subject

  // Template that can be modified
  const defaultTemplate = `   We are reaching out to inform you about an important update regarding your account.
  Please review the changes at your earliest convenience.

  Thank you,  
  The Team of Polgen
  `;

  useEffect(() => {
    // Pre-fill the message textarea with the default template and inject the username
    const populatedTemplate = defaultTemplate.replace(
      "{username}",
      data.username
    );
    setMessage(populatedTemplate); // Set the default message template
  }, [data.username]); // Update when data.username changes

  const handleSend = () => {
    // Check if subject or body is empty
    if (!subject || !message) {
      alert("Both subject and body are required to send the email.");
      return; // Do not send if subject or body is empty
    }

    const emailData = {
      to: data.email, // Send the email to the data.user (i.e., data.email)
      subject: subject, // Use the subject from the input field
      username: data.username, // Pass the username to the email template
      body: message, // Use the message from the textarea (modified by user)
    };

    sendSpecificMail(emailData)
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    onClose(); // Close the popup after sending the email
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <h2>Sending a Mail </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.popupContent}>
            <h3>Dear: {data.username}</h3>
            <h4>to : {data.email}</h4>

            {/* Subject Input */}
            <input
              className={styles.subjectInput}
              value={subject}
              onChange={(e) => setSubject(e.target.value)} // Update subject on change
              placeholder="Enter subject..."
            />

            {/* Message Textarea with Template */}
            <textarea
              className={styles.messageInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update message on textarea change
              placeholder="Write your message here..."
            />

            <button className={styles.sendButton} onClick={handleSend}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSendingMail;

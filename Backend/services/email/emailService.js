import transporter from './transporter.js';
import registrationTemplate from './templates/registrationTemplate.js';
import passwordResetTemplate from './templates/passwordResetTemplate.js';
import contactTemplate from './templates/contactTemplate.js';
import approvedTemplate from './templates/approvedTemplate.js';
import workingOnTemplate from './templates/workingOnTemplate.js';
import finishedTemplate from './templates/finishedTemplate.js';
import approvedFromAdminTemplate from "./templates/approvedFromAdminTemplate.js";

export const ApprovedEmailFromAdmin = async (email, username, status) => {
    try {
        const subject = status === 'approved' ? 'Account Approved!' : 'Account Approval Revoked';
        const mailOptions = {
          from: `"Polgen Notification" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: approvedFromAdminTemplate(username, email, status),
        };
        await transporter.sendMail(mailOptions);
        console.log(`${status === 'approved' ? 'Approval' : 'Revocation'} email sent to ${email}`);
      } catch (error) {
        console.error(`Error sending ${status} email:`, error.message);
        throw error;
      }
    };
export const sendApprovedEmail = async (email, username, productName) => {
  try {
    const mailOptions = {
      from: `"Polgen Notification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Product Has Been Approved',
      html: approvedTemplate(username, productName),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error('Error sending approval email:', error.message);
    throw error;
  }
};

export const sendWorkingOnEmail = async (email, username, productName) => {
  try {
    const mailOptions = {
      from: `"Polgen Notification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Product is in Progress',
      html: workingOnTemplate(username, productName),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Working on email sent to ${email}`);
  } catch (error) {
    console.error('Error sending working on email:', error.message);
    throw error;
  }
};

export const sendFinishedEmail = async (email, username, productName) => {
  try {
    const mailOptions = {
      from: `"Polgen Notification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Product is Ready',
      html: finishedTemplate(username, productName),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Finished email sent to ${email}`);
  } catch (error) {
    console.error('Error sending finished email:', error.message);
    throw error;
  }
};


export const sendRegistrationEmail = async (email, username, password) => {
  try {
    const mailOptions = {
      from: `"Polgen Registration" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Polgen',
      html: registrationTemplate(username, email, password),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${email}`);
  } catch (error) {
    console.error('Error sending registration email:', error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: `"Polgen Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: passwordResetTemplate(resetLink),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw error;
  }
};

export const sendContactEmail = async (name, userEmail, message) => {
  try {
    const mailOptions = {
      from: `"${name}" <${userEmail}>`,
      to: process.env.SMTP_USER,
      subject: 'Contact Form Submission',
      html: contactTemplate(name, userEmail, message),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent from ${userEmail}`);
  } catch (error) {
    console.error('Error sending contact email:', error.message);
    throw error;
  }
};

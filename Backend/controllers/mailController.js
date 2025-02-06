// In your mailController.js
import transporter from "../services/email/transporter.js"; // Correct the relative path to the transporter.js

export const sendSpecificMail = async (req, res) => {
  const { to, subject, username, body } = req.body; // Destructure the data received from the frontend
  const from = process.env.SMTP_USER;
  const modfiedBody = `
  <div style="font-family: Arial, sans-serif; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 800px; margin: auto;">
    <h2 style="color: #4CAF50; text-align: center;">${subject}</h2>
    <p>Dear ${username},</p>
    <p>${body}</p> <!-- The dynamic body content -->
    <p>Thank you for choosing Polgen!</p>
  </div>
`;

  const mailOptions = {
    from: from, // Sender's email
    to: to, // Recipient's email (dynamic)
    subject: subject, // Email subject (dynamic)
    html: modfiedBody, // Email content (dynamic
  };

  try {
    // Send the email using the transporter
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

const passwordResetTemplate = (resetLink) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; font-size: 16px; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #FF6F61; font-size: 24px; margin-bottom: 10px;">🔒 Password Reset Request</h1>
      <p style="color: #666; font-size: 14px;">We received a request to reset your password. If this was not you, you can safely ignore this email.</p>
    </div>
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center;">
      <p style="margin: 0; font-size: 16px; color: #555;">Click the button below to reset your password:</p>
      <a href="${resetLink}" style="display: inline-block; margin-top: 15px; padding: 12px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    <div style="margin-top: 20px; text-align: center; color: #aaa; font-size: 14px;">
      <p>This link will expire in 1 hour. If you need further assistance, please contact our support team.</p>
      <p>Best regards,<br><strong>Your App Team</strong></p>
    </div>
  </div>
`;
export default passwordResetTemplate;


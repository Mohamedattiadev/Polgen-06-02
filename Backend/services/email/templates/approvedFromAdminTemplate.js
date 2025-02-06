const approvedFromAdminTemplate = (username, email, status) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; font-size: 16px; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: ${status === 'approved' ? '#4CAF50' : '#FF6347'}; font-size: 24px; margin-bottom: 10px;">
        ${status === 'approved' ? '🎉 Congratulations!' : '🚫 Notice'}
      </h1>
      <p style="color: #666; font-size: 14px;">
        ${status === 'approved'
          ? `Your account has been approved by the admin. You can now log in and start using the app.`
          : `Your account approval has been revoked. Please contact support if you believe this was a mistake.`}
      </p>
    </div>
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <p style="margin: 0; font-size: 16px;"><strong style="color: #333;">Email:</strong> ${email}</p>
    </div>
    <div style="margin-top: 20px; text-align: center; color: #aaa; font-size: 14px;">
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The App Team</p>
    </div>
  </div>
`;

export default approvedFromAdminTemplate;

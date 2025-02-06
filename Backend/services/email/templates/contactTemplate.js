const contactTemplate = (name, userEmail, message) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; font-size: 16px; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 5px;">📩 New Contact Form Submission</h1>
      <p style="color: #888; font-size: 14px;">You have a new message from your website contact form</p>
    </div>
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <p style="margin: 0; font-size: 16px;"><strong style="color: #333;">Name:</strong> ${name}</p>
      <p style="margin: 0; font-size: 16px;"><strong style="color: #333;">Email:</strong> <a href="mailto:${userEmail}" style="color: #007bff; text-decoration: none;">${userEmail}</a></p>
      <p style="margin: 0; font-size: 16px; margin-top: 10px;"><strong style="color: #333;">Message:</strong></p>
      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-top: 5px; color: #555; font-size: 15px; border-left: 4px solid #4CAF50;">
        ${message}
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="font-size: 14px; color: #aaa;">This email was sent automatically. Please do not reply.</p>
    </div>
  </div>
`;
export default contactTemplate;


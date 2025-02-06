const submissionConfirmationTemplate = (username, products) => {
  const totalOrderPrice = products.reduce((sum, product) => sum + product.totalPrice, 0);

  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd; max-width: 800px; margin: auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;">Submission Confirmation</h1>
        <p style="color: #666;">Dear ${username},</p>
        <p style="color: #666;">Your order has been successfully submitted. Below are the details:</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">5' modification</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">3' modification</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Purification</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Scale</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Oligo Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Price (€)</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.category}</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${product.modifications.fivePrime}</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${product.modifications.threePrime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.saflaştırma || "N/A"}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.scale}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.oligoAdi}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.totalPrice.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;" colspan="7"><strong>Total Order Price:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>${totalOrderPrice.toFixed(2)} €</strong></td>
          </tr>
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 14px; color: #aaa;">Thank you for your submission!</p>
      </div>
    </div>
  `;
};

export default submissionConfirmationTemplate;


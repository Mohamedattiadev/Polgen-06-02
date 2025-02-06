const approvedTemplate = (username, products) => `
  <div style="font-family: Arial, sans-serif; color: #444; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 800px; margin: auto;">
    <h2 style="color: #4CAF50; text-align: center;">✅ Your Products Have Been Approved</h2>
    <p>Dear ${username},</p>
    <p>We are pleased to inform you that the following products have been approved:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Category</th>
          <th style="border: 1px solid #ddd; padding: 8px;">5' Modification</th>
          <th style="border: 1px solid #ddd; padding: 8px;">3' Modification</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Scale</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Oligo Name</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Total Price (€)</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.category}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.modifications.fivePrime || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.modifications.threePrime || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.scale}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.oligoAdi}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${product.totalPrice.toFixed(2)} €</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    <p>Thank you for choosing Polgen!</p>
  </div>
`;

export default approvedTemplate;


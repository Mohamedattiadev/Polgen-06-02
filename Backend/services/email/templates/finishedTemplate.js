import approvedTemplate from './approvedTemplate.js';

const finishedTemplate = (username, products) => approvedTemplate(username, products)
  .replace('✅ Your Products Have Been Approved', '🎉 Your Products Are Ready!') // Replace header text
  .replace('approved', 'completed'); // Replace all occurrences of "approved" with "completed"

export default finishedTemplate;


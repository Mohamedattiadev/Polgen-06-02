import approvedTemplate from './approvedTemplate.js';

const workingOnTemplate = (username, products) => approvedTemplate(username, products)
  .replace('✅ Your Products Have Been Approved', '⚙️ Your Products Are in Progress') // Replace header text
  .replace('approved', 'being processed'); // Replace all occurrences of "approved" with "being processed"

export default workingOnTemplate;


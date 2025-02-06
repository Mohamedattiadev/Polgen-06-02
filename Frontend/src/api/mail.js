import API from "./api"; // Import the API instance
// Default export of the sendSpecificMail function
const sendSpecificMail = async (emailData) => {
  try {
    const response = await API.post("/mail", emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default sendSpecificMail;

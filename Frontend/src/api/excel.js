// Generate Excel template
import API from "./api";
const getAuthToken = () =>
  localStorage.getItem("authToken") || localStorage.getItem("token");
export const generateExcelTemplate = async (data) => {
  try {
    const token = getAuthToken(); // Ensure token is included in requests
    const response = await API.post("/excel/exportwb", data, {
      responseType: "blob", // Ensure the response is a blob
      headers: {
        Authorization: `Bearer ${token}`, // Add token for secure API access
      },
    });

    // Create a downloadable Blob from the response
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template.xlsx"; // File name for the download
    link.click();
  } catch (error) {
    console.error(
      "Error generating Excel template:",
      error.response?.data || error.message
    );
    throw error; // Rethrow error to the frontend
  }
};

// Import Excel File
export const importExcelFile = async (file, userId, mode) => {
  console.log(file)
  console.log(userId)
  console.log(mode)
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId); // ✅ Add userId
    formData.append("mode", mode); // ✅ Add mode

    const token = getAuthToken(); // Retrieve the authentication token if required
    const response = await API.post("/excel/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include token for secure API access
      },
    });

    console.log("Response Data:", response.data);
    return response.data; // Return the imported data from the server
  } catch (error) {
    console.error(
      "Error importing Excel file:",
      error.response?.data || error.message
    );
    throw error; // Rethrow error for handling in the calling component
  }
};


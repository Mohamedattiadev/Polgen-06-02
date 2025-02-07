import API from "./api"; // Import the API instance

let isRefreshing = false; // To avoid multiple refresh calls
let refreshPromise = null; // Promise to share refresh result across calls

// Helper to generate a unique key for user-specific data
const getAuthKey = (sessionId) => `auth_${sessionId}`;
export const fetchUsers = async () => {
  try {
    const response = await API.get("/auth/users");
    return response.data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    throw error;
  }
};

export const approveUser = async (id, isApprovedFromAdmin) => {
  try {
    await API.put(`/auth/users/${id}`, { isApprovedFromAdmin });
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error.message);
    throw error;
  }
};

// Function to refresh the authentication token
// export const refreshAuthToken = async () => {
//   if (isRefreshing) return refreshPromise;

//   isRefreshing = true;

//   refreshPromise = (async () => {
//     try {
//       const sessionId = sessionStorage.getItem("sessionId");
//       if (!sessionId) throw new Error("Session ID is missing");

//       const authKey = getAuthKey(sessionId);
//       const userData = JSON.parse(sessionStorage.getItem(authKey));

//       if (!userData || !userData.refreshToken) {
//         throw new Error("Refresh token is missing");
//       }

//       // Call the refresh token API
//       const response = await API.post("/auth/refresh-token", {
//         refreshToken: userData.refreshToken,
//         sessionId,
//       });

//       const { token: newToken, refreshToken: newRefreshToken } = response.data;

//       // Update sessionStorage with the new tokens
//       sessionStorage.setItem(
//         authKey,
//         JSON.stringify({
//           ...userData,
//           token: newToken,
//           refreshToken: newRefreshToken || userData.refreshToken,
//         })
//       );

//       console.log("Token refreshed successfully.");
//       return newToken;
//     } catch (error) {
//       console.error("Failed to refresh token:", error.message);
//       sessionStorage.clear();
//       window.location.href = "/login";
//       throw error;
//     } finally {
//       isRefreshing = false;
//       refreshPromise = null;
//     }
//   })();

//   return refreshPromise;
// };

// Fetch user profile based on the stored auth token
export const getUserProfile = async (navigate) => {
  try {
    const sessionId = sessionStorage.getItem("sessionId");
    const authKey = getAuthKey(sessionId);
    const userData = JSON.parse(sessionStorage.getItem(authKey));

    if (!userData || !userData.token) {
      console.error(
        `Authentication token is missing for session: ${sessionId}`
      );
      throw new Error("Authentication token is missing");
    }

    // Fetch user profile
    const response = await API.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },

      timeout: 10000, // Set a reasonable timeout
    });

    return response.data.user;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    navigate("/login"); // Redirect to login on error
    throw error;
  }
};

// User Registration
export const register = async (data) => {
  try {
    const response = await API.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login Function
export const login = async (data, navigate) => {
  try {
    const response = await API.post("/auth/login", data);
    const { token, user, sessionId } = response.data; // Removed refreshToken

    // Store sessionId and user-specific data in sessionStorage
    const authKey = getAuthKey(sessionId);
    sessionStorage.setItem(authKey, JSON.stringify({ token, profile: user }));
    sessionStorage.setItem("sessionId", sessionId);

    navigate(`/user/${user.username}/dashboard`); // Redirect to user's dashboard
    return { token, user }; // Removed refreshToken
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      navigate("/login"); // Redirect to login if unauthorized
    }

    throw error;
  }
};

// Forgot Password Request
export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Reset Password API
export const resetPassword = async (data) => {
  try {
    const response = await API.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Contact API
export const contact = async (data) => {
  try {
    const response = await API.post("/auth/contact", data);
    return response.data;
  } catch (error) {
    console.error("Contact Error:", error.response?.data || error.message);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (updatedData) => {
  try {
    const sessionId = sessionStorage.getItem("sessionId");
    const authKey = getAuthKey(sessionId);

    if (!sessionId) {
      console.error("Session ID is missing in sessionStorage");
      throw new Error("Session ID is missing");
    }

    const userData = JSON.parse(sessionStorage.getItem(authKey)); // Fetch user-specific data

    if (!userData || !userData.token) {
      console.error(
        `Authentication token is missing for session: ${sessionId}`
      );
      throw new Error("Authentication token is missing");
    }

    console.log("Updated Data:", updatedData); // Log the payload being sent

    // Perform profile update
    const response = await API.put("/auth/profile", updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`, // Send token in Authorization header
      },
    });

    console.log("Response Data:", response.data); // Log the response from the backend

    // Update profile in sessionStorage
    const updatedProfile = response.data.user;
    sessionStorage.setItem(
      authKey,
      JSON.stringify({
        ...userData,
        profile: updatedProfile,
      })
    );

    return updatedProfile; // Return updated profile
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw error; // Re-throw the error after logging
  }
};

export const getUserById = async (userId) => {
  try {
    const sessionId = sessionStorage.getItem("sessionId");
    const authKey = getAuthKey(sessionId);
    const userData = JSON.parse(sessionStorage.getItem(authKey)); // Fetch user-specific data

    if (!userData || !userData.token) {
      throw new Error("Authentication token is missing");
    }

    // Make the fetch call with the Authorization header
    const response = await fetch(
      `http://localhost:5000/api/auth/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${userData.token}`, // Pass the token in the header
        },
      }
    );

    const text = await response.text(); // Get raw text response for debugging
    console.log("Response Text:", text); // Log raw response

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    try {
      const data = JSON.parse(text); // Parse JSON if successful
      return data;
    } catch (parseError) {
      throw new Error("Failed to parse JSON response");
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

// api/auth.js (or wherever your API functions are)
export const deleteUser = async (userId) => {
  try {
    await API.delete(`/auth/users/${userId}`);
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error.message);
    throw error;
  }
};

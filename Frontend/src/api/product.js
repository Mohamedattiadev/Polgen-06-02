import API from "./api"; // Reuse the API instance created earlier

// // Utility to get the token
// const getAuthToken = () =>
//   localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
// // Add a new product

// Utility to get the token
const getAuthToken = () => {
  const sessionId = sessionStorage.getItem("sessionId"); // Get the session ID
  if (!sessionId) {
    console.error("Session ID is missing.");
    return null;
  }

  const authKey = `auth_${sessionId}`; // Generate the session-specific key
  const userData = JSON.parse(sessionStorage.getItem(authKey)); // Retrieve user-specific data
  if (!userData || !userData.token) {
    console.error("Token is missing for session:", sessionId);
    return null;
  }

  return userData.token; // Return the token
};

export const addProduct = async (productData) => {
  try {
    const payload = {
      products: productData.map((product) => ({
        index: product.index || 0,
        category: product.category || "defaultcategory", // Ensure a valid category
        modifications: {
          fivePrime: product.modifications?.fivePrime || "", // Properly serialize
          threePrime: product.modifications?.threePrime || "",
        },
        saflaştırma: product.saflaştırma || "", // Ensure naming matches backend
        uzunluk: product.uzunluk || 0,
        sekans: product.sekans || " ",
        scale: product.scale || "nmol",
        totalPrice: product.totalPrice || 0,
        oligoAdi: product.oligoAdi || "Unnamed Product",
        userId: product.userId || "", // Validate this field
        quantity: product.quantity || 1,
        GroupId: product.GroupId,
        isApproved: product.isApproved || false,
        isOrder: product.isOrder || false,
        isFromControlGroup: product.isFromControlGroup || false,
      })),
    };

    const token = getAuthToken(); // Get token from storage
    if (!token) throw new Error("Authentication token is missing");

    const response = await API.post("/products", JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding product:",
      error.response?.data || error.message
    );
    throw error; // Let the calling component handle it
  }
};

// Get products for the authenticated user
// Get products (all or for a specific user)
export const getProducts = async (userRole, userId, isSpecificUser = false) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token is missing");

    const response = await API.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
        isSpecificUser,
      },
    });

    return response.data; // List of products
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data; // Return the product details for the specified ID
  } catch (error) {
    console.error(
      `Error fetching product with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error; // Rethrow error for handling in the calling component
  }
};

// Update an existing product by ID
export const updateProduct = async (id, updatedData) => {
  try {
    console.log("Updating product with ID:", id); // Debugging log
    console.log("Updated Data:", updatedData); // Debugging log

    console.log("Update Request ID:", id);
    const response = await API.put(`/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating product with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response.data; // Return the response from the delete request
  } catch (error) {
    console.error(
      `Error deleting product with ID ${id}:`,
      error.response?.data || error.message
    );
    throw error; // Rethrow error for handling in the calling component
  }
};

// In your API file (api/product.js)
export const getGroupById = async (groupId) => {
  try {
    const response = await API.get(`/products/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting group ${groupId}:`, error);
    throw error;
  }
};

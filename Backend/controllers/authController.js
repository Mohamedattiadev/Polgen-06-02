import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendContactEmail,
  ApprovedEmailFromAdmin,
} from "../services/email/emailService.js";

// Fetch all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "address",
        "isApprovedFromAdmin",
      ], // Fetch relevant fields
    });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

// Update user approval status
export const updateUserApproval = async (req, res, next) => {
  const { userId } = req.params;
  const { isApprovedFromAdmin } = req.body;

  try {
    console.log("Update approval status:", { userId, isApprovedFromAdmin });

    const user = await User.findByPk(userId);
    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.isApprovedFromAdmin = isApprovedFromAdmin;
    await user.save();

    console.log("User updated successfully:", user);

    const status = isApprovedFromAdmin ? "approved" : "revoked";
    await ApprovedEmailFromAdmin(user.email, user.username, status);

    res.json({ message: "User approval status updated successfully", user });
  } catch (error) {
    console.error("Error updating user approval:", error.message);
    next(error);
  }
};

// Register User Handler
export const registerUser = async (req, res, next) => {
  const {
    username,
    email,
    password,
    phone,
    address,
    role,
    isApprovedFromAdmin,
  } = req.body; // Include isApprovedFromAdmin
  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole =
      role && ["user", "admin"].includes(role) ? role : "user";

    // Create the new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      role: assignedRole,
      isApprovedFromAdmin: isApprovedFromAdmin || false, // Default to false if not provided
      refreshToken: null,
      refreshTokenExpiry: null,
    });

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
    );

    // // Create a refresh token
    // const refreshToken = crypto.randomBytes(40).toString("hex");
    // user.refreshToken = refreshToken; // Store the refresh token in the database
    await user.save();

    // Send registration email
    await sendRegistrationEmail(email, username, password);

    // Respond with success message and tokens
    res.status(201).json({
      message: "User registered successfully.",
      user,
      token,
      // refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login User Handler
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    if (!user.isApprovedFromAdmin) {
      return res
        .status(403)
        .json({ error: "Your account has not been approved by the admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
    );
    // const refreshToken = crypto.randomBytes(40).toString("hex");

    // user.refreshToken = refreshToken;
    const sessionId = crypto.randomUUID();
    user.sessionId = sessionId;
    await user.save();

    res.json({
      message: "Login successful.",
      token,
      // refreshToken,
      user,
      sessionId,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Auth Token Handler
// export const refreshAuthToken = async (req, res, next) => {
//   const { refreshToken, sessionId } = req.body;

//   if (!refreshToken || !sessionId) {
//     return res
//       .status(400)
//       .json({ error: "Refresh token and sessionId are required" });
//   }

//   try {
//     console.log("Received Refresh Token:", refreshToken);
//     console.log("Received Session ID:", sessionId);

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(refreshToken)
//       .digest("hex");

//     // Find user by hashed refresh token and sessionId
//     const user = await User.findOne({
//       where: { refreshToken: hashedToken, sessionId },
//     });

//     if (!user) {
//       console.error("User not found with provided refresh token and sessionId");
//       return res
//         .status(401)
//         .json({ error: "Invalid refresh token or sessionId" });
//     }

//     // Check if the refresh token has expired
//     if (user.refreshTokenExpiry && user.refreshTokenExpiry < Date.now()) {
//       console.error("Refresh token has expired for user:", user.id);
//       return res.status(401).json({ error: "Refresh token has expired" });
//     }

//     // Generate new tokens
//     const newAccessToken = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     const newRefreshToken = crypto.randomBytes(40).toString("hex");

//     // Hash and save the new refresh token
//     user.refreshToken = crypto
//       .createHash("sha256")
//       .update(newRefreshToken)
//       .digest("hex");
//     user.refreshTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//     await user.save();

//     res.json({
//       token: newAccessToken,
//       refreshToken: newRefreshToken,
//       sessionId,
//     });
//   } catch (error) {
//     console.error("Error refreshing token:", error.message);
//     next(error);
//   }
// };

// Get User Profile Handler
export const getUserProfile = async (req, res, next) => {
  const userId = req.user.id; // This will work because req.user is set by the JWT middleware

  try {
    // Find the user by their ID
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Return the user's profile
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Contact Us Handler
export const contactUs = async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    // Validate the required fields
    if (!name || !email || !message)
      throw new Error("All fields are required.");

    // Send contact email
    await sendContactEmail(name, email, message);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Handler
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        emailExists: false,
        message: "If the email exists, a reset link has been sent.",
      });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset_password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    // Send response
    res.status(200).json({
      emailExists: true,
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password Handler
export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    // Hash the token to match with the stored one
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the valid reset token and ensure it hasn't expired
    const user = await User.findOne({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null; // Remove the reset token after use
    user.resetTokenExpiry = null; // Remove the expiry after use
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};

// Update User Profile Handler
export const updateUserProfile = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body

    const { username, email, phone, address } = req.body;

    // Ensure `req.user.id` is set by the middleware
    if (!req.user || !req.user.id) {
      console.error("Unauthorized access: req.user is missing");
      return res
        .status(401)
        .json({ error: "Unauthorized: No user ID provided" });
    }

    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the username already exists and is not the same user
    if (username) {
      const existingUser = await User.findOne({ where: { username } });
      console.log("Existing User:", existingUser);
      if (existingUser && existingUser.id !== userId) {
        console.error(
          `Username "${username}" is already taken by another user`,
        );
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Save the updated user
    await user.save();

    console.log("User updated successfully:", user);
    res.json({ user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get User by ID Handler
export const getUserById = async (req, res) => {
  const { userId } = req.params; // Get the userId from the URL params

  try {
    // Use findByPk for Sequelize as 'id' is typically the primary key
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "phone", "address"], // Return only selected attributes
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user }); // Return the user object to the frontend
  } catch (err) {
    console.error("Error fetching user:", err); // Log error for debugging
    res.status(500).json({ message: "Server error", error: err });
  }
};

// controllers/userController.js (or wherever your user-related controllers are)
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy(); // Delete the user from the database
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

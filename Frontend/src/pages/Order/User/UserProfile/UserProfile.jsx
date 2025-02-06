import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useOutletContext, useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../../../api/auth";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { userProfile, setUserProfile } = useOutletContext(); // Access user data from context
  const [formData, setFormData] = useState({
    username: userProfile.username,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, username: userProfile.username }));
  }, [userProfile.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      setError("All fields are required.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d+$/.test(formData.phone)) {
      setError("Phone number must contain only digits.");
      return;
    }

    try {
      setLoading(true);

      // Call the API to update the profile
      const updatedProfile = await updateUserProfile(formData);

      // console.log("Updated Profile:", updatedProfile);

      // Update the context with the new profile data
      setEditMode(false);
      setUserProfile(updatedProfile);
      navigate(`/user/${updatedProfile.username}/profile`);

      setTimeout(() => {
        toast.success("Profile updated successfully!");
      }, 3000);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.error ||
          "Error updating profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>User Profile</h2>
      <ToastContainer />
      {error && <div className={styles.error}>{error}</div>}
      {editMode ? (
        <form onSubmit={handleSubmit} className={styles.profileInfo}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className={styles.profileInfo}>
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Phone:</strong> {userProfile.phone}
          </p>
          <p>
            <strong>Address:</strong> {userProfile.address}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

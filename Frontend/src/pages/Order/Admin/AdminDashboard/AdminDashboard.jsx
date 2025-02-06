import React from "react";
import { useOutletContext } from "react-router-dom";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";

const AdminDashboard = () => {
  const { adminProfile } = useOutletContext(); // Access adminProfile from context

  return (
    <div>
      <h1>Welcome, {adminProfile?.username}</h1>
      <AdminTables/>
      {/* You can uncomment AdminTables or any other admin-specific components */}
      {/* <AdminTables /> */}
    </div>
  );
};

export default AdminDashboard;


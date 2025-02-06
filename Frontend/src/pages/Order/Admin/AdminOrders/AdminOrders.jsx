import React from "react";
import { useOutletContext } from "react-router-dom";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";

const AdminOrders = () => {
  const { adminProfile } = useOutletContext(); // Access adminProfile from context

  return (
    <div>
      <h1>Welcome, {adminProfile?.username}</h1>
      <AdminTables AdminPageName="Orders" />
      {/* Admin-specific orders or data */}
    </div>
  );
};

export default AdminOrders;

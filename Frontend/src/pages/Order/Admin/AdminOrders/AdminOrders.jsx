import {useState}  from "react";

import { useOutletContext } from "react-router-dom";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";

const AdminOrders = () => {
  const { adminProfile } = useOutletContext(); // Access adminProfile from context
 const [categoryFilter, setCategoryFilter] = useState("all");

  const filterCondition = (row) => {
    const isAllExceptIsFinished =
       !row.isFinished 
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isAllExceptIsFinished && matchesCategory;
  };
  return (
    <div>
      <h1>Welcome, {adminProfile?.username}</h1>
      <AdminTables filterCondition={filterCondition}AdminPageName="Orders" />
      {/* Admin-specific orders or data */}
    </div>
  );
};

export default AdminOrders;

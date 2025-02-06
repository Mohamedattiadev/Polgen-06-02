import React, { useState } from "react";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";
import styles from "./AdminApprovingOrders.module.css";

import AdminSynthisTables from "../../../../components/OrderComponent/AdminComponent/AdminSynthisTables/AdminSynthisTables";

const AdminApprovingOrders = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Define filter condition for synthing orders
  const filterCondition = (row) => {
    const isOrderOnly =
      row.isOrder && !row.isFinished && !row.isWorkingOn && !row.isApproved;
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isOrderOnly && matchesCategory;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}> Orders</h1>
      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.button} ${
            categoryFilter === "all" ? styles.active : ""
          }`}
          onClick={() => setCategoryFilter("all")}
        >
          All
        </button>
        <button
          className={`${styles.button} ${
            categoryFilter === "prime" ? styles.active : ""
          }`}
          onClick={() => setCategoryFilter("prime")}
        >
          Primer
        </button>
        <button
          className={`${styles.button} ${
            categoryFilter === "prop" ? styles.active : ""
          }`}
          onClick={() => setCategoryFilter("prop")}
        >
          Prop
        </button>
      </div>
      {/* Pass filterCondition as a prop */}
      <div className={styles.tableContainer}>
        <AdminTables
          filterCondition={filterCondition}
          AdminPageName="AdminApprovingOrders"
          nosearch=""
        />
      </div>
    </div>
  );
};

export default AdminApprovingOrders;

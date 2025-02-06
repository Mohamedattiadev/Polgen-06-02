import React, { useState } from "react";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";
import styles from "./AdminApprovedOrders.module.css";

const AdminApprovedOrders = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filterCondition = (row) => {
    const isApprovedOnly =
      row.isApproved && !row.isWorkingOn && !row.isFinished; // Only approved
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isApprovedOnly && matchesCategory;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Approved Orders</h1>
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
      <div className={styles.tableContainer}>
        <AdminTables
          filterCondition={filterCondition}
          AdminPageName="AdminApprovedOrders"
          nosearch=""
        />
      </div>
    </div>
  );
};

export default AdminApprovedOrders;

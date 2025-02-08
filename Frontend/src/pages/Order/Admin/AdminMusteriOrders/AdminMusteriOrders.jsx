
import React, { useState } from "react";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";
import styles from "./AdminMusteriOrders.module.css";
import AdminSynthisTables from "../../../../components/OrderComponent/AdminComponent/AdminSynthisTables/AdminSynthisTables";

const AdminMusteriOrders = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Define filter condition for synthing orders
  const filterCondition = (row) => {
    const isAll = row.isWorkingOn || row.isFinished || row.isApproved||row.isOrder; // Only "working on" and not finished
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isAll && matchesCategory;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Synthing Orders</h1>
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
        <AdminSynthisTables
          filterCondition={filterCondition}
          AdminPageName="AdminMusteriOrders"
          nosearch=""
        />
      </div>
    </div>
  );
};

export default AdminMusteriOrders;

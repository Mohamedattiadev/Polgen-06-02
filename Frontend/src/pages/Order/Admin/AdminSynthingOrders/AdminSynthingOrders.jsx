import React, { useState } from "react";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";
import styles from "./AdminSynthingOrders.module.css";
import AdminSynthingReports from "../AdminApprovingOrders/AdminApprovingOrders";
import AdminSynthisTables from "../../../../components/OrderComponent/AdminComponent/AdminSynthisTables/AdminSynthisTables";

const AdminSynthingOrders = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Define filter condition for synthing orders
  const filterCondition = (row) => {
    const isWorkingOnOnly = row.isWorkingOn && !row.isFinished; // Only "working on" and not finished
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isWorkingOnOnly && matchesCategory;
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
          AdminPageName="AdminSynthingOrders"
          nosearch=""
        />
      </div>
    </div>
  );
};

export default AdminSynthingOrders;

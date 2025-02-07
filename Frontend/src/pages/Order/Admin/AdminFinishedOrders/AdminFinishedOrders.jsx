import React, { useState } from "react";
import AdminTables from "../../../../components/OrderComponent/AdminComponent/AdminTables/AdminTables";
import styles from "./AdminFinishedOrders.module.css";


const AdminFinisedOrders = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Define filter condition for synthing orders
  const filterCondition = (row) => {
    const isFinishedOnly =
       row.isFinished 
    const matchesCategory =
      categoryFilter === "all" ||
      row.category?.toLowerCase() === categoryFilter.toLowerCase();
    return isFinishedOnly && matchesCategory;
  };




  return (
    <div className={styles.container}>
      <h1 className={styles.header}> finished Orders</h1>
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
          AdminPageName="AdminFinishedOrders"
          nosearch=""
        />
      </div>
    </div>
  );
};

export default AdminFinisedOrders;

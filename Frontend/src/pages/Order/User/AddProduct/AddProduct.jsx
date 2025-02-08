import React, { useEffect, useState } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import ProductComponent from "../../../../components/OrderComponent/UserComponent/ProductComponent/ProductComponent";
import styles from "./AddProduct.module.css";
import { addProduct } from "../../../../api/product";
import { toast, ToastContainer } from "react-toastify";
import {
  generateExcelTemplate,
  importExcelFile,
} from "../../../../api/excel.js";

import axios from "axios"; // Add this line
const AddProduct = () => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const { userProfile } = useOutletContext(); // Use the Outlet context to get userProfile
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [category, setCategory] = useState("prime");
  const [numberOfProducts, setNumberOfProducts] = useState(1);
  const [file, setFile] = useState(null); // State for storing the selected file
  const [mode, setMode] = useState("primer"); // New state for mode (primer/probe)

  useEffect(() => {
    if (!userProfile || userProfile.username !== urlUsername) {
      // Redirect if the profile is invalid
      navigate("/Error_404");
    }
  }, [userProfile, urlUsername, navigate]);

  const handleAddProduct = () => {
    const newProducts = Array.from({ length: numberOfProducts }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      category,
      modifications: {
        fivePrime: "",
        threePrime: "",
      },
      saflaştırma: category === "prime" ? "DSLT" : null,
    scale: category === "prime"
      ? (products.length > 0 ? products[products.length - 1].scale : "50 nmol") // Keeps last selected scale
      : "200 nmol", // Prop always 200 nmol
      totalPrice: 0, // Default to 0 to avoid undefined
      oligoAdi: "",
      selected: true,
    }));
    setProducts((prev) => [...prev, ...newProducts]);
  };

  const handleProductUpdate = (updatedProduct, index) => {
    setProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = updatedProduct;
      return updatedProducts;
    });
  };

  const handleRemoveProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const newTotalPrice = products.reduce(
      (sum, product) =>
        product.selected ? sum + (product.totalPrice || 0) : sum,
      0
    );
    setTotalPrice(newTotalPrice);
  }, [products]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProducts = products.filter((product) => product.selected);

    const productDetails = selectedProducts.map((product) => ({
      category: product.category,
      modifications: product.modifications,
      saflaştırma: product.category === "prime" ? product.saflaştırma : null,
      scale: product.scale,
      uzunluk: product.uzunluk,
      sekans: product.sekans || " ",
      totalPrice: product.totalPrice,
      oligoAdi: product.oligoAdi || "Unnamed Product",
      userId: userProfile?.id, // Use userProfile from context
      quantity: 1,
    }));

    try {
      await addProduct(productDetails);

      toast.success("Products added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(`/user/${urlUsername}/order`);
      }, 3500);

      setProducts([]);
      setTotalPrice(0);
    } catch (err) {
      console.error(
        "Error adding products:",
        err.response?.data || err.message
      );
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the state with the selected file
  };

  const handleImportExcel = async () => {
    try {
      if (!file) {
        toast.error("Please select a file to upload.");
        return;
      }

      // Pass the mode (primer or probe) to the importExcelFile function
      const importedData = await importExcelFile(file,userProfile?.id, mode);
      console.log("mwsASas",mode)

      // Check if importedData is an array or contains an array property
      const productsArray = Array.isArray(importedData)
        ? importedData
        : importedData?.products || []; // Adjust this based on your importExcel.js structure

      if (!Array.isArray(productsArray)) {
        toast.error("Invalid data format in imported file.");
        return;
      }

      // Ensure totalPrice defaults to 0 if not defined
      const updatedProducts = productsArray.map((product) => ({
        ...product,
        totalPrice:
          typeof product.totalPrice === "number" ? product.totalPrice : 0, // Default to 0
      }));

      setProducts((prev) => [...prev, ...updatedProducts]);

      toast.success(
        `${updatedProducts.length} products imported successfully.`
      );
      setTimeout(() => {
        navigate(`/user/${urlUsername}/order`);
      }, 3000);
    } catch (error) {
      toast.error("Error importing file.");
      console.error(error);
    }
  };

// ✅ Function to download **Primer** Template
const handleDownloadPrimer = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/excel/primer-template", {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch Primer template");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Primer_Template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Primer template downloaded successfully!");
  } catch (error) {
    console.error("❌ Error downloading Primer template:", error);
    toast.error("Failed to download Primer template.");
  }
};

// ✅ Function to download **Probe** Template
const handleDownloadProbe = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/excel/probe-template", {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch Probe template");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Probe_Template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Probe template downloaded successfully!");
  } catch (error) {
    console.error("❌ Error downloading Probe template:", error);
    toast.error("Failed to download Probe template.");
  }
};

 // ✅ Function to download **Primer** Template
const handleDownloadPrimerTemplate = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/excel/primer-template", {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch Primer template");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Primer_Template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Primer template downloaded successfully!");
  } catch (error) {
    console.error("❌ Error downloading Primer template:", error);
    toast.error("Failed to download Primer template.");
  }
};



// ✅ Add buttons in UI

  
  
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Add Product</h2>
      

      {/* Mode Selection Buttons */}
      <div className={styles.modeSelection}>
        <button
          type="button"
          onClick={() => setMode("primer")}
          className={`${styles.button} ${
            mode === "primer" ? styles.activeButton : ""
          }`}
        >
          Primer
        </button>
        <button
          type="button"
          onClick={() => setMode("probe")}
          className={`${styles.button} ${
            mode === "probe" ? styles.activeButton : ""
          }`}
        >
          Probe
        </button>
      </div>
          
      {/* Download Template Button */}
      <div className={styles.modeSelection2} >
        <button
          type="button"
          onClick={handleDownloadPrimer}
          className={`${styles.button} `}
        >
          Primer Temlate
        </button>
        <button
          type="button"
          onClick={handleDownloadProbe}
          className={`${styles.button}`}
        >
          Probe Template
        </button>
      </div>

      {/* Import Excel Section */}
      <div className={styles.importSection}>
        <label htmlFor="fileInput" className={styles.fileInputLabel}>
          Choose Excel File:
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <button
          type="button"
          onClick={handleImportExcel}
          disabled={!file}
          className={styles.importButton}
        >
          Import Excel
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Choose Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="prime">Prime</option>
              <option value="prop">Prop</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="numberOfProducts" className={styles.label}>
              Number of Products:
            </label>
            <input
              id="numberOfProducts"
              type="number"
              min="1"
              value={numberOfProducts}
              onChange={(e) => setNumberOfProducts(Number(e.target.value))}
              className={styles.input}
            />
          </div>
          <div className={styles.orderSection}>
            <label htmlFor="numberOfProducts" className={styles.label}>
              Add Product(s):
            </label>
            <button
              type="button"
              onClick={handleAddProduct}
              className={styles.addButton}
            >
              Add Product(s)
            </button>
          </div>
        </div>
        <div className={styles.formRow}>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={products.every((p) => !p.selected)}
          >
            Submit
          </button>
          <div className={styles.totalPrice}>
            Total Price: {totalPrice.toFixed(2)} €
          </div>
        </div>

        <div className={styles.productList}>
          {products.map((product, index) => (
            <ProductComponent
              key={product.id}
              index={index}
              category={product.category}
              productData={product}
              onRemove={handleRemoveProduct}
              onUpdate={handleProductUpdate}
            />
          ))}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;

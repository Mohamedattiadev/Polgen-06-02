import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import MailIcon from "@mui/icons-material/Mail";
import styles from "./AdminTables.module.css"; // Import the CSS module

import {
  Table,
  TableBody,
  TableCell,
  Select,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  Box,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Checkbox,
  TextField,
} from "@mui/material";
import EditInfo from "../EditInfo/EditInfo";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  addProduct,
} from "../../../../api/product";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ShowUserInfo from "../ShowUserInfo/ShowUserInfo";
import AreYouSureMsg from "../../AreYouSureMessg/AreYouSureMessg";
import { getUserById } from "../../../../api/auth";
import AdminSendingMail from "../AdminSendingMail/AdminSendingMail";
import { WidthFull } from "@mui/icons-material";
import AdminControlGrouptables from "../AdminControlGrouptables/AdminControlGrouptables";

// const nosearch = false;
const AdminTables = ({ filterCondition, AdminPageName }) => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("category");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const [addData, setAddData] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showControlGroup, setShowControlGroup] = useState(false);
  const [groupNumber, setGroupNumber] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("groupData"));
    const today = new Date().toDateString();

    if (savedData && savedData.date === today) {
      return savedData.groupNumber;
    }
    return 0; // Reset if it's a new day
  });

  // Get today's date in YYMMDD format
  const [day, setDay] = useState(() => {
    const today = new Date();
    return today
      .toISOString()
      .slice(2, 10) // Extract "YY-MM-DD"
      .replace(/-/g, ""); // Convert to "YYMMDD"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        console.log("Fetched data:", data);

        // Remove duplicates based on a unique identifier (e.g., `id`)
        const uniqueRows = data.filter(
          (row, index, self) =>
            index === self.findIndex((r) => r.id === row.id),
        );

        setRows(uniqueRows);
        setFilteredData(uniqueRows);
      } catch (error) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const savedSelectedProducts = localStorage.getItem("selectedProducts");
  //   if (savedSelectedProducts) {
  //     setSelectedProducts(JSON.parse(savedSelectedProducts));
  //   }
  // }, []);
  // Debugging: Log groupNumber whenever it changes
  // Update local storage whenever groupNumber changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(
      "groupData",
      JSON.stringify({ groupNumber, date: today }),
    );
  }, [groupNumber]);

  // Debugging: Log groupNumber whenever it changes
  useEffect(() => {
    console.log("groupNumber updated:", groupNumber);
  }, [groupNumber]);

  //----------------------------------------

  const handleAddProductFromControlGroup = async (newProduct) => {
    try {
      // Assign the current groupNumber to the new product
      const productWithGroupId = {
        ...newProduct,
        GroupId: groupNumber, // Assign the current groupNumber
      };

      // Check if the product already exists in the state
      if (!rows.some((row) => row.id === productWithGroupId.id)) {
        const updatedRows = [productWithGroupId, ...rows];
        setRows(updatedRows);
        setFilteredData(updatedRows);

        // Increment groupNumber for the next product
        // setGroupNumber((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };
  //----------------------------------------

  const counts = useMemo(() => {
    const totalProducts = rows.length;

    // Approved products: isApproved is true, and isWorkingOn and isFinished are false
    const approvedProducts = rows.filter(
      (row) => row.isApproved && !row.isWorkingOn && !row.isFinished,
    ).length;

    // Finished products: isFinished is true
    const finishedProducts = rows.filter((row) => row.isFinished).length;

    // In Progress products: isWorkingOn is true, and isFinished is false
    const inProgressProducts = rows.filter(
      (row) => row.isWorkingOn && !row.isFinished,
    ).length;

    // Check if the data contains `category` values of "prop" or "prime"
    const hasProp = rows.some((row) => row.category === "prop");
    const hasPrime = rows.some((row) => row.category === "prime");

    // Count products with `category` values of "prop" and "prime"
    const propProducts = hasProp
      ? rows.filter((row) => row.category === "prop").length
      : null;
    const primeProducts = hasPrime
      ? rows.filter((row) => row.category === "prime").length
      : null;

    return {
      totalProducts,
      approvedProducts,
      finishedProducts,
      inProgressProducts,
      hasProp,
      hasPrime,
      propProducts,
      primeProducts,
    };
  }, [rows]);

  const getStatusValue = (row) => {
    // Define the sort order for statuses
    if (row.isFinished) return 3; // Finished
    if (row.isApproved) return 2; // Approved
    if (row.isWorkingOn) return 1; // In Progress
    return 0; // Ordered (Lowest priority)
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const handleEmail = (row) => {
    console.log(row.userId);
    setShowMail(true);

    getUserById(row.userId).then((res) => {
      console.log(res);
      setAddData(res.user);
    });
  };

  const filteredRows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let result = rows.filter((row) => {
      const status = row.isFinished
        ? "Finished"
        : row.isWorkingOn
          ? "In Progress"
          : row.isApproved
            ? "Approved"
            : "Ordered";

      switch (searchField) {
        case "category":
          return row.category?.toLowerCase().includes(query);
        case "oligoAdi":
          return row.oligoAdi?.toLowerCase().includes(query);
        case "userId":
          return row.userId?.toLowerCase().includes(query);
        case "scale":
          return row.scale?.toLowerCase().includes(query);
        case "fivePrime":
          return row.modifications?.fivePrime?.toLowerCase().includes(query);
        case "threePrime":
          return row.modifications?.threePrime?.toLowerCase().includes(query);
        case "sekans":
          return row.sekans?.toLowerCase().includes(query);
        case "uzunluk":
          return row.uzunluk?.toString().toLowerCase().includes(query);
        case "saflaştırma":
          return row.saflaştırma?.toLowerCase().includes(query);
        case "totalPrice":
          return row.totalPrice?.toString().toLowerCase().includes(query);
        case "status":
          return status.toLowerCase().includes(query);
        default:
          return true;
      }
    });

    // Apply additional filtering from the `filterCondition` prop if provided
    if (filterCondition) {
      result = result.filter(filterCondition);
    }

    return result;
  }, [rows, searchQuery, searchField, filterCondition]);

  const getProgress = (row) => {
    if (row.isFinished) return 100;
    if (row.isWorkingOn) return 80;
    if (row.isApproved) return 50;
    if (row.isOrder) return 25;
    return 0;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleAdminShowMail = () => {
    setShowMail(true);
  };
  const handleEditProduct = (product) => {
    if (!product.id) {
      console.error("Product ID is missing:", product);
      return;
    }
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete);
      setRows(rows.filter((row) => row.id !== productToDelete));
      setFilteredData(filteredRows.filter((row) => row.id !== productToDelete));
      setShowDeleteModal(false); // Close the modal after deletion
      setProductToDelete(null); // Clear the selected product
    } catch (error) {
      setError("Failed to delete the product. Please try again.");
    }
  };

  const handleApproveProduct = async (id) => {
    setProcessing((prev) => [...prev, id]); // Set the product as "processing"
    try {
      await updateProduct(id, { isApproved: true }); // Update the product's isApproved field
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, isApproved: true } : row,
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);
    } catch (error) {
      setError("Failed to approve the product. Please try again.");
    } finally {
      setProcessing((prev) => prev.filter((pid) => pid !== id)); // Remove from "processing"
    }
  };

  // -----------------------------

  // const handleBulkIsWorkingOn = async () => {
  //   const bulkWorkingOnIds = selectedProducts.filter(
  //     (id) => !rows.find((row) => row.id === id)?.isWorkingOn,
  //   );
  //
  //   if (bulkWorkingOnIds.length === 0) {
  //     return;
  //   }
  //
  //   setProcessing((prev) => [...prev, ...bulkWorkingOnIds]);
  //
  //   try {
  //     // Send bulk approval request to the backend
  //     const response = await updateProduct("all", {
  //       productIds: bulkWorkingOnIds,
  //       isWorkingOn: true, // This is the status being updated
  //     });
  //
  //     // Update the UI with the backend response
  //     const updatedRows = rows.map((row) =>
  //       bulkWorkingOnIds.includes(row.id) ? { ...row, isWorkingOn: true } : row,
  //     );
  //     setRows(updatedRows);
  //     setFilteredData(updatedRows);
  //
  //     setSelectedProducts([]); // Clear selected products
  //   } catch (error) {
  //     setError("Failed to approve selected products. Please try again.");
  //   } finally {
  //     setProcessing((prev) =>
  //       prev.filter((id) => !bulkWorkingOnIds.includes(id)),
  //     );
  //   }
  // };
  //----------------------
  //----------------------
  //----------------------
  //----------------------

  const LOCAL_STORAGE_KEY = "currentIndex";

  // Helper function to get the current index from localStorage or default to 1
  const getCurrentIndex = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 1;
  };

  // Helper function to update the index in localStorage
  const updateCurrentIndex = (newIndex) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, newIndex.toString());
  };

  // Optionally, a function to reset the counter
  const resetCurrentIndex = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "1");
  };

  const handleBulkIsWorkingOn = async () => {
    // Filter selected products that are not already being worked on
    let selectedProductsToProcess = rows.filter(
      (row) => selectedProducts.includes(row.id) && !row.isWorkingOn,
    );

    if (selectedProductsToProcess.length === 0) {
      return; // No products to process
    }

    // Find the special product with isFromControlGroup === true
    const specialProduct = selectedProductsToProcess.find(
      (row) => row.isFromControlGroup,
    );

    // Remove the special product from the remaining products list
    selectedProductsToProcess = selectedProductsToProcess.filter(
      (row) => !row.isFromControlGroup,
    );

    // Retrieve the starting index from localStorage
    let currentIndex = getCurrentIndex();

    // Build the sortedProducts array. We assign the specialProduct an index of currentIndex first.
    const sortedProducts = [];

    if (specialProduct) {
      sortedProducts.push({ ...specialProduct, index: currentIndex });
      currentIndex++; // Increment after using it
    }

    // For the remaining products, assign consecutive indexes.
    selectedProductsToProcess.forEach((row) => {
      sortedProducts.push({ ...row, index: currentIndex });
      currentIndex++;
    });

    // Save the updated currentIndex back to localStorage for future operations
    updateCurrentIndex(currentIndex);

    // Extract product IDs to update
    const bulkWorkingOnIds = sortedProducts.map((row) => row.id);

    if (bulkWorkingOnIds.length === 0) return;

    // Update processing state
    setProcessing((prev) => [...prev, ...bulkWorkingOnIds]);

    try {
      console.log("Current groupNumber before processing:", groupNumber);

      // Generate GroupId and update rows with the assigned indexes
      const updatedProducts = rows.map((row) => {
        const foundProduct = sortedProducts.find((p) => p.id === row.id);
        if (foundProduct) {
          const groupId = `${day}-${groupNumber}`; // Unique GroupId
          console.log(`Assigning GroupId: ${groupId} to product ${row.id}`);
          return {
            ...row,
            isWorkingOn: true,
            index: foundProduct.index,
            GroupId: groupId,
          };
        }
        return row;
      });

      // Prepare the payload for backend
      const payload = {
        productIds: bulkWorkingOnIds,
        isWorkingOn: true,
        GroupId: groupNumber, // Send group number
      };

      console.log("Payload sent to backend:", payload);

      // Send bulk update request to the backend
      const response = await updateProduct("all", payload);
      console.log("Backend response:", response);

      // Update the UI state
      setRows(updatedProducts);

      // Increment the group number for the next batch
      setGroupNumber((prev) => {
        const newGroupNumber = prev + 1;
        console.log("Incremented groupNumber:", newGroupNumber);
        return newGroupNumber;
      });

      // Clear selected products
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Remove processed IDs from processing state
      setProcessing((prev) =>
        prev.filter((id) => !bulkWorkingOnIds.includes(id)),
      );
    }
  };

  //----------------------
  //----------------------
  //----------------------
const handleBulkApprove = async () => {
  console.log("Selected Products:", selectedProducts);
  console.log("Rows Before Approval:", rows);

  const bulkApproveIds = selectedProducts.filter((id) => {
    const product = rows.find((row) => row.id === id);
    console.log(`Checking product ${id}:`, product);

    if (!product) {
      console.warn(`Product ${id} not found.`);
      return false;
    }

    console.log(
      `Product ${id} - isApproved: ${product.isApproved}, isFinished: ${product.isFinished}`
    );

    const isEligible = !product.isFinished; // Allow approval even if already approved
    console.log(`Product ${id} eligible for approval:`, isEligible);
    return isEligible;
  });

  console.log("Bulk Approve IDs:", bulkApproveIds);

  if (bulkApproveIds.length === 0) {
    console.warn("No products to approve.");
    return;
  }

  setProcessing((prev) => [...prev, ...bulkApproveIds]);
  console.log("Processing products:", bulkApproveIds);

  try {
    const response = await updateProduct("all", {
      productIds: bulkApproveIds,
      isApproved: true,
    });

    console.log("Backend response:", response);

    const updatedRows = rows.map((row) =>
      bulkApproveIds.includes(row.id) ? { ...row, isApproved: true } : row
    );

    console.log("Updated Rows:", updatedRows);
    setRows(updatedRows);
    setFilteredData(updatedRows);
    setSelectedProducts([]);

  } catch (error) {
    console.error("Error updating products:", error);
    setError("Failed to approve selected products. Please try again.");
  } finally {
    setProcessing((prev) =>
      prev.filter((id) => !bulkApproveIds.includes(id))
    );
    console.log("Processing state after completion:", processing);
  }
};



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedProducts.map((id) => deleteProduct(id)));
      const updatedRows = rows.filter(
        (row) => !selectedProducts.includes(row.id),
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);
    } catch (error) {
      setError("Failed to delete selected products. Please try again.");
    } finally {
      setSelectedProducts([]); // Clear selections after action
      setShowBulkDeleteModal(false); // Close the confirmation modal
    }
  };

  const handleNextStatus = async (id, currentStatus) => {
    setProcessing((prev) => [...prev, id]); // Mark as processing

    let updatedFields = {};

    // Determine the next state based on currentStatus
    if (!currentStatus.isApproved) {
      updatedFields = {
        isApproved: true,
        isWorkingOn: false,
        isFinished: false,
      };
    } else if (!currentStatus.isWorkingOn) {
      updatedFields = { isWorkingOn: true, isFinished: false };
    } else if (!currentStatus.isFinished) {
      updatedFields = { isFinished: true };
    } else {
      // If already finished, stop further transitions
      setProcessing((prev) => prev.filter((pid) => pid !== id));
      return;
    }

    try {
      // Update product status in the backend
      await updateProduct(id, updatedFields);

      // Reflect changes in UI
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, ...updatedFields } : row,
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);
    } catch (error) {
      setError("Failed to update product status. Please try again.");
    } finally {
      // Mark processing complete
      setProcessing((prev) => prev.filter((pid) => pid !== id));
    }
  };

  {
    /*
 -----------------------------------
  */
  }

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id];

      // Save selected products to local storage
      localStorage.setItem("selectedProducts", JSON.stringify(newSelected));
      return newSelected;
    });
  };

  const sortRows = (rows, order, orderBy) => {
    const sortedRows = [...rows];

    return sortedRows.sort((a, b) => {
      // Always place Control Group products at the top
      if (a.isFromControlGroup && !b.isFromControlGroup) return -1;
      if (!a.isFromControlGroup && b.isFromControlGroup) return 1;

      // Apply the existing sorting logic for other columns
      if (orderBy === "createdAt") {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else if (orderBy === "status") {
        const statusA = getStatusValue(a);
        const statusB = getStatusValue(b);
        return order === "asc" ? statusA - statusB : statusB - statusA;
      } else if (orderBy === "GroupId") {
        return order === "asc"
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      } else if (typeof a[orderBy] === "string") {
        return order === "asc"
          ? a[orderBy].localeCompare(b[orderBy])
          : b[orderBy].localeCompare(a[orderBy]);
      } else if (typeof a[orderBy] === "number") {
        return order === "asc"
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      }
      return 0; // fallback if the column is not handled
    });
  };
  const visibleRows = useMemo(() => {
    const sortedData = sortRows(filteredRows, order, orderBy);
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredRows, order, orderBy, page, rowsPerPage]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Loading products...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        padding: "20px",
        backgroundColor: "var(--secondary-bg-color)",
        color: "var(--primary-text-color)",
        marginTop: "20px",
      }}
    >
      <Box className={styles.counterBox}>
        <Box sx={{ display: "flex", flexDirection: "colum", gap: 2 }}>
          <Typography variant="subtitle1" className={styles.counterTitle}>
            Product Counts
          </Typography>
          <Typography variant="body2" className={styles.counterText}>
            <strong>Total Products:</strong> {counts.totalProducts}
          </Typography>
          <Typography variant="body2" className={styles.counterText}>
            <strong>Approved:</strong> {counts.approvedProducts}
          </Typography>
          <Typography variant="body2" className={styles.counterText}>
            <strong>In Progress:</strong> {counts.inProgressProducts}
          </Typography>
          <Typography variant="body2" className={styles.counterText}>
            <strong>Finished:</strong> {counts.finishedProducts}
          </Typography>
        </Box>
        {/* Conditionally render prop count if it exists */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "colum",
            paddingLeft: 16.5,
            gap: 2,
          }}
        >
          {counts.hasProp && (
            <Typography variant="body2" className={styles.counterText}>
              <strong>Prop:</strong> {counts.propProducts}
            </Typography>
          )}

          {/* Conditionally render prime count if it exists */}
          {counts.hasPrime && (
            <Typography variant="body2" className={styles.counterText}>
              <strong>Prime:</strong> {counts.primeProducts}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {AdminPageName || "Admin Products"}
          </Typography>
        </div>

        {/* Conditionally render for AdminApprovedOrders */}
        {AdminPageName === "AdminApprovedOrders" && (
          <Box
            sx={{
              display: "flex",
              marginLeft: "auto",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleBulkIsWorkingOn}
                className={styles["table-bulk-approve"]}
                disabled={selectedProducts.length === 0}
              >
                Synthing All
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowControlGroup(true)}
                className={styles["table-bulk-approve"]}
                disabled={selectedProducts.length === 0}
              >
                Control Group
              </Button>
            </Box>
          </Box>
        )}

        {/* Conditionally render for Orders or AdminApprovingOrders */}
     {(AdminPageName === "Orders" ||
  AdminPageName === "AdminApprovingOrders" ||
  AdminPageName === "AdminApprovedOrders") && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box sx={{ color: "var(--primary-text-color)" }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          marginRight: 2,
          width: 300,
        }}
        InputProps={{
          sx: {
            backgroundColor: "var(--primary-bg-color)",
            color: "var(--primary-text-color)",
          },
        }}
        InputLabelProps={{
          sx: {
            color: "var(--primary-text-color)",
          },
        }}

      />
        {AdminPageName !== "AdminApprovedOrders" ? ( 
      <Select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        size="medium"
        sx={{
          color: "var(--primary-text-color)",
          marginRight: 2,
          width: 200,
        }}
      >

        {/* Conditionally render for AdminApprovedOrders */}
       
        <MenuItem value="category">Category</MenuItem>
        <MenuItem value="oligoAdi">Oligo Name</MenuItem>
        <MenuItem value="userId">User ID</MenuItem>
        <MenuItem value="scale">Scale</MenuItem>
        <MenuItem value="fivePrime">5' Modification</MenuItem>
        <MenuItem value="threePrime">3' Modification</MenuItem>
        <MenuItem value="sekans">Sequence</MenuItem>
        <MenuItem value="uzunluk">Length</MenuItem>
        <MenuItem value="saflaştırma">Purification</MenuItem>
        <MenuItem value="totalPrice">Total Price</MenuItem>
        <MenuItem value="status">Status</MenuItem>
      </Select>
        ):(


      <Select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        size="medium"
        sx={{
          color: "var(--primary-text-color)",
          marginRight: 2,
          width: 200,
        }}
      >

        {/* Conditionally render for AdminApprovedOrders */}
       
        <MenuItem value="scale">Scale</MenuItem>
        <MenuItem value="uzunluk">Length</MenuItem>
        <MenuItem value="saflaştırma">Purification</MenuItem>
      </Select>
        )}
    </Box>

    {(AdminPageName === "Orders" || AdminPageName === "AdminApprovingOrders") && (
      <>
        <div>
          <Button
            variant="contained"
            onClick={handleBulkApprove}
            className={styles["table-bulk-approve"]}
            disabled={selectedProducts.length === 0}
          >
            Approve All
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            className={styles["table-bulk-delete"]}
            onClick={() => setShowBulkDeleteModal(true)}
            disabled={selectedProducts.length === 0}
          >
            Delete All
          </Button>
        </div>
      </>
    )}
  </Box>
)}

      </Box>
      <Table
        sx={{
          backgroundcolor: "var(--primary-bg-color)",
          color: "var(--primary-text-color)",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={
                  selectedProducts.length > 0 &&
                  selectedProducts.length === filteredRows.length
                }
                indeterminate={
                  selectedProducts.length > 0 &&
                  selectedProducts.length < filteredRows.length
                } // Show partial state
                onChange={(e) =>
                  setSelectedProducts(
                    e.target.checked ? filteredRows.map((row) => row.id) : [],
                  )
                }
              />
            </TableCell>
    
            {AdminPageName === "AdminSynthingOrders" ? (
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  textWrap: "nowrap",
                }}
              >
                <TableSortLabel
                  active={orderBy === "GroupId"}
                  direction={orderBy === "GroupId" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "GroupId")}
                />
                GroupID
              </TableCell>
            ) : (
              " "
            )}
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "createdAt"}
                direction={orderBy === "createdAt" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "createdAt")}
              />
              createdAt
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
                paddingX: "20",
              }}
            >
              UserId
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "category"}
                direction={orderBy === "category" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "category")}
              />
              Category
            </TableCell>
            <TableCell
              sx={{
                textAlign: "center", // Center align the data
                color: "var(--primary-text-color)",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "totalPrice"}
                direction={orderBy === "totalPrice" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "totalPrice")}
              />
              Total Price
            </TableCell>
            <TableCell
              sx={{
                textAlign: "start", // Center align the data
                color: "var(--primary-text-color)",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "status")}
              />
              Status
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
                padding: 4,
              }}
            >
              Progress
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
                padding: 4,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            backgroundcolor: "var(--primary-bg-color)",
          }}
        >
          {visibleRows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: row.isFromControlGroup
                  ? "var(--control-group-bg-color)" // Use a custom CSS variable for the background color
                  : row.sekans && row.sekans.length >= 50
                    ? "var(--error-color)"
                    : "inherit",
              }}
            >
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
              >
                <Checkbox
                  checked={selectedProducts.includes(row.id)} // Check if the product is selected
                  onChange={() => handleCheckboxChange(row.id)} // Allow selection/deselection
                />
              </TableCell>{" "}
              
              {AdminPageName === "AdminSynthingOrders" ? (
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center", // Center align the data
                    paddingLeft: 5,
                  }}
                >
                  {`${day}`}
                  {"-"}
                  {row.GroupId || "N/A"}
                </TableCell>
              ) : (
                " "
              )}
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  paddingLeft: 5,
                }}
              >
                {new Date(row.createdAt)
                  .toLocaleString("en-CA", {
                    dateStyle: "short",
                    timeStyle: "short",
                    hour12: false, // Use 24-hour format
                  })
                  .replace(",", "")}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center", // Center align the data
                  fontWeight: "Bold",
                  padding: "50",
                }}
              >
                <Button
                  sx={{
                    color:
                      row.sekans && row.sekans.length >= 50
                        ? "var(--primary-bg-color)"
                        : "var(--error-color)",
                    padding: "11px 27px",
                  }}
                  onClick={() => setSelectedUser(row.userId)}
                  className={styles.userId} // Apply the userId class
                >
                  {row.userId ? row.userId.split("-")[0] : "Unknown"}
                </Button>
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  paddingLeft: 5,
                }}
              >
                {row.category}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.totalPrice || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "start", // Center align the data
                  paddingLeft: 4.5,
                }}
              >
                {row.isFinished
                  ? "Finished"
                  : row.isWorkingOn
                    ? "In Progress"
                    : row.isApproved
                      ? "Approved"
                      : "Ordered"}
              </TableCell>
              <TableCell
                sx={{
                  padding: 4,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={getProgress(row)}
                  sx={{
                    backgroundColor: "var(--disabled-bg-color)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "var(--accent-color)",
                    },
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  display: "grid", // Use grid layout
                  gridTemplateColumns: "1fr 1fr", // 2 columns
                  gridTemplateRows: "1fr 1fr", // 2 rows
                  gap: "6px", // Add spacing between icons
                  paddingLeft: 7,
                  borderRadius: "0", // No border radius
                }}
              >
                {/* Show only the delete button for Control Group products */}
                {row.isFromControlGroup ? (
                  <>
                    <IconButton
                      onClick={() => {
                        setProductToDelete(row.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                    {/* <IconButton onClick={() => handleEditProduct(row)}>
                      <EditIcon />
                    </IconButton> */}
                  </>
                ) : (
                  <>
                    {/* Show all buttons for non-Control Group products */}
                    <IconButton
                      onClick={() =>
                        handleNextStatus(row.id, {
                          isApproved: row.isApproved,
                          isWorkingOn: row.isWorkingOn,
                          isFinished: row.isFinished,
                        })
                      }
                      disabled={processing.includes(row.id) || row.isFinished} // Disable if processing OR finished
                    >
                      {processing.includes(row.id) ? (
                        <HourglassBottomIcon />
                      ) : row.isFinished ? (
                        <CheckCircleIcon color="success" />
                      ) : row.isWorkingOn ? (
                        <CheckCircleIcon color="warning" />
                      ) : row.isApproved ? (
                        <CheckCircleIcon color="primary" />
                      ) : (
                        <CheckCircleIcon color="disabled" />
                      )}
                    </IconButton>
                    <IconButton onClick={() => handleEditProduct(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setProductToDelete(row.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton onClick={() => handleEmail(row)}>
                      <MailIcon color="primary" />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedUser && (
        <ShowUserInfo
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {showDeleteModal && (
        <AreYouSureMsg
          onConfirm={confirmDeleteProduct}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          message="Are you sure you want to delete this selected one?"
        />
      )}
      {showBulkDeleteModal && (
        <AreYouSureMsg
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteModal(false)}
          message="Are you sure you want to delete all?"
        />
      )}
      {showMail && (
        <AdminSendingMail data={addData} onClose={() => setShowMail(false)} />
      )}

      {showControlGroup && (
        <AdminControlGrouptables
          onClose={() => setShowControlGroup(false)}
          onAddProduct={handleAddProductFromControlGroup}
        />
      )}
      {showEditModal && (
        <EditInfo
          product={productToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedProduct) => {
            const updatedRows = rows.map((row) =>
              row.id === updatedProduct.id ? updatedProduct : row,
            );
            setRows(updatedRows);
            setFilteredData(updatedRows);
            setShowEditModal(false);
          }}
        />
      )}
    </TableContainer>
  );
};

export default AdminTables;
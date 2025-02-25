import React, { useState, useRef, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import MailIcon from "@mui/icons-material/Mail";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
  getGroupById,
} from "../../../../api/product";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ShowUserInfo from "../ShowUserInfo/ShowUserInfo";
import AreYouSureMsg from "../../AreYouSureMessg/AreYouSureMessg";
import { getUserById } from "../../../../api/auth";
import AdminSendingMail from "../AdminSendingMail/AdminSendingMail";
import { KeyboardArrowDown, WidthFull } from "@mui/icons-material";
import styles from "./AdminDuringProcessTables.module.css"; // Import the CSS module
import CollapsibleRow from "../CollapsibleRow/CollapsibleRow";

const AdminDuringProcessTables = ({
  filterCondition,
  groupId,
  AdminPageName,
}) => {
  const [rows, setRows] = useState([]);
  const [showA260Input, setShowA260Input] = useState(false); // Show/hide modal
  const [a260Input, setA260Input] = useState(""); // Store input values

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
  const [groupNumber, setGroupNumber] = useState(() => {
    const savedGroupNumber = localStorage.getItem("groupNumber");
    return savedGroupNumber ? parseInt(savedGroupNumber, 10) : 1;
  });

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const data = await getGroupById(groupId);
        setRows(data);
      } catch (err) {
        setError("Failed to load group data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  useEffect(() => {
    localStorage.setItem("groupNumber", groupNumber);
  }, [groupNumber]);

  useEffect(() => {
    console.log("groupNumber updated:", groupNumber);
  }, [groupNumber]);

  const getStatusValue = (row) => {
    if (row.isFinished) return 3;
    if (row.isApproved) return 2;
    if (row.isWorkingOn) return 1;
    return 0;
  };

  const handleGenerateExcel = async () => {
  try {
    console.log("Products to export:", filteredRows); // Debug: Verify data sent to backend

    const products = filteredRows; // Ensure this contains the listed products

    // Call the backend API to generate and download the Excel file
    const response = await axios.post(
      "http://localhost:5000/api/report/generate-excel", // Backend endpoint
      { products }, // Send the product list in the request body
      { responseType: "blob" }, // Important for file downloads
    );

    // Debug: Check if response contains data
    console.log("Response from backend:", response);

    // Create a blob link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products_report.xlsx"); // Dynamic file name
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error downloading Excel file:", error);

    // Display error details to user
    if (error.response) {
      console.error("Backend error response:", error.response.data);
      alert(`Failed to download Excel file: ${error.response.data.message}`);
    } else {
      alert("Failed to download Excel file. Please try again.");
    }
  }
};


  const handleA260Submit = async () => {
    console.log("✅ A260 Button Clicked", a260Input);

    const values = a260Input.split(",").map((val) => parseFloat(val.trim()));

    if (values.length !== rows.length) {
      alert("The number of A260 values must match the number of products.");
      return;
    }

    try {
      const updatedProducts = rows.map((product, index) => ({
        id: Number(product.id), // ✅ Ensure ID is sent as a number
        a260: values[index],
      }));

      console.log("🚀 Sending A260 update:", updatedProducts);

      const response = await axios.put(
        "http://localhost:5000/api/products/update-a260",
        { updatedProducts },
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("✅ Server Response:", response);

      if (response.status === 200) {
        setRows(response.data.updatedProducts);
        alert("A260 values updated successfully!");
      }
    } catch (error) {
      console.error(
        "❌ Error updating A260 values:",
        error.response?.data || error,
      );
      alert("Failed to update A260 values. Please try again.");
    }

    setA260Input("");
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
        case "a260":
          return row.a260?.toString().toLowerCase().includes(query);
        case "Tm(C)":
          return row.tm?.toString().toLowerCase().includes(query);
        case "GC%":
          return row.gcPercent?.toString().toLowerCase().includes(query);
        case "BP":
          return row.uzunluk?.toString().toLowerCase().includes(query);
        case "MW":
          return row.mw?.toString().toLowerCase().includes(query);
        case "Ex.Coeff":
          return row.extinctionCoefficient
            ?.toString()
            .toLowerCase()
            .includes(query);
        case "Conc":
          return row.concentration?.toString().toLowerCase().includes(query);
        case "Totalng":
          return row.totalNg?.toString().toLowerCase().includes(query);
        case "OD":
          return row.od?.toString().toLowerCase().includes(query);
        case "Total nmol":
          return row.totalNmol?.toString().toLowerCase().includes(query);
        case "100Stok":
          return row.stok100M?.toString().toLowerCase().includes(query);
        case "50Stok":
          return row.stok50M?.toString().toLowerCase().includes(query);

        default:
          return true;
      }
    });

    if (filterCondition) {
      result = result.filter(filterCondition);
    }

    return result; // Removed the uniqueRows logic
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
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      setError("Failed to delete the product. Please try again.");
    }
  };

  const handleCancelSynthesis = async () => {
    try {
      if (!filteredRows || filteredRows.length === 0) {
        alert("No products selected for cancellation.");
        return;
      }

      const products = filteredRows.map((product) => ({
        id: product.id,
      }));

      console.log("🚀 Sending products for cancellation:", products);

      const response = await axios.post(
        "http://localhost:5000/api/products/cancel-synthesis",
        { products }, // ✅ Ensure products array is wrapped in an object
        { headers: { "Content-Type": "application/json" } }, // ✅ Set JSON headers
      );

      console.log("✅ Response from server:", response.data);
      alert("Synthesis cancelled successfully!");
    } catch (error) {
      console.error(
        "❌ Error cancelling synthesis:",
        error.response?.data || error,
      );
      alert("Failed to cancel synthesis. Please try again.");
    }
  };

  const handleRetryGuarantee = async () => {
    try {
      if (!selectedProducts || selectedProducts.length === 0) {
        alert("No products selected for retry guarantee.");
        return;
      }

      const products = selectedProducts.map((productId) => ({
        id: productId,
      }));

      console.log("🚀 Sending products for retry guarantee:", products);

      const response = await axios.post(
        "http://localhost:5000/api/products/retry-guarantee",
        { products }, // ✅ Ensure products are wrapped in an object
        { headers: { "Content-Type": "application/json" } }, // ✅ Set JSON headers
      );

      console.log("✅ Response from server:", response.data);
      alert("Retry guarantee applied successfully!");
    } catch (error) {
      console.error(
        "❌ Error applying retry guarantee:",
        error.response?.data || error,
      );
      alert("Failed to apply retry guarantee. Please try again.");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const products = filteredRows.map((product) => ({
        category: product.category, 
        modifications: product.modifications,
        sekans: product.sekans,
        dmt: product.dmt || "DMTOFF",
        index: product.index || "N/A",
        oligoAdi: product.oligoAdi || "Unnamed",
        userId: product.userId,
        GroupId: product.GroupId || "N/A",  
      }));
  
      console.log("📤 Sending products for CSV export:", products);
  
      const response = await axios.post(
        "http://localhost:5000/api/products/export/csv",
        { products },
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "filtered_products.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("❌ Error downloading CSV file:", error);
      alert("Failed to download CSV file. Please try again.");
    }
  };
 ///zpllllllllllllllllllllllll 
 const handleDownloadZPL = async () => {
  try {
      const products = filteredRows.map((product) => ({
          oligoAdi: product.oligoAdi,
          uzunluk: product.uzunluk,
          sekans: product.sekans,
          tm: product.tm,
          modifications: product.modifications,
          mw: product.mw,
          index: product.index || "N/A",
          GroupId: product.GroupId || "N/A", 
      }));

      console.log("📤 Sending products for ZPL export:", products);

      const response = await axios.post(
          "http://localhost:5000/api/products/generate-zpl",  // Keeping backend in the same file
          { products },
          { responseType: "blob" }  // Downloading file
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "etiket.zpl");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error("❌ Error downloading ZPL file:", error);
      alert("Failed to download ZPL file. Please try again.");
  }
};
const handleDownloadKutuEtiketi = async () => {
  try {
      const products = filteredRows.map((product) => ({
          userId: product.userId,  // Required for user separation
          GroupId: product.GroupId || "N/A",
          oligoAdi: product.oligoAdi || "N/A",
          index: product.index || "N/A",
      }));

      console.log("📤 Sending products for Kutu Etiketi export:", products);

      const response = await axios.post(
          "http://localhost:5000/api/products/generate-kutu-etiketi",  // API endpoint for Kutu Etiketi
          { products },
          { responseType: "blob" }  // Downloading file
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "kutu_etiketi.zpl");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  } catch (error) {
      console.error("❌ Error downloading Kutu Etiketi ZPL file:", error);
      alert("Failed to download Kutu Etiketi ZPL file. Please try again.");
  }
};

  

  const handleApproveProduct = async (id) => {
    setProcessing((prev) => [...prev, id]);
    try {
      await updateProduct(id, { isApproved: true });
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, isApproved: true } : row,
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);
    } catch (error) {
      setError("Failed to approve the product. Please try again.");
    } finally {
      setProcessing((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleBulkIsWorkingOn = async () => {
    const bulkWorkingOnIds = selectedProducts.filter(
      (id) => !rows.find((row) => row.id === id)?.isWorkingOn,
    );

    if (bulkWorkingOnIds.length === 0) {
      return;
    }

    setProcessing((prev) => [...prev, ...bulkWorkingOnIds]);

    try {
      console.log("Current groupNumber before processing:", groupNumber);

      const updatedProducts = rows.map((row) => {
        if (bulkWorkingOnIds.includes(row.id)) {
          if (typeof row.index !== "number") {
            console.error("Invalid row.index:", row.index);
            return row;
          }

          const groupId = `${row.index}-${groupNumber}`;
          console.log(`Assigning GroupId: ${groupId} to product ${row.id}`);
          return {
            ...row,
            isWorkingOn: true,
            GroupId: groupId,
          };
        }
        return row;
      });

      const payload = {
        productIds: bulkWorkingOnIds,
        isWorkingOn: true,
        GroupId: groupNumber,
      };

      console.log("Payload sent to backend:", payload);

      const response = await updateProduct("all", payload);

      console.log("Backend response:", response);

      setRows(updatedProducts);
      setFilteredData(updatedProducts);

      setGroupNumber((prev) => {
        const newGroupNumber = prev + 1;
        console.log("Incremented groupNumber:", newGroupNumber);
        return newGroupNumber;
      });

      setSelectedProducts([]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing((prev) =>
        prev.filter((id) => !bulkWorkingOnIds.includes(id)),
      );
    }
  };

  const handleBulkApprove = async () => {
    const bulkApproveIds = selectedProducts.filter(
      (id) => !rows.find((row) => row.id === id)?.isApproved,
    );

    if (bulkApproveIds.length === 0) {
      return;
    }

    setProcessing((prev) => [...prev, ...bulkApproveIds]);

    try {
      const response = await updateProduct("all", {
        productIds: bulkApproveIds,
        isApproved: true,
      });

      const updatedRows = rows.map((row) =>
        bulkApproveIds.includes(row.id) ? { ...row, isApproved: true } : row,
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);

      setSelectedProducts([]);
    } catch (error) {
      setError("Failed to approve selected products. Please try again.");
    } finally {
      setProcessing((prev) =>
        prev.filter((id) => !bulkApproveIds.includes(id)),
      );
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
      setSelectedProducts([]);
      setShowBulkDeleteModal(false);
    }
  };

  const handleNextStatus = async (id, currentStatus) => {
    setProcessing((prev) => [...prev, id]);

    let updatedFields = {};

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
      setProcessing((prev) => prev.filter((pid) => pid !== id));
      return;
    }

    try {
      await updateProduct(id, updatedFields);

      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, ...updatedFields } : row,
      );
      setRows(updatedRows);
      setFilteredData(updatedRows);
    } catch (error) {
      setError("Failed to update product status. Please try again.");
    } finally {
      setProcessing((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const sortRows = (rows, order, orderBy) => {
    const sortedRows = [...rows];

    return sortedRows.sort((a, b) => {
      if (orderBy === "createdAt") {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else if (orderBy === "status") {
        const statusA = getStatusValue(a);
        const statusB = getStatusValue(b);
        return order === "asc" ? statusA - statusB : statusB - statusA;
      } else if (orderBy === "GroupId") {
        const groupNumberA = parseInt(a.GroupId, 10) || 0;
        const groupNumberB = parseInt(b.GroupId, 10) || 0;
        if (order === "asc") {
          return groupNumberA - groupNumberB;
        } else {
          return groupNumberB - groupNumberA;
        }
      } else if (orderBy === "totalPrice") {
        const totalPriceA = parseFloat(a.totalPrice) || 0;
        const totalPriceB = parseFloat(b.totalPrice) || 0;
        return order === "asc"
          ? totalPriceA - totalPriceB
          : totalPriceB - totalPriceA;
      } else if (
        typeof a[orderBy] === "string" &&
        typeof b[orderBy] === "string"
      ) {
        return order === "asc"
          ? a[orderBy].localeCompare(b[orderBy])
          : b[orderBy].localeCompare(a[orderBy]);
      } else if (
        typeof a[orderBy] === "number" &&
        typeof b[orderBy] === "number"
      ) {
        return order === "asc"
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      } else {
        return 0;
      }
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
      <Box
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {/* {AdminPageName==="AdminSynthingOrders"&&{()} */}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>

{AdminPageName === "AdminFinishedOrders" ? (
  <>
      <Button
              variant="contained"
              onClick={handleDownloadZPL}
            >
              Tup Etiketi
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleDownloadKutuEtiketi}
            >
            Kutu Etiketi 
            </Button>
  </>
) : null}
{AdminPageName === "AdminSynthingOrders" ? (
  <>
    <Button variant="contained" onClick={handleGenerateExcel} color="success">
      Generate Excel
    </Button>

            <Button
              variant="contained"
              onClick={() => {
                console.log("A260 Button Clicked");
                setShowA260Input(true); // Toggle the modal
              }}
            >
              A260
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleCancelSynthesis}
            >
              İptal Sentez
            </Button>

            <Button
              variant="contained"
              color="info"
              onClick={handleRetryGuarantee}
            >
              Garanti Tekrar
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadCSV}
              sx={{ marginLeft: "10px" }} // Add some spacing
            >
              Download CSV
            </Button>
</>

) : null}
            {AdminPageName === "AdminApprovedOrders" && (
              <Button
                variant="contained"
                onClick={handleBulkIsWorkingOn}
                className={styles["table-bulk-approve"]}
                disabled={selectedProducts.length === 0}
              >
                Synthing All
              </Button>
            )}

            {AdminPageName === "Orders" && (
              <>
                <Button
                  variant="contained"
                  onClick={handleBulkApprove}
                  className={styles["table-bulk-approve"]}
                  disabled={selectedProducts.length === 0}
                >
                  Approve All
                </Button>
                <Button
                  variant="contained"
                  className={styles["table-bulk-delete"]}
                  onClick={() => setShowBulkDeleteModal(true)}
                  disabled={selectedProducts.length === 0}
                >
                  Delete All
                </Button>
              </>
            )}
          </Box>
        </Box>
        {AdminPageName === "Orders" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                color: "var(--primary-text-color)",
              }}
            >
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
                <MenuItem value="DMT">DMT</MenuItem>
                <MenuItem value="a260">a260</MenuItem>
                <MenuItem value="TM(C)">TM(C)</MenuItem>
                <MenuItem value="GC%">GC%</MenuItem>
                <MenuItem value="BP">BP</MenuItem>
                <MenuItem value="MW">MW</MenuItem>
                <MenuItem value="EX.Coef">EX.Coef</MenuItem>
                <MenuItem value="CONC">CONC</MenuItem>
                <MenuItem value="TotalNg">Total Ng</MenuItem>
                <MenuItem value="OD">OD</MenuItem>
                <MenuItem value="TotalNmol">Total Nmol</MenuItem>
                <MenuItem value="100Stok">100Stok</MenuItem>
                <MenuItem value="50Stok">50Stok</MenuItem>
              </Select>
            </Box>
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
              <Checkbox disabled />
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "index"}
                direction={orderBy === "index" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "index")}
              />
              #
            </TableCell>

            {AdminPageName === "AdminSynthingOrders" ? (
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
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
                textAlign: "center",
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
                textAlign: "center",
                textWrap: "nowrap",
                paddingX: "20",
              }}
            >
              UserId
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
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
                textAlign: "center",
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
                textAlign: "start",
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
                textAlign: "center",
                textWrap: "nowrap",
                padding: 4,
              }}
            >
              Progress
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === ""}
                direction={orderBy === "DMT" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "DMT")}
              />
              DMT
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "a260"}
                direction={orderBy === "a260" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "a260")}
              />
              a260
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === ""}
                direction={orderBy === "Tm(C)" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Tm(C)")}
              />
              Tm(C)
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === ""}
                direction={orderBy === "Gc%" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Gc%")}
              />
              Gc%
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === ""}
                direction={orderBy === "BP" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "BP")}
              />
              BP
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "MW(g/mol)"}
                direction={orderBy === "MW(g/mol)" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "MW(g/mol)")}
              />
              MW(g/mol)
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "Ex.Coef"}
                direction={orderBy === "Ex.Coef" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Ex.Coef")}
              />
              Ex.Coef
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "Conc."}
                direction={orderBy === "Conc." ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Conc.")}
              />
              Conc.
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "Total ng"}
                direction={orderBy === "Total ng" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Total ng")}
              />
              Total ng
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "Od"}
                direction={orderBy === "Od" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Od")}
              />
              Od
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "Total nmol"}
                direction={orderBy === "Total nmol" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "Total nmol")}
              />
              Total nmol
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "100 stok"}
                direction={orderBy === "100 stok" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "100 stok")}
              />
              100 stok
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "50 stok"}
                direction={orderBy === "50 stok" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "50 stok")}
              />
              50 stok
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            backgroundcolor: "var(--primary-bg-color)",
            color: "var(--primary-text-color)",
          }}
        >
          {visibleRows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor:
                  row.sekans && row.sekans.length >= 50
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
                  checked={selectedProducts.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  paddingLeft: 5,
                }}
              >
                {row.index}
              </TableCell>
              {AdminPageName === "AdminSynthingOrders" ? (
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center", // Center align the data
                    paddingLeft: 5,
                  }}
                >
                  {row.index}
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
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.dmt || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.a260 || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.tm || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.gcPercent || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.uzunluk || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.mw || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.extinctionCoefficient || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.concentration || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.totalNg || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.od || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.stok100M || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.stok50M || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.totalNg || "N/A"}
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
      {showEditModal && (
        <EditInfo
          product={productToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedProduct) => {
            const updatedRows = rows.map((row) =>
              row.id === updatedProduct.id
                ? { ...row, ...updatedProduct, GroupId: row.GroupId }
                : row,
            );
            setRows(updatedRows);
            setFilteredData(updatedRows);
            setShowEditModal(false);
          }}
        />
      )}
      {showA260Input && (
        <div className={styles.modal}>
          <h3>Enter A260 Values</h3>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Enter comma-separated values"
            value={a260Input}
            onChange={(e) => setA260Input(e.target.value)}
            fullWidth
          />
          <div className={styles.modalButtons}>
            <Button
              className={`${styles.submitButton}`}
              onClick={handleA260Submit}
            >
              Submit
            </Button>
            <Button
              className={`${styles.cancelButton}`}
              onClick={() => setShowA260Input(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </TableContainer>
  );
};

export default AdminDuringProcessTables;

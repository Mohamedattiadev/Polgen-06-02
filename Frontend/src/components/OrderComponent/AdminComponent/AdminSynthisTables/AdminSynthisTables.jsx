import React, { useState, useRef, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import MailIcon from "@mui/icons-material/Mail";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminShowGroupInfo from "../AdminShowGroupInfo/AdminShowGroupInfo";
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
} from "../../../../api/product";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ShowUserInfo from "../ShowUserInfo/ShowUserInfo";
import AreYouSureMsg from "../../AreYouSureMessg/AreYouSureMessg";
import { getUserById } from "../../../../api/auth";
import AdminSendingMail from "../AdminSendingMail/AdminSendingMail";
import { KeyboardArrowDown, WidthFull } from "@mui/icons-material";
import styles from "./AdminSynthisTables.module.css"; // Import the CSS module
import CollapsibleRow from "../CollapsibleRow/CollapsibleRow";

const AdminSynthisTables = ({ filterCondition, AdminPageName }) => {
  const [rows, setRows] = useState([]);
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
  // const [groupNumber, setGroupNumber] = useState(() => {
  //   const savedData = JSON.parse(localStorage.getItem("groupData"));
  //   const today = new Date().toDateString();

  //   if (savedData && savedData.date === today) {
  //     return savedData.groupNumber;
  //   }
  //   return 0; // Reset if it's a new day
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        console.log("Fetched products:", data);

        const updatedRows = await Promise.all(
          data.map(async (product) => {
            console.log("Processing product:", product);

            if (!product.userId) {
              console.warn("Missing userId for product:", product);
              return { ...product, username: "Unknown" };
            }

            try {
              const user = await getUserById(product.userId);
              console.log(`User fetched for ID ${product.userId}:`, user);

              const username = user?.user?.username || "Unknown"; // Fix applied
              const modifiedUsername = product.oligoAdi?.startsWith("gt")
                ? `gt${username}`
                : username;

              console.log("Final username:", modifiedUsername);
              return { ...product, username: modifiedUsername };
            } catch (error) {
              console.error("Error fetching user:", error);
              return { ...product, username: "Unknown" };
            }
          }),
        );

        setRows(updatedRows);
        console.log("Updated rows:", updatedRows);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getProducts();
  //       setRows(data);
  //     } catch (error) {
  //       setError("Failed to load products. Please try again later.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const today = new Date().toDateString();
  //   localStorage.setItem(
  //     "groupData",
  //     JSON.stringify({ groupNumber, date: today }),
  //   );
  // }, [groupNumber]);

  // useEffect(() => {
  //   console.log("groupNumber updated:", groupNumber);
  // }, [groupNumber]);

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
    if (row.isFinished) return 3;
    if (row.isApproved) return 2;
    if (row.isWorkingOn) return 1;
    return 0;
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

    if (filterCondition) {
      result = result.filter(filterCondition);
    }

    const uniqueRows = result.filter((row, index, self) => {
      if (row.GroupId) {
        const firstIndex = self.findIndex((r) => r.GroupId === row.GroupId);
        return index === firstIndex;
      }
      return true;
    });

    return uniqueRows;
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

  // const handleApproveProduct = async (id) => {
  //   setProcessing((prev) => [...prev, id]);
  //   try {
  //     await updateProduct(id, { isApproved: true });
  //     const updatedRows = rows.map((row) =>
  //       row.id === id ? { ...row, isApproved: true } : row,
  //     );
  //     setRows(updatedRows);
  //     setFilteredData(updatedRows);
  //   } catch (error) {
  //     setError("Failed to approve the product. Please try again.");
  //   } finally {
  //     setProcessing((prev) => prev.filter((pid) => pid !== id));
  //   }
  // };

  const handleBulkIsWorkingOn = async () => {
    const bulkWorkingOnIds = selectedProducts.filter(
      (id) => !rows.find((row) => row.id === id)?.isWorkingOn,
    );

    if (bulkWorkingOnIds.length === 0) return;

    setProcessing((prev) => [...prev, ...bulkWorkingOnIds]);

    try {
      const updatedProducts = rows.map((row) =>
        bulkWorkingOnIds.includes(row.id) ? { ...row, isWorkingOn: true } : row,
      );

      await updateProduct("all", {
        productIds: bulkWorkingOnIds,
        isWorkingOn: true,
      });

      setRows(updatedProducts);
      setFilteredData(updatedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing((prev) =>
        prev.filter((id) => !bulkWorkingOnIds.includes(id)),
      );
    }
  };

  // const handleBulkApprove = async () => {
  //   const bulkApproveIds = selectedProducts.filter(
  //     (id) => !rows.find((row) => row.id === id)?.isApproved,
  //   );

  //   if (bulkApproveIds.length === 0) {
  //     return;
  //   }

  //   setProcessing((prev) => [...prev, ...bulkApproveIds]);

  //   try {
  //     const response = await updateProduct("all", {
  //       productIds: bulkApproveIds,
  //       isApproved: true,
  //     });

  //     const updatedRows = rows.map((row) =>
  //       bulkApproveIds.includes(row.id) ? { ...row, isApproved: true } : row,
  //     );
  //     setRows(updatedRows);
  //     setFilteredData(updatedRows);

  //     setSelectedProducts([]);
  //   } catch (error) {
  //     setError("Failed to approve selected products. Please try again.");
  //   } finally {
  //     setProcessing((prev) =>
  //       prev.filter((id) => !bulkApproveIds.includes(id)),
  //     );
  //   }
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const confirmBulkDelete = async () => {
  //   try {
  //     await Promise.all(selectedProducts.map((id) => deleteProduct(id)));
  //     const updatedRows = rows.filter(
  //       (row) => !selectedProducts.includes(row.id),
  //     );
  //     setRows(updatedRows);
  //     setFilteredData(updatedRows);
  //   } catch (error) {
  //     setError("Failed to delete selected products. Please try again.");
  //   } finally {
  //     setSelectedProducts([]);
  //     setShowBulkDeleteModal(false);
  //   }
  // };

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

    const uniqueOrderGroups = new Set();

    return sortedData
      .filter((row) => {
        const identifier = row.GroupId || row.orderno || row.id; // Use GroupId if exists, otherwise orderno
        if (uniqueOrderGroups.has(identifier)) return false; // Prevent duplicates
        uniqueOrderGroups.add(identifier);
        return true;
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
        {AdminPageName === "AdminApprovedOrders" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div>
              <Button
                variant="contained"
                onClick={handleBulkIsWorkingOn}
                className={styles["table-bulk-approve"]}
                disabled={selectedProducts.length === 0}
              >
                Synthing All
              </Button>
            </div>
          </Box>
        ) : (
          " "
        )}
        {AdminPageName === "Orders" ? (
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
              </Select>
            </Box>
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
          </Box>
        ) : (
          ""
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
              <KeyboardArrowDownIcon />
            </TableCell>
            <TableCell>
              <Checkbox disabled />
            </TableCell>
            {AdminPageName === "AdminMusteriOrders" && (
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                  textWrap: "nowrap",
                }}
              >
                <TableSortLabel
                  active={orderBy === "username"}
                  direction={orderBy === "username" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "index")}
                />
                username
              </TableCell>
            )}
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
              {AdminPageName === "AdminMusteriOrders" ? "OrderNO" : "#"}
            </TableCell>

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
                paddingLeft: 4,
              }}
            >
              Actions
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
            <CollapsibleRow
              sx={{
                backgroundColor: row.isFromControlGroup
                  ? "var(--control-group-bg-color)"
                  : row.sekans && row.sekans.length >= 50
                    ? "var(--error-color)"
                    : "inherit",
              }}
              key={row.id}
              row={{ ...row, username: row.username }} // Pass username
              rows={rows}
              setRows={setRows} // Pass setRows here
              handleCheckboxChange={handleCheckboxChange}
              selectedProducts={selectedProducts}
              handleEditProduct={handleEditProduct}
              setProductToDelete={setProductToDelete}
              setSelectedProducts={setSelectedProducts}
              setShowDeleteModal={setShowDeleteModal}
              handleEmail={handleEmail}
              handleNextStatus={handleNextStatus}
              processing={processing}
              setProcessing={setProcessing}
              setSelectedUser={setSelectedUser}
              AdminPageName={AdminPageName}
              updateProduct={updateProduct}
            />
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
    </TableContainer>
  );
};

export default AdminSynthisTables;

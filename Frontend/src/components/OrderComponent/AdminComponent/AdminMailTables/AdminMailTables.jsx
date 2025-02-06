// AdminMailTables.js
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  Box,
  Button,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { fetchUsers, approveUser, deleteUser } from "../../../../api/auth"; // Import deleteUser
import styles from "./AdminMailTables.module.css";
import AreYouSureMsg from "../../AreYouSureMessg/AreYouSureMessg";

const AdminMailTables = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [productToDelete, setProductToDelete] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [processing, setProcessing] = useState([]);
  const [searchField, setSearchField] = useState("email"); // Default search field

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        setRows(users);
      } catch (error) {
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleDeleteUser = async (id) => {
    setProcessing((prev) => [...prev, id]);

    try {
      await deleteUser(id); // Call the delete API
      const updatedRows = rows.filter((row) => row.id !== id); // Remove the deleted user from the state
      setRows(updatedRows);

      setShowDeleteModal(false); // Close the modal after deletion
      setProductToDelete(null); // Clear the selected product
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setProcessing((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setProcessing((prev) => [...prev, id]);

    try {
      await approveUser(id, newStatus);
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, isApprovedFromAdmin: newStatus } : row,
      );
      setRows(updatedRows);
    } catch (error) {
      setError("Failed to update approval status. Please try again.");
    } finally {
      setProcessing((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const filteredRows = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return rows.filter((row) => {
      switch (searchField) {
        case "id":
          return row.id.toLowerCase().includes(query);
        case "email":
          return row.email.toLowerCase().includes(query);
        case "status":
          // Convert the status to a string and check if it includes the query
          const status = row.isApprovedFromAdmin ? "approved" : "pending";
          const revokeStatus =
            row.isApprovedFromAdmin === false ? "revoke" : ""; // Add revoke status
          return status.includes(query) || revokeStatus.includes(query); // Include revoke in the filter
        default:
          return true; // Include all rows if the search field is not recognized
      }
    });
  }, [rows, searchQuery, searchField]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    return filteredRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredRows, page, rowsPerPage]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6">Loading users...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <Typography variant="h6" className={styles.title}>
          Admin User List
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            size="medium"
            sx={{
              backgroundColor: "var(--primary-bg-color)",
              color: "var(--primary-text-color)",
              width: 150,
            }}
          >
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
          <TextField
            className={styles.tableSearchInput}
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
        </Box>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          padding: "20px",
          backgroundColor: "var(--secondary-bg-color)",
          color: "var(--primary-text-color)",
          marginTop: "20px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow className={styles.tableRow}>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",

                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                Actions
              </TableCell>

              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center",
                }}
                className={styles.tableCellHead}
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id} className={styles.tableRow}>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center",
                  }}
                  className={styles.tableCell}
                >
                  {row.id.split("-")[0]}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center",
                  }}
                  className={styles.tableCell}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center",
                  }}
                  className={styles.tableCell}
                >
                  {row.username}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",

                    textAlign: "center",
                  }}
                  className={styles.tableCell}
                >
                  {row.isApprovedFromAdmin ? (
                    <CheckCircleIcon
                      fontSize="large"
                      className={`${styles.statusIcon} ${styles.approved}`}
                    />
                  ) : (
                    <CheckCircleIcon
                      fontSize="large"
                      className={`${styles.statusIcon} ${styles.pending}`}
                    />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center",
                  }}
                  className={styles.tableCell}
                >
                  <Button
                    className={`${styles.actionButton} ${
                      row.isApprovedFromAdmin
                        ? styles.revokeButton
                        : styles.approveButton
                    }`}
                    onClick={() =>
                      handleToggleApproval(row.id, row.isApprovedFromAdmin)
                    }
                    disabled={processing.includes(row.id)}
                  >
                    {processing.includes(row.id) ? (
                      <HourglassBottomIcon className={styles.loadingIcon} />
                    ) : row.isApprovedFromAdmin ? (
                      "Revoke"
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                    textAlign: "center",
                  }}
                >
                  <Button
                    className={styles.deleteButton}
                    onClick={() => {
                      setProductToDelete(row.id); // Set the user ID to delete
                      setShowDeleteModal(true); // Show the modal
                    }}
                    disabled={processing.includes(row.id)}
                    sx={{
                      color: "var(--primary-text-color)",
                    }}
                  >
                    {processing.includes(row.id) ? (
                      <HourglassBottomIcon className={styles.loadingIcon} />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          className={styles.tablePagination}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {showDeleteModal && (
          <AreYouSureMsg
            onConfirm={() => handleDeleteUser(productToDelete)} // Pass the ID to delete
            onCancel={() => {
              setShowDeleteModal(false); // Close the modal
              setProductToDelete(null); // Clear the selected user ID
            }}
            message="Are you sure you want to delete this selected one?"
          />
        )}
      </TableContainer>
    </div>
  );
};

export default AdminMailTables;

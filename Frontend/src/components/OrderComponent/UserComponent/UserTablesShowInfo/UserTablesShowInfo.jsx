import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  TableSortLabel,
  Box,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { getProducts } from "../../../../api/product"; // API function for fetching products

const UserTables = ({ userRole, userId }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const isSpecificUser = userRole === "user"; // User always requests their own products
          const data = await getProducts(userRole, userId, isSpecificUser);
          setRows(
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          );
          setFilteredRows(data);
        } else {
          setError("Invalid userId provided.");
        }
      } catch (error) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userRole]);
  // Reset page if it goes out of range
  useEffect(() => {
    if (page > Math.ceil(filteredRows.length / rowsPerPage) - 1) {
      setPage(0); // Reset to first page
    }
  }, [filteredRows, rowsPerPage, page]);

  const handleFilter = (category) => {
    setFilter(category);
    if (category === "all") {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((row) => row.category === category));
    }
    setAnchorEl(null);
  };

  const getStatusValue = (row) => {
    // Define the sort order for statuses
    if (row.isFinished) return 3; // Finished
    if (row.isApproved) return 2; // Approved
    if (row.isWorkingOn) return 1; // In Progress
    return 0; // Ordered (Lowest priority)
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  // Sorting rows based on a specific property
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Product List
        </Typography>
        <Button
          variant="outlined"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ textTransform: "none" }}
        >
          Filter: {filter}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleFilter("all")}>All</MenuItem>
          <MenuItem onClick={() => handleFilter("prime")}>Prime</MenuItem>
          <MenuItem onClick={() => handleFilter("prop")}>Prop</MenuItem>
        </Menu>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "index"} // or any other field you want to sort by
                direction={orderBy === "index" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "index")} // change property to the actual one
              />
              #
            </TableCell>
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
                color: "var(--primary-text-color)",

                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "oligoAdi"}
                direction={orderBy === "oligoAdi" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "oligoAdi")}
              />
              Oligo Name
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "sekans"}
                direction={orderBy === "sekans" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "sekans")}
              />
              sekans
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textAlign: "center", // Center align the data
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "uzunluk"}
                direction={orderBy === "uzunluk" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "uzunluk")}
              />
              uzunluk
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textWrap: "nowrap",
              }}
            >
              <TableSortLabel
                active={orderBy === "saflaştırma"}
                direction={orderBy === "saflaştırma" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "saflaştırma")}
              />
              saflaştırma
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
              }}
            >
              5' Modification
            </TableCell>
            <TableCell
              sx={{
                color: "var(--primary-text-color)",
              }}
            >
              3' Modification
            </TableCell>

            <TableCell
              sx={{
                color: "var(--primary-text-color)",
                textWrap: "nowrap",
                // textAlign: "center", // Center align the data
              }}
            >
              <TableSortLabel
                active={orderBy === "scale"}
                direction={orderBy === "scale" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "scale")}
              />
              Scale
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
              }}
            >
              Progress
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row, index) => (
            <TableRow
              sx={{
                backgroundColor:
                  row.sekans && row.sekans.length >= 50
                    ? "var(--error-color)"
                    : "inherit",
              }}
              key={row.id}
            >
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  paddingLeft: 5,
                }}
              >
                {row.index}
                {/* Calculate the row number */}
              </TableCell>
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
                  paddingLeft: 5,
                }}
              >
                {row.oligoAdi}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data

                  paddingLeft: 5,
                }}
              >
                {row.sekans && row.sekans.length > 25
                  ? row.sekans.slice(0, 25) + "..." // Truncate and add "..."
                  : row.sekans}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  paddingLeft: 5,
                }}
              >
                {row.uzunluk}
              </TableCell>

              <TableCell
                sx={{
                  color: "var(--primary-text-color)",

                  textWrap: "nowrap",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.saflaştırma}
              </TableCell>

              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.modifications?.fivePrime || "N/A"}
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                {row.modifications?.threePrime || "N/A"}
              </TableCell>

              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                  // textAlign: "center", // Center align the data
                  paddingLeft: 4,
                }}
              >
                {row.scale}
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
                  color: "var(--primary-text-color)",
                  textAlign: "center", // Center align the data
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={getProgress(row)}
                />
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
    </TableContainer>
  );
};

export default UserTables;

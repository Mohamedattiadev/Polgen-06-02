import React, { useState } from "react";
import AdminShowGroupInfo from "../AdminShowGroupInfo/AdminShowGroupInfo";

import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  Box,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import styles from "./CollapsibleRow.module.css";

const CollapsibleRow = ({
  row,
  rows,
  setRows,
  handleCheckboxChange,
  selectedProducts,
  handleEditProduct,
  setProductToDelete,
  setSelectedProducts,
  setShowDeleteModal,
  handleEmail,
  handleNextStatus,
  processing,
  setProcessing,
  setSelectedUser,
  AdminPageName,
  updateProduct,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Get today's date in YYMMDD format
  const [day, setDay] = useState(() => {
    const today = new Date();
    return today
      .toISOString()
      .slice(2, 10) // Extract "YY-MM-DD"
      .replace(/-/g, ""); // Convert to "YYMMDD"
  });
  // Check if the row has a GroupId and filter grouped rows
  const hasGroupId = row.GroupId !== undefined && row.GroupId !== null;
  const groupedRows = hasGroupId
    ? rows.filter((r) => r.GroupId === row.GroupId)
    : [row];

  // Calculate progress based on the row's status
  const getProgress = (row) => {
    if (row.isFinished) return 100;
    if (row.isWorkingOn) return 80;
    if (row.isApproved) return 50;
    if (row.isOrder) return 25;
    return 0;
  };

  // Handle finishing all products in the group
const handleFinishGroup = async () => {
  const groupIds = groupedRows.map((r) => r.id);
  setProcessing((prev) => [...prev, ...groupIds]);

  try {
    // ✅ Update all products at once instead of looping
    await updateProduct("all", { productIds: groupIds, isFinished: true, isWorkingOn: false });

    // ✅ Update UI
    const updatedRows = rows.map((r) =>
      groupIds.includes(r.id) ? { ...r, isFinished: true, isWorkingOn: false } : r
    );
    setRows(updatedRows);

    // ✅ Fix: Collect finished products per user
    const userMap = {};

    groupedRows.forEach((product) => {
      const userEmail = product.userId; // Assuming `userId` represents the user's email
      if (!userMap[userEmail]) {
        userMap[userEmail] = { username: product.username, products: [] };
      }
      userMap[userEmail].products.push(product.oligoAdi);
    });

    // ✅ Send grouped emails per user
    for (const [userEmail, { username, products }] of Object.entries(userMap)) {
      await sendFinishedEmail(userEmail, username, products);
    }

    console.log("📧 Finished email sent for all products in group.");
  } catch (error) {
    console.error("Failed to finish group:", error);
  } finally {
    setProcessing((prev) => prev.filter((id) => !groupIds.includes(id)));
  }
};


  // Check if any row in the group is selected
  const isAnyRowSelected = groupedRows.some((r) =>
    selectedProducts.includes(r.id),
  );

  // Handle selecting/deselecting all rows in the group
  const handleSelectAll = (e) => {
    const groupIds = groupedRows.map((r) => r.id);
    if (e.target.checked) {
      setSelectedProducts((prev) => [...new Set([...prev, ...groupIds])]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((id) => !groupIds.includes(id)),
      );
    }
  };

  return (
    <React.Fragment>
      {/* Main Row */}
      <TableRow>
        <TableCell>
          {hasGroupId && groupedRows.length > 1 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Checkbox
            checked={selectedProducts.includes(row.id)}
            onChange={() => handleCheckboxChange(row.id)}
          />
        </TableCell>
        <TableCell
          sx={{
            color: "var(--primary-text-color)",
            textAlign: "center",
            paddingLeft: 5,
          }}
        >
     {AdminPageName==="AdminMusteriOrders"?
                        
                          (row.orderno):(row.index)}


        </TableCell>
        {AdminPageName === "AdminSynthingOrders" && (
          <TableCell
            sx={{
              color: "var(--primary-text-color)",
              textAlign: "center",
              paddingLeft: 5,
            }}
          >
            <Button onClick={() => setSelectedGroup(row.GroupId)}>
              {`${day}`}
              {"-"}
              {row.GroupId || "N/A"}
            </Button>
          </TableCell>
        )}
        <TableCell
          sx={{
            color: "var(--primary-text-color)",
            textAlign: "center",
            paddingLeft: 5,
          }}
        >
          {new Date(row.createdAt).toLocaleString("en-CA", {
            dateStyle: "short",
            timeStyle: "short",
            hour12: false,
          })}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            padding: "50px",
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
          >
            {row.userId ? row.userId.split("-")[0] : "Unknown"}
          </Button>
        </TableCell>
        <TableCell
          sx={{
            color: "var(--primary-text-color)",
            textAlign: "center",
            paddingLeft: 5,
          }}
        >
          {row.category}
        </TableCell>
        <TableCell
          sx={{
            color: "var(--primary-text-color)",
            textAlign: "center",
          }}
        >
          {row.totalPrice || "N/A"}
        </TableCell>
        <TableCell
          sx={{
            color: "var(--primary-text-color)",
            textAlign: "start",
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
        <TableCell sx={{ padding: 4 }}>
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
            paddingLeft: 7,
            borderRadius: "0px",

                            border:"none"
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
               disabled={processing.includes(row.id) || row.isFinished} 
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


    {!row.isFinished && (
              <IconButton onClick={() => handleEditProduct(row)}>
                <EditIcon />
              </IconButton>
    )}


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
      {/* Collapsible Group Rows */}
      {hasGroupId && groupedRows.length > 1 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Group ID: {row.GroupId}
                  </Typography>
{AdminPageName === "AdminFinishedOrders" ? (null):(
  <Button
    variant="contained"
    onClick={handleFinishGroup}
    disabled={
      !isAnyRowSelected ||
      processing.some((id) => groupedRows.some((r) => r.id === id))
    }
    sx={{
      marginBottom: 2,
      width: "20%",
      backgroundColor: "var(--error-color)",
    }}
    className={styles.finishAllButton}
  >
    Finish All
  </Button>
)}

                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ paddingLeft: 2 }}>
                        <Checkbox
                          checked={groupedRows.every((r) =>
                            selectedProducts.includes(r.id),
                          )}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                          paddingLeft: 5,
                        }}
                      >
                        {AdminPageName==="AdminMusteriOrders"?
                        
                      ("OrderNO"):("#")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                          paddingLeft: 5,
                        }}
                      >
                        Created At
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                          paddingLeft: 5,
                        }}
                      >
                        User ID
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                          paddingLeft: 5,
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                        }}
                      >
                        Total Price
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "start",
                          paddingLeft: 4.5,
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                          padding: 4,
                        }}
                      >
                        Progress
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedRows.map((groupedRow) => (
                      <TableRow
                        sx={{
                          backgroundColor: groupedRow.isFromControlGroup
                            ? "var(--control-group-bg-color)"
                            : groupedRow.sekans &&
                                groupedRow.sekans.length >= 50
                              ? "var(--error-color)"
                              : "inherit",
                        }}
                        key={groupedRow.id}
                      >
                        <TableCell sx={{ paddingLeft: 2 }}>
                          <Checkbox
                            checked={selectedProducts.includes(groupedRow.id)}
                            onChange={() => handleCheckboxChange(groupedRow.id)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center",
                            paddingLeft: 5,
                          }}
                        >
    {AdminPageName==="AdminMusteriOrders"?
                        
                          (groupedRow.orderno):(groupedRow.index)}

                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center",
                            paddingLeft: 5,
                          }}
                        >
                          {new Date(groupedRow.createdAt).toLocaleString(
                            "en-CA",
                            {
                              dateStyle: "short",
                              timeStyle: "short",
                              hour12: false,
                            },
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center",
                            paddingLeft: 5,
                          }}
                        >
                          <Button
                            sx={{
                              color:
                                groupedRow.sekans &&
                                groupedRow.sekans.length >= 50
                                  ? "var(--primary-bg-color)"
                                  : "var(--error-color)",
                              padding: "11px 27px",
                            }}
                            onClick={() => setSelectedUser(groupedRow.userId)}
                          >
                            {groupedRow.userId
                              ? groupedRow.userId.split("-")[0]
                              : "Unknown"}
                          </Button>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center",
                            paddingLeft: 5,
                          }}
                        >
                          {groupedRow.category}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center",
                          }}
                        >
                          {groupedRow.totalPrice || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "start",
                            paddingLeft: 4.5,
                          }}
                        >
                          {groupedRow.isFinished
                            ? "Finished"
                            : groupedRow.isWorkingOn
                              ? "In Progress"
                              : groupedRow.isApproved
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
                            value={getProgress(groupedRow)}
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
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gridTemplateRows: "1fr 1fr",
                            gap: "7px",
                            paddingLeft: 7,
                          }}
                        >
                          {/* Show only the delete button for Control Group products */}
                          {groupedRow.isFromControlGroup ? (
                            <IconButton
                              onClick={() => {
                                setProductToDelete(groupedRow.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          ) : (
                            <>
                              {/* Show all buttons for non-Control Group products */}
                              <IconButton
                                onClick={() =>
                                  handleNextStatus(groupedRow.id, {
                                    isApproved: groupedRow.isApproved,
                                    isWorkingOn: groupedRow.isWorkingOn,
                                    isFinished: groupedRow.isFinished,
                                  })
                                }
                           disabled={processing.includes(row.id) || row.isFinished} 
                              >
                                {processing.includes(groupedRow.id) ? (
                                  <HourglassBottomIcon />
                                ) : groupedRow.isFinished ? (
                                  <CheckCircleIcon color="success" />
                                ) : groupedRow.isWorkingOn ? (
                                  <CheckCircleIcon color="warning" />
                                ) : groupedRow.isApproved ? (
                                  <CheckCircleIcon color="primary" />
                                ) : (
                                  <CheckCircleIcon color="disabled" />
                                )}
                              </IconButton>
                           
    {!row.isFinished && (

                              <IconButton
                                onClick={() => handleEditProduct(groupedRow)}
                              >
                                <EditIcon />
                              </IconButton>
                              )}
                              <IconButton
                                onClick={() => {
                                  setProductToDelete(groupedRow.id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleEmail(groupedRow)}
                              >
                                <MailIcon color="primary" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {selectedGroup && (
        <AdminShowGroupInfo
          groupId={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </React.Fragment>
  );
};

export default CollapsibleRow;

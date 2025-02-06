import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Table,
  TableBody,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { addProduct } from "../../../../api/product";
import styles from "./AdminControlGrouptables.module.css";

import { primerData, propData } from "../../../../data/ProductData";

const AdminControlGrouptables = ({ onClose, onAddProduct }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData([
          {
            id: 1,
            category: "Prime",
            oligoAdi: "BetaActinmRNAR",
            sekans: "AGGAGGAGCAATGATCTTGATC",
            uzunluk: 22,
            saflaştırma: "OPC",
            scale: "100 nmol",
            modifications: { fivePrime: "", threePrime: "" },
          },
          {
            id: 2,
            category: "Prop",
            oligoAdi: "BetaActinmRNAR",
            sekans: "TTCCTGGGCATGGAGTCCT",
            uzunluk: 19,
            saflaştırma: "OPC",
            scale: "200 nmol",
            modifications: { fivePrime: "", threePrime: "" },
          },
        ]);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (id, field, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleModificationChange = (id, field, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              modifications: { ...item.modifications, [field]: value },
            }
          : item,
      ),
    );
  };

  const handleAddProduct = async (product) => {
    try {
      const productData = [
        {
          ...product,
          GroupId: "default",
          isOrder: false,
          isApproved: true,
          isFromControlGroup: true,
        },
      ];
      const response = await addProduct(productData);
      if (onAddProduct && response.products) {
        onAddProduct(response.products[0]);
      }
      onClose();
    } catch (error) {
      setError("Failed to add product. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={styles.popupOverlay}
      onClick={(e) =>
        e.target.classList.contains(styles.popupOverlay) && onClose()
      }
    >
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <h2>Control Group (Information)</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
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
                <TableRow>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Oligo Name
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Sequence
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Length
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Purification
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Scale
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    5' Modification
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    3' Modification
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-text-color)",
                      textAlign: "center", // Center align the data
                      textWrap: "nowrap",
                      paddingX: "20",
                    }}
                  >
                    Add
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => {
                  const modificationData =
                    row.category === "Prime" ? primerData : propData;
                  return (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        {row.category}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        {row.oligoAdi}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        {row.sekans}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        {row.uzunluk}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        <Select
                          value={row.saflaştırma}
                          onChange={(e) =>
                            handleChange(row.id, "saflaştırma", e.target.value)
                          }
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center", // Center align the data
                            textWrap: "nowrap",
                            paddingX: "20",
                          }}
                        >
                          {modificationData.saflaştırma.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        <Select
                          value={row.scale}
                          onChange={(e) =>
                            handleChange(row.id, "scale", e.target.value)
                          }
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center", // Center align the data
                            textWrap: "nowrap",
                            paddingX: "20",
                          }}
                        >
                          {Object.keys(modificationData.synthesisScales).map(
                            (scale) => (
                              <MenuItem key={scale} value={scale}>
                                {scale}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        <Select
                          value={row.modifications.fivePrime}
                          onChange={(e) =>
                            handleModificationChange(
                              row.id,
                              "fivePrime",
                              e.target.value,
                            )
                          }
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center", // Center align the data
                            textWrap: "nowrap",
                            paddingX: "20",
                          }}
                        >
                          {Object.keys(
                            modificationData.fivePrimeModifications,
                          ).map((mod) => (
                            <MenuItem key={mod} value={mod}>
                              {mod}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        <Select
                          value={row.modifications.threePrime}
                          onChange={(e) =>
                            handleModificationChange(
                              row.id,
                              "threePrime",
                              e.target.value,
                            )
                          }
                          sx={{
                            color: "var(--primary-text-color)",
                            textAlign: "center", // Center align the data
                            textWrap: "nowrap",
                            paddingX: "20",
                          }}
                        >
                          {Object.keys(
                            modificationData.threePrimeModifications,
                          ).map((mod) => (
                            <MenuItem key={mod} value={mod}>
                              {mod}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--primary-text-color)",
                          textAlign: "center", // Center align the data
                          textWrap: "nowrap",
                          paddingX: "20",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAddProduct(row)}
                        >
                          <AddCircleOutlineIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default AdminControlGrouptables;

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import styles from "./UserStaticTables.module.css"; // Import the CSS module

const UserStaticTables = () => {
  const synthesisProgram = [
    { day: "Pazartesi", time: "10:00", quantity: "50 nmol" },
    { day: "Salı", time: "10:00", quantity: "50 nmol" },
    { day: "Çarşamba", time: "16:00", quantity: "100 nmol" },
    { day: "Perşembe", time: "16:00", quantity: "50 nmol (>50bp)" },
    { day: "Cuma", time: "16:00", quantity: "100 nmol" },
    { day: "Cumartesi", time: "16:00", quantity: "200 nmol" },
  ];

  const primerPrices = [
    { scale: "50nmol", desalting: 0.3, opc: 0.75, hplc: 0.8 },
    { scale: "100nmol", desalting: 0.4, opc: 0.8, hplc: 0.85 },
    { scale: "200nmol", desalting: 0.5, opc: 0.9, hplc: 0.95 },
  ];

  return (
    <div className={styles.table_container}>
      {/* Synthesis Program Table */}
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
                }}
                className={styles["table-header"]}
              >
                Day
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
                className={styles["table-header"]}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
                className={styles["table-header"]}
              >
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {synthesisProgram.map((entry, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {entry.day}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {entry.time}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {entry.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Primer Prices Table */}
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
                }}
                className={styles["table-header"]}
              >
                Scale
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
                className={styles["table-header"]}
              >
                Desalting
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
                className={styles["table-header"]}
              >
                OPC
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--primary-text-color)",
                }}
                className={styles["table-header"]}
              >
                HPLC
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {primerPrices.map((price, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {price.scale}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {price.desalting}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {price.opc}
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--primary-text-color)",
                  }}
                  className={styles["table-cell"]}
                >
                  {price.hplc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserStaticTables;

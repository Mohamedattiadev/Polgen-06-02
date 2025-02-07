import Excel from "exceljs";
import path from "path";
import fs from "fs";

// ✅ Function to generate an Excel file (Supports both Primer & Probe)
export const generateExcelTemplate = async (templateType, rows, res) => {
  try {
    // ✅ Select template file based on type (primer/probe)
    const templateFile = templateType === "probe" ? "probe_template.xlsx" : "primer_template.xlsx";
    const templatePath = path.resolve("services/excel/templates", templateFile);

    // ✅ Ensure the template exists
    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Template file not found: ${templatePath}`);
      return res.status(404).json({ error: "Template file not found" });
    }

    // ✅ Load workbook from the selected template
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const sheet = workbook.getWorksheet(1);
    if (!sheet) throw new Error("Worksheet not found");

    // ✅ Populate with rows if provided
    if (rows.length > 0) {
      rows.forEach((row, rowIndex) => {
        const excelRow = sheet.getRow(rowIndex + 2); // Start from row 2 (after headers)
        row.forEach((cell, colIndex) => {
          excelRow.getCell(colIndex + 1).value = cell;
        });
        excelRow.commit();
      });
    }

    // ✅ Set response headers for download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${templateFile}"`);

    await workbook.xlsx.write(res);
  } catch (error) {
    console.error("❌ Error in generateExcelTemplate:", error.message);
    res.status(500).json({ error: "Failed to generate template." });
  }
};

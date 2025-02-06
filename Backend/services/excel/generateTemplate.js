import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Excel from "exceljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateExcelTemplate = async (templateType, rows, res) => {
  try {
    // Map template types to their corresponding file paths
    const fileMap = {
      primer: "./templates/primer_template.xlsx",
      probe: "./templates/probe_template.xlsx",
    };

    // Resolve the template file path
    const templatePath = path.resolve(__dirname, fileMap[templateType]);

    // Validate if the file exists
    if (!fs.existsSync(templatePath)) {
      return res.status(404).send(`Template file not found: ${templateType}`);
    }

    // Load the template workbook
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Prepare the response headers
    const fileName =
      templateType === "primer" ? "Primer_Template.xlsx" : "Probe_Template.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Write workbook to a buffer first (to avoid stream issues)
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the buffer as the response
    res.send(buffer);
  } catch (error) {
    console.error(`Error generating ${templateType} template:`, error.message);
    res.status(500).send(`Error generating ${templateType} Excel file.`);
  }
};

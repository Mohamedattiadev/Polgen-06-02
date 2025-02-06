import { generateExcelTemplate } from "../services/excel/generateTemplate.js";
import { importExcelFile } from "../services/excel/importExcel.js";
import path from "path";
import Product from "../models/Product.js"; // Default import for the Product model




// Function to handle Primer template download


export const downloadPrimerTemplate = async (req, res) => {
  try {
    const filePath = path.resolve("services/excel/templates/primer_template.xlsx");
    res.download(filePath, "Primer_Template.xlsx", (err) => {
      if (err) {
        console.error("Error sending Primer Template:", err.message);
        res.status(500).send("Could not download the Primer template.");
      }
    });
  } catch (error) {
    console.error("Error in downloadPrimerTemplate:", error.message);
    res.status(500).send("Server error.");
  }
};

export const downloadProbeTemplate = async (req, res) => {
  try {
    const filePath = path.resolve("services/excel/templates/probe_template.xlsx");
    res.download(filePath, "Probe_Template.xlsx", (err) => {
      if (err) {
        console.error("Error sending Probe Template:", err.message);
        res.status(500).send("Could not download the Probe template.");
      }
    });
  } catch (error) {
    console.error("Error in downloadProbeTemplate:", error.message);
    res.status(500).send("Server error.");
  }
};


// Export template function (if needed)
export const exportTemplate = async (req, res) => {
  try {
    const { templateid, rows } = req.body;
    if (!templateid || !Array.isArray(rows)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await generateExcelTemplate(templateid, rows, res);
  } catch (error) {
    console.error("Error in exportTemplate:", error.message);
    res.status(500).json({ message: "Error generating Excel file" });
  }
};

// Import template function (if needed)



export const importTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required for importing products" });
    }

    const mode = req.body.mode || req.query.mode; // ✅ Extract mode from request

    console.log("Received mode in backend:", mode); // Debug log

    const filePath = path.resolve(process.cwd(), req.file.path);

    // ✅ Pass mode to importExcelFile
    const products = await importExcelFile(filePath, userId, mode);

    // Save products to the database
    await Product.bulkCreate(products);

    res.status(200).json({
      message: "Products successfully added to the database",
      productCount: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Error in importTemplate:", error.message);
    res
      .status(500)
      .json({ message: "Failed to import products", error: error.message });
  }
};


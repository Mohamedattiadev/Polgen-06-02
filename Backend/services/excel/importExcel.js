import Excel from "exceljs";
import fs from "fs";
import Product from "../../models/Product.js"; // ✅ Correct path
// ✅ Import Product model

export const importExcelFile = async (filePath, userId, mode) => {

  const category = (mode || "").toString().trim().toLowerCase() === "primer" ? "primer" : "probe";

  console.log("mwsASas",mode)
  try {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.getWorksheet(2); // Access the second sheet
    if (!sheet) {
      throw new Error("No valid worksheet found");
    }

    const products = [];

    // ✅ Fetch the current max index to continue numbering
    const maxIndex = (await Product.max("index")) || 0;
    let newIndex = maxIndex + 1;

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex < 21) return; // Skip first 20 rows

      console.log(`Processing row ${rowIndex}:`, row.values);

      if (!row.getCell(1).value) {
        console.log(`Skipping row ${rowIndex} as the first cell is empty.`);
        return;
      }

      const priceCell = row.getCell(8).value;
      const parsedPrice =
        priceCell && priceCell.result !== undefined
          ? priceCell.result.toFixed(2)
          : (priceCell || 0).toFixed(2);

      const lengthCell = row.getCell(5).value;
      const parsedLength =
        lengthCell && typeof lengthCell.result !== undefined
          ? lengthCell.result
          : lengthCell || 0;

      products.push({
        index: newIndex++, // ✅ Ensure index is assigned properly
        category:category,
          modifications: {
          fivePrime: row.getCell(2).value || "",
          threePrime: row.getCell(4).value || "",
        },
        sekans: row.getCell(3).value || "",
        uzunluk: parsedLength,
        saflaştırma: row.getCell(7).value || null,
        scale: row.getCell(6).value || "50 nmol",
        totalPrice: parsedPrice,
        oligoAdi: row.getCell(1).value || `Imported Product ${rowIndex}`,
        quantity: 1,
        userId:userId,
        dmt: row.getCell(7).value === "OPC" ? "DMTOFF" : "DMTON", // ✅ Assign DMT value
      });
    });

    fs.unlinkSync(filePath); // Delete the file after processing

    return products;
  } catch (error) {
    console.error("Error processing Excel file:", error.message);
    throw error;
  }
};
 
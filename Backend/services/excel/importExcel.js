import Excel from "exceljs";
import fs from "fs";
import Product from "../../models/Product.js"; // ✅ Correct path
import User from "../../models/User.js"; // ✅ Import User model

export const importExcelFile = async (filePath, userId, mode) => {
  const category = (mode || "").toString().trim().toLowerCase() === "primer" ? "primer" : "probe";

  try {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.getWorksheet(2); // Access the second sheet
    if (!sheet) {
      throw new Error("No valid worksheet found");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("🔥 User Before Import:", user.toJSON());

    // ✅ Increase user's orderno by 1
    const newOrderNo = (parseInt(user.orderno, 10) + 1).toString().padStart(4, "0");
    await user.update({ orderno: newOrderNo });

    console.log("✅ User After Import:", await user.reload());

    const products = [];

    // ✅ Fetch the current max index to continue numbering
    const maxIndex = (await Product.max("index")) || 0;
    let newIndex = maxIndex + 1;

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex < 21) return; // Skip first 20 rows

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
        category: category,
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
        userId: userId,
        dmt: row.getCell(7).value === "OPC" ? "DMTOFF" : "DMTON", // ✅ Assign DMT value
        orderno: newOrderNo, // ✅ Assign the same orderno for all imported products
      });
    });

    fs.unlinkSync(filePath); // Delete the file after processing

    console.log("📦 Imported Products:", JSON.stringify(products, null, 2));

    return products;
  } catch (error) {
    console.error("❌ Error processing Excel file:", error.message);
    throw error;
  }
};

import Excel from "exceljs";
import fs from "fs";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

export const importExcelFile = async (filePath, userId, mode) => {
  const category = (mode || "").toString().trim().toLowerCase();
  const isPrimer = category === "primer";

  try {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet(2);
    if (!sheet) throw new Error("No valid worksheet found");

    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const newOrderNo = (parseInt(user.orderno, 10) + 1).toString().padStart(4, "0");
    await user.update({ orderno: newOrderNo });

    const maxIndex = (await Product.max("index")) || 0;
    let newIndex = maxIndex + 1;
    const products = [];

    const getCellValue = (cell) => {
      if (!cell) return "";
      if (typeof cell === "object" && cell.richText) {
        return cell.richText.map((r) => r.text).join("");
      }
      return cell.result !== undefined ? cell.result.toString() : cell.toString();
    };

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex < 21 || !row.getCell(1).value) return;

      const priceCell = getCellValue(row.getCell(isPrimer ? 8 : 6));
      const parsedPrice = parseFloat(priceCell) ? parseFloat(priceCell).toFixed(2) : "0.00";
      
      const lengthCell = getCellValue(row.getCell(5));
      const parsedLength = parseInt(lengthCell) || 0;

      products.push({
        index: newIndex++,
        category,
        modifications: {
          fivePrime: getCellValue(row.getCell(2)),
          threePrime: getCellValue(row.getCell(4)),
        },
        sekans: getCellValue(row.getCell(3)),
        uzunluk: parsedLength,
        saflaştırma: isPrimer ? getCellValue(row.getCell(7)) || null : "DSLT",
        scale: isPrimer ? getCellValue(row.getCell(6)) || "50 nmol" : "200 nmol",
        totalPrice: parsedPrice,
        oligoAdi: getCellValue(row.getCell(1)) || `Imported Product ${rowIndex}`,
        quantity: 1,
        userId,
        dmt: isPrimer ? (getCellValue(row.getCell(7)) === "OPC" ? "DMTOFF" : "DMTON") : "DMTON",
        orderno: newOrderNo,
      });
    });

    fs.unlinkSync(filePath);
    return products;
  } catch (error) {
    console.error("❌ Error processing Excel file:", error.message);
    throw error;
  }
};

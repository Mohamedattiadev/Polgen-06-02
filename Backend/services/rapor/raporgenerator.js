import path from "path";
import fs from "fs";
import Excel from "exceljs";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const generateExcelReport = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      console.error("No products provided in request body");
      return res.status(400).json({ error: "Products are required" });
    }

    const templatePath = path.resolve("files/production_report_template.xlsx");
    if (!fs.existsSync(templatePath)) {
      console.error("Template file not found:", templatePath);
      return res.status(404).json({ error: "Template file not found" });
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const mainSheet = workbook.getWorksheet(1);
    const secondSheet = workbook.getWorksheet(2);

    if (!mainSheet || !secondSheet) {
      console.error("Required sheets not found in the template");
      return res.status(500).json({ error: "Required sheets not found" });
    }

    console.log("Template loaded successfully");

    // Populate the main sheet
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const user = await User.findByPk(product.userId);
      const username = user ? user.username : "Unknown";

      const row = mainSheet.getRow(index + 2);
      row.getCell("A").value = product.index;
      row.getCell("B").value = product.sekans;
      row.getCell("C").value = product.dmt;
      row.getCell("D").value = product.index;
      row.getCell("E").value = product.oligoAdi;
      row.getCell("F").value = product.scale;
      row.getCell("G").value = product.saflaştırma;
      row.getCell("H").value = product.tm;
      row.getCell("I").value = product.gcPercent;
      row.getCell("J").value = product.uzunluk;
      row.getCell("K").value = product.mw;
      row.getCell("L").value = product.extinctionCoefficient;
      row.getCell("M").value = product.iCount;
      row.getCell("N").value = product.concentration;
      row.getCell("O").value = product.a260;
      row.getCell("P").value = product.totalNg;
      row.getCell("Q").value = product.od;
      row.getCell("R").value = product.totalNmol;
      row.getCell("S").value = product.stok100M;
      row.getCell("T").value = product.stok50M;
      row.getCell("U").value = username;
      row.commit();
    }

    // Copy second sheet for each user
    const productsByUser = {};
    for (const product of products) {
      const user = await User.findByPk(product.userId);
      const username = user ? user.username : "Unknown";
      if (!productsByUser[username]) productsByUser[username] = [];
      productsByUser[username].push(product);
    }

    for (const [username, userProducts] of Object.entries(productsByUser)) {
      const userSheet = workbook.addWorksheet(username);

      secondSheet.eachRow((row, rowNumber) => {
        const newRow = userSheet.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (!cell) return;
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;

          if (cell.style) {
            newCell.style = { ...cell.style };
          }
        });
        newRow.height = row.height;
        newRow.commit();
      });

      for (let i = 0; i < userProducts.length; i++) {
        const product = userProducts[i];
        const row = userSheet.getRow(i + 2);
        row.getCell("A").value = product.oligoAdi;
        row.getCell("B").value = product.sekans;
        row.getCell("C").value = product.dmt;
        row.getCell("D").value = product.category;
        row.getCell("E").value = product.scale;
        row.getCell("F").value = product.saflaştırma;
        row.getCell("G").value = product.tm;
        row.getCell("H").value = product.gcPercent;
        row.getCell("I").value = product.uzunluk;
        row.getCell("J").value = product.mw;
        row.getCell("K").value = product.extinctionCoefficient;
        row.getCell("L").value = product.concentration;
        row.getCell("M").value = product.a260;
        row.getCell("N").value = product.totalNg;
        row.getCell("O").value = product.totalNmol;
        row.commit();
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="products_report.xlsx"`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error in generateExcelReport:", error.message);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};

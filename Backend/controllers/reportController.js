import path from "path";
import fs from "fs";
import Excel from "exceljs";
import Product from "../models/Product.js";
import User from "../models/User.js";



  // Get today's date in YYMMDD format
  function getFormattedDate() {
    const today = new Date();
    return today
        .toISOString()
        .slice(2, 10) // Extract "YY-MM-DD"
        .replace(/-/g, ""); // Convert to "YYMMDD"
}

const day = getFormattedDate();


export const generateExcelReport = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Products are required" });
    }

    const templatePath = path.resolve("files/production_report_template.xlsx");
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: "Template file not found" });
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const mainSheet = workbook.getWorksheet(1);
    const controlSheet = workbook.getWorksheet("1-KontrolPrimer-1011");

    if (!mainSheet || !controlSheet) {
      return res.status(500).json({ error: "Required sheets not found" });
    }

    // Main sheet (First page)
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const user = await User.findByPk(product.userId);
      const username = user ? user.username : "Unknown";

      const row = mainSheet.getRow(index + 2);
      row.getCell("A").value = username+product.orderno; // Sipariş No
      row.getCell("B").value = product.sekans; // Baz Dizisi 5'-3'
      row.getCell("C").value = product.dmt; // DMT ON/OFF
      row.getCell("D").value = day+"-"+product.GroupId+"-"+product.index; // SentezNo
      row.getCell("E").value = product.oligoAdi; // Ad
      row.getCell("F").value = product.scale; // Sentez Skalası (nmol)
      row.getCell("G").value = product.saflaştırma; // Saflaş. Türü
      row.getCell("H").value = product.tm; // Tm (°C)
      row.getCell("I").value = product.gcPercent; // GC %
      row.getCell("J").value = product.uzunluk; // bp
      row.getCell("K").value = product.mw; // MW (g/mol)
      row.getCell("L").value = product.extinctionCoefficient; // Ex. Coef L/(mole·cm)
      row.getCell("M").value = parseFloat((product.totalNmol / product.od).toFixed(2)); // nmole/OD
      row.getCell("N").value = parseFloat((product.extinctionCoefficient / product.od).toFixed(2)); // µg/OD
      row.getCell("O").value = product.concentration; // Conc. (ng/µl)
      row.getCell("P").value = product.a260; // A260
      row.getCell("Q").value = product.totalNg; // Total ng
      row.getCell("R").value = product.od; // OD
      row.getCell("S").value = product.totalNmol; // Total nmol
      row.getCell("T").value = product.stok100M; // 100 µM stok - µl TE
      row.commit();
    }

    // Second page (Control sheet, product with index === 1)
    const controlProduct = products.find((p) => p.index === 1);
    if (controlProduct) {
      const row = controlSheet.getRow(3);
      row.getCell("A").value = controlProduct.sekans; // Baz Dizisi 5'-3'
      row.getCell("B").value = controlProduct.dmt; // DMT ON/OFF
      row.getCell("C").value = day+"-"+controlProduct.GroupId+"-"+controlProduct.index; // SentezNo
      row.getCell("D").value = controlProduct.oligoAdi; // Ad
      row.getCell("E").value = controlProduct.scale; // Sentez Skalası (nmol)
      row.getCell("F").value = controlProduct.saflaştırma; // Saflaş. Türü
      row.getCell("G").value = controlProduct.tm; // Tm (°C)
      row.getCell("H").value = controlProduct.gcPercent; // GC %
      row.getCell("I").value = controlProduct.uzunluk; // bp
      row.getCell("J").value = controlProduct.mw; // MW (g/mol)
      row.getCell("K").value = controlProduct.extinctionCoefficient; // Ex. Coef L/(mole·cm)
      row.getCell("L").value = parseFloat((controlProduct.totalNmol / controlProduct.od).toFixed(2)); // nmole/OD
      row.getCell("M").value = parseFloat((controlProduct.extinctionCoefficient / controlProduct.od).toFixed(2)); // µg/OD
      row.getCell("N").value = controlProduct.concentration; // Conc. (ng/µl)
      row.getCell("O").value = controlProduct.a260; // A260
      row.getCell("P").value = controlProduct.totalNg; // Total ng
      row.getCell("Q").value = controlProduct.od; // OD
      row.getCell("R").value = controlProduct.totalNmol; // Total nmol
      row.getCell("S").value = controlProduct.stok100M; // 100 µM stok - µl TE
      row.getCell("T").value = controlProduct.stok50M; // 50 µM stok - µl TE
      row.commit();
    }

    // User-specific sheets
    const productsByUser = {};
    for (const product of products) {
      const user = await User.findByPk(product.userId);
      const username = user ? user.username : "Unknown";
      if (!productsByUser[username]) productsByUser[username] = [];
      productsByUser[username].push(product);
    }

    for (const [username, userProducts] of Object.entries(productsByUser)) {
      const userSheet = workbook.addWorksheet(username);

      mainSheet.getRow(1).eachCell((cell, colNumber) => {
        const newCell = userSheet.getRow(1).getCell(colNumber);
        newCell.value = cell.value;
        newCell.style = cell.style;
      });

      for (let i = 0; i < userProducts.length; i++) {
        const product = userProducts[i];
        const row = userSheet.getRow(i + 2);
        row.getCell("A").value = username+product.orderno; // Sipariş No
        row.getCell("B").value = product.sekans; // Baz Dizisi 5'-3'
        row.getCell("C").value = product.dmt; // DMT ON/OFF
        row.getCell("D").value = day+"-"+product.GroupId+"-"+product.index; // SentezNo
        row.getCell("E").value = product.oligoAdi; // Ad
        row.getCell("F").value = product.scale; // Sentez Skalası (nmol)
        row.getCell("G").value = product.saflaştırma; // Saflaş. Türü
        row.getCell("H").value = product.tm; // Tm (°C)
        row.getCell("I").value = product.gcPercent; // GC %
        row.getCell("J").value = product.uzunluk; // bp
        row.getCell("K").value = product.mw; // MW (g/mol)
        row.getCell("L").value = product.extinctionCoefficient; // Ex. Coef L/(mole·cm)
        row.getCell("M").value = parseFloat((product.totalNmol / product.od).toFixed(2)); // nmole/OD
        row.getCell("N").value = parseFloat((product.extinctionCoefficient / product.od).toFixed(2)); // µg/OD
        row.getCell("O").value = product.concentration; // Conc. (ng/µl)
        row.getCell("P").value = product.a260; // A260
        row.getCell("Q").value = product.totalNg; // Total ng
        row.getCell("R").value = product.od; // OD
        row.getCell("S").value = product.totalNmol; // Total nmol
        row.getCell("T").value = product.stok100M; // 100 µM stok - µl TE
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
    console.error("Error generating Excel report:", error);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};




// Function to group products by userId
const groupProductsByUserId = (products) => {
  return products.reduce((acc, product) => {
    if (!acc[product.userId]) {
      acc[product.userId] = [];
    }
    acc[product.userId].push(product);
    return acc;
  }, {});
};

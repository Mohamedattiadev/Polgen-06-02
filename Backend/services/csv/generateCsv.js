// import { Op } from "sequelize";
// import fs from "fs";
// import path from "path";
// import Product from "../../models/Product.js";
// import User from "../../models/User.js";
//
// export const generateCsvFile = async (req, res) => {
//     try {
//         const products = await Product.findAll({
//             attributes: ["sekans", "dmt", "id", "oligoAdi", "userId"],
//             include: [
//                 {
//                     model: User,
//                     attributes: ["username"],
//                 },
//             ],
//         });
//
//         const csvData = products.map((product) => ({
//             sekans: product.sekans,
//             dmt: product.dmt,
//             productId: product.id,
//             product: product.oligoAdi,
//             username: product.User ? product.User.username : "",
//         }));
//
//         const headers = ["sekans", "dmt", "productId", "product", "username"];
//         const csvContent = [
//             headers.join(","),
//             ...csvData.map((row) =>
//                 headers.map((header) => row[header] || "").join(",")
//             ),
//         ].join("\n");
//
//         const filePath = path.join(__dirname, "../../files", products_${Date.now()}.csv);
//         fs.writeFileSync(filePath, csvContent);
//
//         res.setHeader("Content-Disposition", attachment; filename=${path.basename(filePath)});
//         res.setHeader("Content-Type", "text/csv");
//         res.sendFile(filePath, (err) => {
//             if (err) {
//                 console.error("Error sending file:", err);
//                 res.status(500).send("Error sending file.");
//             } else {
//                 fs.unlinkSync(filePath);
//             }
//         });
//     } catch (error) {
//         console.error("Error generating CSV file:", error);
//         res.status(500).json({ error: "Failed to generate CSV file." });
//     }
// };

import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getGroupById,
  updateA260Values,
  exportProductsCsv,
  cancelSynthesis,
  retryGuarantee,
  } from "../controllers/productController.js";

import { generateZPLFile } from "../controllers/productController.js";
import { generateKutuEtiketiFile } from "../controllers/productController.js";  // Import the function

const router = express.Router();

router.post("/", requireAuth, addProduct);
router.get("/", requireAuth, getProducts);
router.put("/update-a260", updateA260Values);
router.get("/:id", requireAuth, getProductById);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);
router.get("/groups/:groupId", requireAuth, getGroupById);

// ❌ Removed requireAuth for A260 updates

router.post("/export/csv", exportProductsCsv);
router.post("/cancel-synthesis", cancelSynthesis);
router.post("/retry-guarantee", retryGuarantee);

router.post("/generate-zpl", generateZPLFile);
router.post("/generate-kutu-etiketi", generateKutuEtiketiFile);

export default router;

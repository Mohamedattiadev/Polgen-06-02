import express from "express";
import multer from "multer";
import {
  downloadPrimerTemplate,
  downloadProbeTemplate,
  
} from "../controllers/excelController.js";
import { generateExcelTemplate } from "../controllers/generateExcelTemplateController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import rateLimiter from "../middlewares/rateLimiter.js";
import { importTemplate } from "../controllers/excelController.js"; // ✅ Added missing import

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public Routes: Download Primer & Probe Templates
router.get("/download/primer", downloadPrimerTemplate); // Primer download
router.get("/download/probe", downloadProbeTemplate); // Probe download
// ✅ Route to download the **Primer** Excel template
router.get("/primer-template", async (req, res) => {
  await generateExcelTemplate("primer", [], res);
});

// ✅ Route to download the **Probe** Excel template
router.get("/probe-template", async (req, res) => {
  await generateExcelTemplate("probe", [], res);
});
router.post(
  "/import",
  requireAuth,
  rateLimiter,
  upload.single("file"),
  importTemplate
);
// Authenticated Routes
// Authentication & rate limiting for imports

export default router;

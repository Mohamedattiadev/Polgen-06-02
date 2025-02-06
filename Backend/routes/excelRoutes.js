import express from "express";
import multer from "multer";
import {
  downloadPrimerTemplate,
  downloadProbeTemplate,
  
} from "../controllers/excelController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import rateLimiter from "../middlewares/rateLimiter.js";
import { importTemplate } from "../controllers/excelController.js"; // ✅ Added missing import

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public Routes: Download Primer & Probe Templates
router.get("/download/primer", downloadPrimerTemplate); // Primer download
router.get("/download/probe", downloadProbeTemplate); // Probe download

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

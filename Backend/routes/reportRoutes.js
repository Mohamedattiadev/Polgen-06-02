import express from "express";
import { generateExcelReport } from "../controllers/reportController.js";

const router = express.Router();

// Define the route for downloading the Excel file
router.post("/generate-excel", generateExcelReport);

export default router;

// In your specificmailRoutes.js file
import express from "express";
import { sendSpecificMail } from "../controllers/mailController.js";

const router = express.Router();

// Send specific mail
router.post("/", sendSpecificMail); // Ensure this matches with the frontend API call

export default router;

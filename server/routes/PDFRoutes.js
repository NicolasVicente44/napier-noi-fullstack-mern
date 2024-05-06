import express from "express";
const router = express.Router();
import { generatePDFController } from "../controllers/PDFController.js";
import { isAuthenticated } from "../controllers/AuthenticationController.js";

// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
router.use(express.json());

// Define route for generating PDF
router.post("/generate-pdf", isAuthenticated, generatePDFController);

export default router;
import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/CasesController.js";
import { isAuthenticated } from "../controllers/AuthenticationController.js";
import { generatePDFController } from "../controllers/PDFController.js"; // Import the generatePDFController
import cors from "cors";

// Creates a router
const router = Router();

const corsOptions = {
  origin: process.env.HOST || "http://localhost",
  optionsSuccessStatus: 200,
};

// Defines routes and associates them with controller actions
router.use(isAuthenticated);
router.get("/", index);
router.get("/new", cors(corsOptions), add);
router.get("/:id", show);
router.get("/:id/edit", cors(corsOptions), edit);
router.post("/", cors(corsOptions), create);
router.put("/:id", cors(corsOptions), update);
router.delete("/:id", cors(corsOptions), remove);
import multer from "multer";

const upload = multer();

// Route for generating PDF
router.put(
  "/:id/generate-pdf",
  isAuthenticated,
  upload.none(),
  generatePDFController
);

export default router;

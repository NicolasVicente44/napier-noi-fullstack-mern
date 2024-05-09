import fs from "fs";
import path from "path";
import PDF from "../models/PDFModel.js";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF(formData) {
  try {
    if (!formData.templatePath || typeof formData.templatePath !== "string") {
      throw new Error("Invalid or missing template path in the form data.");
    }

    const templatePath = path.join(
      __dirname,
      "..",
      "NOITemplates",
      formData.templatePath
    );
    const templateBytes = await fs.promises.readFile(templatePath);
    const templatePdf = await PDFDocument.load(templateBytes);
    const formKeys = Object.keys(formData);

    for (const key of formKeys) {
      // Skip the "_method" and "templatePath" keys
      if (key === "_method" || key === "templatePath") continue;

      let pdfFieldName;
      switch (key) {
        case "clientName":
          pdfFieldName = "client";
          break;
        case "VIN_serialNum":
          pdfFieldName = "VIN/serialNum";
          break;
        default:
          pdfFieldName = key;
      }

      const field = templatePdf.getForm().getTextField(pdfFieldName);
      if (field) {
        field.setText(formData[key]);
      }
    }

    const pdfBytes = await templatePdf.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

async function generatePDFController(req, res) {
  try {
    console.log("req body:", req.body);
    const formData = req.body;
    console.log(formData);

    if (!formData.clientName || !formData.VIN_serialNum) {
      throw new Error(
        "Client name or VIN/Serial Number is missing in the form data."
      );
    }

    const clientIdentifier = `${formData.clientName
      .toLowerCase()
      .replace(/\s/g, "")}_${formData.VIN_serialNum.toLowerCase().replace(
      /\s/g,
      ""
    )}`;
    const pdfBytes = await generatePDF(formData);
    const pdfDirectory = path.join(__dirname, "..", "generated_pdfs");
    await fs.promises.mkdir(pdfDirectory, { recursive: true });
    const fileName = `NOI_${clientIdentifier}.pdf`; // Changed to use only client name and VIN/Serial Number
    const filePath = path.join(pdfDirectory, fileName);
    await fs.promises.writeFile(filePath, pdfBytes);
    const pdfEntry = new PDF({ fileName, filePath, caseId: formData.caseId });
    await pdfEntry.save();
    const pdfData = await fs.promises.readFile(filePath);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdfData.length,
    });
    res.send(pdfData);
  } catch (error) {
    console.error("Error generating and saving PDF:", error);
    res.status(500).send("Error generating and saving PDF");
  }
}

export { generatePDFController };
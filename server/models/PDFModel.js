import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;

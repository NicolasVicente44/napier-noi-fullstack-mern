import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    VIN_serialNum: {
      type: String,
      required: true,
    },
    assetDescription: String,
    licensePlate: String,
    registeredOwner: String,
    lienHolder: String,
    daysOfStorage: Number,
    storageRate: Number,
    amountOfArrears: Number,
    bailiffCosts: Number,
    towingCost: Number,
    storageCosts: Number,
    NOICosts: Number,
    HSTOnCosts: Number,
    closingDate: Date,
    formDate: Date,
    totalOfStorageRate: Number,
    dateOfAdditionalCharges: Date,
    repoDate: Date,
    dateNOISent: Date,
    staffAffidavitName: String,
    registeredOwnerCont: String,
    Affidavit_Date1: Date,
    Affidavit_Date2: Date,
    // Enum field for PDF template paths
    templatePath: {
      type: String,
      enum: [
        "NOI Retain Vehicle.pdf",
        "NOI Retain Vessel.pdf",
        "NOI Sell Vehicle.pdf",
        "NOI Sell Vessel.pdf",
        "NOI Lien Only.pdf",
      ],
    },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;

import Case from "../models/CaseModel.js";

const templateTypes = Case.schema.path("templatePath").enumValues;

export const index = async (req, res, next) => {
  try {
    const cases = await Case.find();

    res.format({
      "text/html": () => {
        res.render("cases/index", { cases, title: "Cases List" });
      },
      "application/json": () => {
        res.json({ cases });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};
export const show = async (req, res, next) => {
  try {
    const caseData = await Case.findById(req.params.id);

    res.format({
      "text/html": () => {
        res.render("cases/show", { caseData, title: "Case Details" });
      },
      "application/json": () => {
        res.json({ caseData });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    res.render("cases/add", {
      templateTypes,
      formType: "create",
      title: "New Case",
    });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("Missing required ID");

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      req.status = 404;
      throw new Error("Case does not exist");
    }

    const templateTypes = Case.schema.path("templatePath").enumValues;

    res.render("cases/edit", {
      caseData,
      templateTypes,
      formType: "update",
      title: "Edit Case",
    });
  } catch (error) {
    next(error);
  }
};


export const create = async (req, res, next) => {
  try {
    const {
      clientName,
      VIN_serialNum,
      assetDescription,
      licensePlate,
      registeredOwner,
      lienHolder,
      daysOfStorage,
      storageRate,
      amountOfArrears,
      bailiffCosts,
      towingCost,
      storageCosts,
      NOICosts,
      HSTOnCosts,
      closingDate,
      formDate,
      totalOfStorageRate,
      dateOfAdditionalCharges,
      repoDate,
      dateNOISent,
      staffAffidavitName,
      registeredOwnerCont,
      Affidavit_Date1,
      Affidavit_Date2,
      templatePath,
    } = req.body;

    const newCase = new Case({
      clientName,
      VIN_serialNum,
      assetDescription,
      licensePlate,
      registeredOwner,
      lienHolder,
      daysOfStorage,
      storageRate,
      amountOfArrears,
      bailiffCosts,
      towingCost,
      storageCosts,
      NOICosts,
      HSTOnCosts,
      closingDate,
      formDate,
      totalOfStorageRate,
      dateOfAdditionalCharges,
      repoDate,
      dateNOISent,
      staffAffidavitName,
      registeredOwnerCont,
      Affidavit_Date1,
      Affidavit_Date2,
      templatePath,
    });

    await newCase.save();

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Case was created successfully",
          },
        ];
        res.redirect("/cases");
      },
      "application/json": () => {
        res.status(201).json({ status: 201, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Case failed to create" },
    ];
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const {
      clientName,
      VIN_serialNum,
      assetDescription,
      licensePlate,
      registeredOwner,
      lienHolder,
      daysOfStorage,
      storageRate,
      amountOfArrears,
      bailiffCosts,
      towingCost,
      storageCosts,
      NOICosts,
      HSTOnCosts,
      closingDate,
      formDate,
      totalOfStorageRate,
      dateOfAdditionalCharges,
      repoDate,
      dateNOISent,
      staffAffidavitName,
      registeredOwnerCont,
      Affidavit_Date1,
      Affidavit_Date2,
      templatePath,
    } = req.body;

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      req.status = 404;
      throw new Error("Case does not exist");
    }

    caseData.clientName = clientName;
    caseData.VIN_serialNum = VIN_serialNum;
    caseData.assetDescription = assetDescription;
    caseData.licensePlate = licensePlate;
    caseData.registeredOwner = registeredOwner;
    caseData.lienHolder = lienHolder;
    caseData.daysOfStorage = daysOfStorage;
    caseData.storageRate = storageRate;
    caseData.amountOfArrears = amountOfArrears;
    caseData.bailiffCosts = bailiffCosts;
    caseData.towingCost = towingCost;
    caseData.storageCosts = storageCosts;
    caseData.NOICosts = NOICosts;
    caseData.HSTOnCosts = HSTOnCosts;
    caseData.closingDate = closingDate;
    caseData.formDate = formDate;
    caseData.totalOfStorageRate = totalOfStorageRate;
    caseData.dateOfAdditionalCharges = dateOfAdditionalCharges;
    caseData.repoDate = repoDate;
    caseData.dateNOISent = dateNOISent;
    caseData.staffAffidavitName = staffAffidavitName;
    caseData.registeredOwnerCont = registeredOwnerCont;
    caseData.Affidavit_Date1 = Affidavit_Date1;
    caseData.Affidavit_Date2 = Affidavit_Date2;
    caseData.templatePath = templatePath;
    await caseData.save();

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Case was updated successfully",
          },
        ];
        res.redirect("/cases");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Case failed to update" },
    ];
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      req.status = 404;
      throw new Error("Case does not exist");
    }

    await Case.findByIdAndDelete(req.params.id);

    res.format({
      "text/html": () => {
        req.session.notifications = [
          {
            alertType: "alert-success",
            message: "Case was deleted successfully",
          },
        ];
        res.redirect("/cases");
      },
      "application/json": () => {
        res.status(200).json({ status: 200, message: "SUCCESS" });
      },
      default: () => {
        res.status(406).send("NOT ACCEPTABLE");
      },
    });
  } catch (error) {
    req.session.notifications = [
      { alertType: "alert-danger", message: "Case failed to delete" },
    ];
    next(error);
  }
};

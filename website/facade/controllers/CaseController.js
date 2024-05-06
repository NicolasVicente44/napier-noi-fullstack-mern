import CaseService from "../services/CaseService.js";

export const index = async (req, res, __) => {
  try {
    const caseService = await CaseService;
    const cases = await caseService.index(req.headers.cookie);

    res.json(cases);
  } catch (error) {
    console.error(error);

    res.json([]);
  }
};

export const show = async (req, res, _) => {
  try {
    const caseService = await CaseService;
    const caseData = await caseService.show(req.params.id, req.headers.cookie);

    res.json(caseData);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

export const create = async (req, res, _) => {
  try {
    const caseService = await CaseService;
    const caseData = await caseService.create(req.body, req.headers.cookie);

    res.json(caseData);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

export const update = async (req, res, _) => {
  try {
    const caseService = await CaseService;
    const caseData = await caseService.update(
      req.params.id,
      req.body,
      req.headers.cookie
    );

    res.json(caseData);
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

export const destroy = async (req, res, _) => {
  try {
    const caseService = await CaseService;
    await caseService.destroy(req.params.id, req.headers.cookie);

    res.json({});
  } catch (error) {
    console.error(error);

    res.json({});
  }
};

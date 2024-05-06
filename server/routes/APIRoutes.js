import { Router } from "express";
import {
  index as caseIndex,
  show as caseShow,
  create as caseCreate,
  update as caseUpdate,
  remove as caseDelete,
} from "../controllers/CasesController.js";
import {
  show as userShow,
  create as userCreate,
  update as userUpdate,
} from "../controllers/UsersController.js";
import {
  isAuthenticated,
  authenticate as userAuthenticate,
  logout as userLogout,
} from "../controllers/AuthenticationController.js";
import {
  requestToken,
  authenticate as applicationAuthenticate,
} from "../controllers/ApplicationController.js";
import { upload } from "./UserRoutes.js";

const router = Router();

router.use((req, res, next) => {
  if (req.headers["accept"] !== "application/json") {
    req.headers["accept"] = "application/json";
    res.status(406);
    const error = new Error("NOT ACCEPTABLE");
    error.status = 406;
    next(error);
  }

  next();
});
router.post("/authenticate", requestToken);

router.get("/cases", applicationAuthenticate, isAuthenticated, caseIndex);
router.get("/cases/:id", applicationAuthenticate, isAuthenticated, caseShow);
router.post("/cases", applicationAuthenticate, isAuthenticated, caseCreate);
router.put("/cases/:id", applicationAuthenticate, isAuthenticated, caseUpdate);
router.delete(
  "/cases/:id",
  applicationAuthenticate,
  isAuthenticated,
  caseDelete
);

router.get("/users/:id", applicationAuthenticate, isAuthenticated, userShow);
router.post(
  "/users",
  applicationAuthenticate,
  upload.single("avatar"),
  userCreate
);
router.put(
  "/users/:id",
  applicationAuthenticate,
  upload.single("avatar"),
  userUpdate
);
router.post("/users/authenticate", applicationAuthenticate, userAuthenticate);
router.post(
  "/users/logout",
  applicationAuthenticate,
  isAuthenticated,
  userLogout
);

export default router;

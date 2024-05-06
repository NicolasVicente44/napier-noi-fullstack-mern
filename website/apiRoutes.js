import { Router } from "express";
import * as Case from "./facade/controllers/CaseController.js";
import * as User from "./facade/controllers/UsersController.js";

const router = Router();

router.get("/cases", Case.index);
router.get("/cases/:id", Case.show);
router.post("/cases", Case.create);
router.put("/cases/:id", Case.update);
router.delete("/cases/:id", Case.destroy);

router.get("/users/:id", User.show);
router.post("/users", User.create);
router.put("/users/:id", User.update);
router.post("/users/authenticate", User.authenticate);
router.post("/users/logout", User.logout);

export default router;

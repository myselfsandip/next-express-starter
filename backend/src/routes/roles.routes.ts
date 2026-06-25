import { Router } from "express";
import { createRoleController, getAllRolesController, getRoleByIdController, updateRoleController } from "../controllers/roles.controller.js";
import { requireAdmin } from "../middlewares/permisstion.middleware.js";

const router = Router();

router.get("/", getAllRolesController);
router.post("/", requireAdmin, createRoleController);
router.get("/:roleId", getRoleByIdController);
router.patch("/:roleId", requireAdmin, updateRoleController);

export default router;
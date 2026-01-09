import { Router } from "express";
import { createRoleController, getAllRolesController, getRoleByIdController, updateRoleController } from "../controllers/roles.controller";
import { requireAdmin } from "../middlewares/permisstion.middleware";

const router = Router();

router.get("/", getAllRolesController);
router.post("/", requireAdmin, createRoleController);
router.get("/:roleId", getRoleByIdController);
router.patch("/:roleId", requireAdmin, updateRoleController);

export default router;
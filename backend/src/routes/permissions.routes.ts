import { Router } from "express";
import {
    upsertRolePermissionsController,
    getRolePermissionsController,
    setUserPermissionsController,
    getUserPermissionsController,
} from "../controllers/permissions.controller";

const router = Router();

//For Roles
router.get("/roles/:role", getRolePermissionsController);
router.put("/roles/:role", upsertRolePermissionsController);

//For Users Custom Permissions
router.get("/users/:userId", getUserPermissionsController);
router.put("/users/:userId", setUserPermissionsController);


export default router;

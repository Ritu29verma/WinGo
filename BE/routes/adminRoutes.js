import express from "express";
import { registerAdmin, loginAdmin,checkAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/check",checkAdmin)

export default router;
import express from "express";
import {
    getMe,
    getPreferences,
    removeAccount,
    savePreferences,
    updatePassword,
    updateProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/get",protect,getMe);
router.put("/profile", protect, updateProfile);
router.get("/preferences", protect, getPreferences);
router.put("/preferences", protect, savePreferences);
router.put("/change-password",protect,updatePassword);
router.delete("/account",protect,removeAccount);

export default router;

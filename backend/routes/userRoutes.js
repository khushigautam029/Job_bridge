import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getMe,
    removeAccount,
    updatePassword,
    updateProfile,
} from "../controllers/userController.js";


const router = express.Router();


router.get(
    "/me",
    protect,
    getMe
);


router.put(
    "/profile",
    protect,
    updateProfile
);


router.put(
    "/change-password",
    protect,
    updatePassword
);


router.delete(
    "/account",
    protect,
    removeAccount
);


export default router;
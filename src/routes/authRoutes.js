const express = require('express');
const { registerUser, loginUser, getUserProfile, resetPasswordByEmail, enterResetPassword, googleLogin } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserProfile);
router.post("/email-reset-password", resetPasswordByEmail);
router.post("/enter-reset-password", enterResetPassword);
router.post("/google-auth", googleLogin)

module.exports = router;
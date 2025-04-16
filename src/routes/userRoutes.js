const express = require("express");
const { createUser, updateUser, deleteUser } = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createUser); // Thêm người dùng
router.put("/:id", authMiddleware, adminMiddleware, updateUser); // Sửa người dùng
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser); // Xóa người dùng

module.exports = router;
const express = require("express");
const { createUser, updateUser, deleteUser, getAllUsers } = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsers); // Lấy danh sách người dùng
router.post("/", authMiddleware, adminMiddleware, createUser); // Thêm người dùng
router.put("/:id", authMiddleware, adminMiddleware, updateUser); // Sửa người dùng
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser); // Xóa người dùng

module.exports = router;
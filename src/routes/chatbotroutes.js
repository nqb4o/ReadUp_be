const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotcontroller");
const { authMiddleware } = require("../middleware/authMiddleware");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Public endpoint for queries (or use authMiddleware if you want it protected)
router.post("/query", chatbotController.processQuery);

// Protected endpoint for document uploads
router.post("/upload",
  authMiddleware,
  upload.single('document'),
  chatbotController.uploadDocument
);

router.post("/initialize-with-article", chatbotController.initializeWithArticle);

module.exports = router;
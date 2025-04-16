const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Không có token. Truy cập bị từ chối." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Gán thông tin user vào request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ." });
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};
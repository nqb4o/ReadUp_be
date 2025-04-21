const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmailService } = require("../services/sendEmailService")

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Đăng nhập thành công.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err.message);
        res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Kiểm tra đầu vào
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
        }

        // Kiểm tra người dùng đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Chỉ admin mới có thể đăng ký tài khoản với vai trò admin
        const userRole = req.user?.role === "admin" && role === "admin" ? "admin" : "user";

        // Tạo người dùng mới
        const userId = await User.createUser(name, email, passwordHash);

        // Tạo token JWT
        const token = jwt.sign({ id: userId, email, role: "user" }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Phản hồi thành công
        res.status(201).json({
            message: "Đăng ký thành công.",
            token,
            user: { id: userId, name, email, role: userRole },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Lấy userId từ token (đã được gắn vào req.user trong authMiddleware)
        const userId = req.user.id;

        // Truy vấn thông tin người dùng từ database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Trả về thông tin người dùng (ẩn mật khẩu)
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        });
    } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err.message);
        res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
};

exports.resetPasswordByEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại." });
        }
        sendEmailService(user)
        res.status(200).json({ message: 'Reset password link sent successfully.' });

    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

exports.enterResetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Update user's password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Update the user's password
        const updated = await User.updatePassword(userId, passwordHash);
        if (!updated) {
            return res.status(500).json({ message: "Failed to reset password. Please try again later." });
        }

        res.status(200).json({ message: 'Password reset successfully.' });

    } catch (error) {
        console.error('Error handling reset password:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired. Please request a new reset link.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { email, name, sub } = req.body; // sub là Google ID

        if (!email) {
            return res
                .status(400)
                .json({ message: "Failed to retrieve user information from Google." });
        }

        let user = await User.findByEmail(email);
        let userId;
        if (!user) {
            // Nếu người dùng chưa tồn tại, tạo mới
            userId = await User.createUser(name, email, sub);
        } else {
            userId = user.id;
        }

        const appAccessToken = jwt.sign(
            { id: userId, email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Đăng nhập thành công.",
            accessToken: appAccessToken,
            user: { id: userId, name, email, role: user.role },
        });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err.message);
        res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
};
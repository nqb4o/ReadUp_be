const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.createUser(name, email, hashedPassword, role);

        res.status(201).json({ message: "User created successfully.", userId });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const updated = await User.updateUser(id, { name, email, role });
        if (!updated) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await User.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
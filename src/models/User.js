const db = require("../config/db");

class User {
    static async getAllUsers() {
        const [rows] = await db.query("SELECT * FROM users");
        return rows;
    }

    static async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0];
    };

    static async createUser(name, email, passwordHash, role = 'user') {
        const [result] = await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [name, email, passwordHash, role]
        );
        return result.insertId;
    }

    static async updatePassword(id, newPasswordHash) {
        const [result] = await db.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [newPasswordHash, id]
        );
        return result.affectedRows > 0;
    }

    static async updateUser(id, userData) {
        const { name, email, role } = userData;
        const [result] = await db.query(
            "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
            [name, email, role, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteUser(id) {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;

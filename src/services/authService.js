const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password_hash: hashedPassword });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { user, token };
};

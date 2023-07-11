const userSchema = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Register a new user
const register = async (req, res) => {
    const { email, password, name, confirm_password } = req.body;
    try {
        // Check if the username or email already exists
        const existingUser = await userSchema.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        let salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userSchema({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();

        return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};




// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate and return the JWT
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({ message: "Login successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate a reset token and save it to the user's record
        // const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '15m' });
        // user.resetToken = resetToken;

        const resetToken = require('crypto').randomBytes(4).toString("hex");
        console.log(resetToken);
        user.resetToken = resetToken;
        await user.save();

        // Send the password reset email to the user
        // ... (Implement your email sending logic here)

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { email, resetToken, password, confirm_password } = req.body;

    try {
        // Verify and decode the reset token
        // const decodedToken = jwt.verify(resetToken, config.jwtSecret);

        // Find the user by email and reset token
        const user = await userSchema.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // compare token
        const isMatch = await bcrypt.compare(resetToken, user.resetToken);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid token' });
        }


        // Hash the new password
        const hashedPassword = await bcrypt.hash(password);

        // Update the user's password and reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword
};
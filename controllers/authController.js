import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import sendEmail from "../utils/mailer.js";

//! Create an Account
export const signup = (req, res) => {
  const { username, email, password } = req.body;
  const userAgent = req.headers["user-agent"];

  // Check if username or email already exists
  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      const existingUser = results[0];
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email is already registered" });
      }
    }

    // Hash password and save the user
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }

      const insertQuery = `INSERT INTO users (username, email, password, last_login_browser) VALUES (?, ?, ?, ?)`;
      db.query(insertQuery, [username, email, hashedPassword, userAgent], async (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Error creating user" });
        }

        // Generate a JWT token
        const token = jwt.sign(
          { id: result.insertId, email },
          process.env.JWT_SECRET,
          { expiresIn: "10h" }
        );

        try {
          // Send a welcome email
          await sendEmail(email, username, null, "signup");
          return res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: result.insertId, username, email },
          });
        } catch (emailError) {
          return res.status(500).json({
            message: "Signup successful, but email notification failed",
          });
        }
      });
    });
  });
};

//! Log In / already sign in
export const login = (req, res) => {
  const { identifier, password } = req.body;
  console.log(req.body);
  const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
  db.query(query, [identifier, identifier], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Email or username not found" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, async (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      try {
        await sendEmail(
          "Login Successful",
          user.email,
          user.username,
          "You have successfully logged in."
        );
        res.status(200).json({
          message: "Login successful",
          token,
          user: { username: user.username, email: user.email },
        });
      } catch (emailError) {
        res
          .status(500)
          .json({ message: "Login successful, but failed to send email." });
      }
    });
  });
};

export const getMe = (req, res) => {
  const userId = req.user.id; // Should be set by JWT middleware

  const query = `SELECT id, username, email FROM users WHERE id = ?`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: results[0] });
  });
};

// Checking the username / email is already in used or not
export const checkAvailability = (req, res) => {
  const { username, email } = req.body;

  const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.query(query, [username, email], (err, results) => {
    if (err) {
      return res.status(500).json({ field: null, message: "Server error" });
    }

    if (results.length > 0) {
      const existingUser = results[0];
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ field: "username", message: "Username is already taken" });
      }
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ field: "email", message: "Email is already registered" });
      }
    }

    return res.status(200).json({ field: null, message: "Available" });
  });
};

//! Generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const requestPasswordReset = (req, res) => {
  const { email } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    //Generate OTP and expiry time
    const otp = generateOTP();
    const expiryTime = Date.now() + 15 * 60 * 1000; //OTP Valid for 15 Minute

    //Store OTP and Expiry in the database
    const updateQuery = `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?`;
    db.query(updateQuery, [otp, expiryTime, user.id], async (err) => {
      if (err) return res.status(500).json({ message: "Server error" });

      // Send OTP Vai email

      try {
        await sendEmail(email, user.username, otp, "reset");
        res.status(200).json({ message: "OTP sent successfully" });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });
  });
};

// Reset Password - verify OTP and Update password
export const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0)
      return res.status(404).json({ message: "user not found" });

    const user = results[0];

    // Check if OTP is valid
    if (user.reset_token !== otp || user.reset_token_expiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    //Hash the new password

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Server error" });

      //Update the user's password and clear the reset token
      const updateQuery = `UPDATE users SET password= ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`;
      db.query(updateQuery, [hashedPassword, user.id], (err) => {
        if (err)
          return res.status(500).json({ message: "Failed to reset password" });

        res.status(200).json({ message: "Password reset successfully" });
      });
    });
  });
};

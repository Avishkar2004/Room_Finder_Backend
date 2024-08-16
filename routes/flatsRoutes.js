// routes/flatsRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST route to handle form submission
router.post("/", upload.single("photos"), (req, res) => {
  console.log("Form Data:", req.body);
  console.log("File Data:", req.file);
  const {
    size,
    rent,
    lightBill,
    deposits,
    brokerage,
    location,
    contactNumber,
    email,
    contactTime,
    landmark,
    numberOfPeople,
  } = req.body;
  const photos = req.file ? req.file.path : null; // Handle file upload

  // Insert into database
  const query = `INSERT INTO flats (size, rent, light_bill, deposits, brokerage, photos, location, contact_number, email, contact_time, landmark, number_of_people) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    size,
    rent,
    lightBill,
    deposits,
    brokerage,
    photos,
    location,
    contactNumber,
    email,
    contactTime,
    landmark,
    numberOfPeople,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Flat posted successfully" });
  });
});

module.exports = router;

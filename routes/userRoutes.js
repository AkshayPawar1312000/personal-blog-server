const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const DB = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Router Object
const router = express.Router();
router.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST"],
    credentials: true,
  })
);
router.use(cookieParser());

// Create User
router.post("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await DB.query(
      `INSERT INTO users (name, email, password) VALUES(?, ?, ?)`,
      [name, email, hashedPassword]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    // I added this function in data variable not getting a perticaul added user data return
    if (data) {
      const [userData] = await DB.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.cookie("token", token, {
        maxAge: 1440 * 60 * 1000, // 1 day in milliseconds use 
      });
      res.status(201).send({
        success: true,
        message: "New User added successfully",
        data: userData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In  Add User API",
      error: error,
    });
  }
});

//userLogin
router.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email and password is Invalid..",
      });
    }

    const [data] = await DB.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User Not found. Please check Email OR Password ",
      });
    }

    const user = data[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      maxAge: 1440 * 60 * 1000, // 1 day in milliseconds
    });

    res.status(200).send({
      message: "User login Successfully",
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User login API",
      error: error,
    });
  }
});

module.exports = router;

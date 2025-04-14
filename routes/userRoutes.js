import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const validateUser = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phoneNumber")
    .matches(/^\+?[1-9][0-9]{7,14}$/)
    .withMessage("Enter a valid phone number"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("address").notEmpty().withMessage("Please enter the address"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  next();
};

router.post("/", validateUser, handleValidation, async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

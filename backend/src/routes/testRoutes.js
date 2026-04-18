import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

// Only recruiter
router.get("/recruiter", protect, authorizeRoles("recruiter"), (req, res) => {
  res.json({ message: "Welcome Recruiter" });
});

export default router;
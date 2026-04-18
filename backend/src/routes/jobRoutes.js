import express from "express";
import { createJob, getJobs, deleteJob } from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/", getJobs);
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
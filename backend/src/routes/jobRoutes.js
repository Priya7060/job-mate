import express from "express";
import { createJob, getJobs, deleteJob,getMyJobs } from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/", getJobs);
router.get("/my-jobs", protect, authorizeRoles("recruiter"), getMyJobs);
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
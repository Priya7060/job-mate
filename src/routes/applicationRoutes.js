import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicants,
  updateStatus 
} from "../controllers/applicationController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, authorizeRoles("student"), applyToJob);

router.get("/me", protect, authorizeRoles("student"), getMyApplications);

router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getApplicants);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateStatus
);

export default router;
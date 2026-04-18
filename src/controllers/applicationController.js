import Application from "../models/application.js";
import Job from "../models/Job.js";

// APPLY TO JOB (Student only)
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET MY APPLICATIONS (Student)
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate("job");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET APPLICANTS FOR A JOB (Recruiter)
export const getApplicants = async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
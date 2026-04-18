import Job from "../models/job.js";

// CREATE JOB (Recruiter only)
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      createdBy: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE JOB (Recruiter only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
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
    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
      title: { $regex: keyword, $options: "i" }
    });

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

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET MY JOBS (Recruiter only)
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// update job (recruiter only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.log("UPDATE JOB ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
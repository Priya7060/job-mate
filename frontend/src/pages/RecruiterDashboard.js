import { useEffect, useState } from "react";
import API from "../services/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: ""
  });

  const fetchJobs = async () => {
    const res = await API.get("/jobs/my-jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // CREATE JOB
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", form);
      alert("Job posted ✅");
      fetchJobs(); // refresh
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const viewApplicants = async (jobId) => {
  try {
    const res = await API.get(`/applications/job/${jobId}`);
    alert("Check console for applicants");
  } catch (err) {
    alert(err.response?.data?.message);
  }
};

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      {/* JOB FORM */}
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={(e)=>setForm({...form, title:e.target.value})}/>
        <input placeholder="Company" onChange={(e)=>setForm({...form, company:e.target.value})}/>
        <input placeholder="Location" onChange={(e)=>setForm({...form, location:e.target.value})}/>
        <input placeholder="Description" onChange={(e)=>setForm({...form, description:e.target.value})}/>
        <button type="submit">Post Job</button>
      </form>

      {/* JOB LIST */}
      <h2>Your Jobs</h2>

      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <button onClick={() => viewApplicants(job._id)}>
            View Applicants
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecruiterDashboard;
import { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const role = localStorage.getItem("role");

  const searchJobs = async () => {
    const res = await API.get(`/jobs?keyword=${keyword}`);
    setJobs(res.data);
  };

  const fetchApplied = async () => {
    try {
      const res = await API.get("/applications/me");
      const ids = res.data.map((app) => app.job._id.toString());
      setAppliedJobs(ids);
    } catch (err) {
      console.log("Error fetching applied jobs:", err);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get("/jobs");
      setJobs(res.data);
    };
    fetchJobs();

    // sirf student ke liye applied jobs fetch karo
    if (role === "student") {
      fetchApplied();
    }
  }, []);

  const applyJob = async (jobId) => {
    // recruiter ko apply nahi karne denge
    if (role === "recruiter") {
      alert("Recruiters cannot apply for jobs!");
      return;
    }

    try {
      setLoadingId(jobId);
      await API.post(`/applications/${jobId}`);
      alert("Applied successfully");
      setAppliedJobs((prev) => [...prev, jobId.toString()]);
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1>Jobs</h1>

      <input
        placeholder="Search jobs..."
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={searchJobs}>Search</button>

      {jobs.length === 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          No jobs found 😢
        </p>
      ) : (
        <div>
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id.toString());
            const isLoading = loadingId === job._id;

            return (
              <div key={job._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>{job.location}</p>

                {role === "recruiter" ? (
                  <button disabled>Only students can apply</button>
                ) : isApplied ? (
                  <button disabled>Applied ✅</button>
                ) : (
                  <button onClick={() => applyJob(job._id)} disabled={isLoading}>
                    {isLoading ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
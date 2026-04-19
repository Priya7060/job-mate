import { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const searchJobs = async () => {
    const res = await API.get(`/jobs?keyword=${keyword}`);
    setJobs(res.data);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get("/jobs");
      setJobs(res.data);
    };
    fetchJobs();
    fetchApplied();
  }, []);

  const applyJob = async (jobId) => {
    try {
     console.log("Applying job:",jobId);

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

  const fetchApplied = async () => {
    const res = await API.get("/applications/me");
    const ids = res.data.map(app => app.job._id);
    setAppliedJobs(ids);
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

              console.log("Current job:", job._id);
  console.log("Applied jobs:", appliedJobs);

            const isApplied = appliedJobs.includes(job._id.toString()); 
            const isLoading = loadingId === job._id;

            return (
              <div key={job._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>{job.location}</p>

                {isApplied ? (
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
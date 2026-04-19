import { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");

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
  }, []);

  return (
    <div>
      <h1>Jobs</h1>

      {/* Search */}
      <input
        placeholder="Search jobs..."
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={searchJobs}>Search</button>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          No jobs found 😢
        </p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
          >
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
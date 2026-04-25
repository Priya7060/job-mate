import { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      try {
        setLoading(true);
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
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
  if (loading) return <h2>Loading jobs...</h2>;
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1>Jobs</h1>

      <div className="flex gap-4 mb-8">

        <input
          className="border p-3 rounded w-full"
          placeholder="Search jobs..."
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          onClick={searchJobs}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Search
        </button>

      </div>

      {jobs.length === 0 ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          <h2>No Jobs Found 🔍</h2>
        </p>
      ) : (
        <div>
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id.toString());
            const isLoading = loadingId === job._id;

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-md p-6 mb-6"
              >
                <h2>{job.title}</h2>

                <p>
                  <strong>Company:</strong> {job.company}
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Description:</strong> {job.description}
                </p>

                {isApplied ? (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg"
                  >
                    Applied ✓
                  </button>
                ) : (
                  <button
                    onClick={() => applyJob(job._id)}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    Apply
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
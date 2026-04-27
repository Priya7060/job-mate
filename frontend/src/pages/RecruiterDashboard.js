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
  const [applicants, setApplicants] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const fetchJobs = async () => {
    const res = await API.get("/jobs/my-jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", form);
      setForm({ title: "", company: "", location: "", description: "" });
      alert("Job posted ✅");
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      if (!window.confirm("Delete this job?")) return;
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("Job deleted");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // ✅ NEW: start editing — populate form with existing data
  const startEdit = (job) => {
    setEditingJob(job._id);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description
    });
  };

  // ✅ NEW: send PUT request and update UI
  const updateJob = async () => {
    try {
      await API.put(`/jobs/${editingJob}`, editForm);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === editingJob ? { ...job, ...editForm } : job
        )
      );
      setEditingJob(null);
      alert("Job updated ✅");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">Recruiter Dashboard</h1>

      {/* POST JOB FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 mb-10 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Post New Job</h2>
        <input
          value={form.title}
          placeholder="Title"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          value={form.company}
          placeholder="Company"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          value={form.location}
          placeholder="Location"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          value={form.description}
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Post Job
        </button>
      </form>

      {/* JOBS LIST */}
      <h2 className="text-2xl font-semibold mb-5">Your Jobs</h2>

      {jobs.map((job) => (
        <div key={job._id} className="bg-white shadow rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p className="text-gray-600 mb-4">{job.company} • {job.location}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => viewApplicants(job._id)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              View Applicants
            </button>

            {/* ✅ NEW button */}
            <button
              onClick={() => startEdit(job)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Edit Job
            </button>

            <button
              onClick={() => deleteJob(job._id)}
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Delete Job
            </button>
          </div>
        </div>
      ))}

      {/* APPLICANTS */}
      <h2 className="text-2xl font-semibold mt-10 mb-6">Applicants</h2>

      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet</p>
      ) : (
        applicants.map((app) => (
          <div key={app._id} className="bg-white shadow p-6 rounded-2xl mb-5">
            <h3 className="text-xl font-bold">{app.applicant.name}</h3>
            <p className="text-gray-600">{app.applicant.email}</p>
            <p className="mt-3">
              Status:
              <span className="ml-2 text-blue-600 font-semibold">{app.status}</span>
              {app.status === "pending" && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              )}
            </p>
          </div>
        ))
      )}

      {/* ✅ NEW: Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px] space-y-4">
            <h2 className="text-2xl font-bold">Edit Job</h2>
            <input
              value={editForm.title}
              placeholder="Title"
              className="w-full border p-3 rounded"
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <input
              value={editForm.company}
              placeholder="Company"
              className="w-full border p-3 rounded"
              onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
            />
            <input
              value={editForm.location}
              placeholder="Location"
              className="w-full border p-3 rounded"
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            />
            <textarea
              value={editForm.description}
              placeholder="Description"
              className="w-full border p-3 rounded"
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <div className="flex gap-4">
              <button
                onClick={updateJob}
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingJob(null)}
                className="bg-gray-500 text-white px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterDashboard;
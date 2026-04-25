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
      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
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

  return (
<div className="max-w-6xl mx-auto p-8">

<h1 className="text-4xl font-bold mb-8">
Recruiter Dashboard
</h1>


{/* POST JOB FORM */}
<form
onSubmit={handleSubmit}
className="bg-white shadow-lg rounded-2xl p-8 mb-10 space-y-4"
>

<h2 className="text-2xl font-semibold">
Post New Job
</h2>

<input
placeholder="Title"
className="w-full border p-3 rounded-lg"
onChange={(e)=>
setForm({...form,title:e.target.value})
}
/>

<input
placeholder="Company"
className="w-full border p-3 rounded-lg"
onChange={(e)=>
setForm({...form,company:e.target.value})
}
/>

<input
placeholder="Location"
className="w-full border p-3 rounded-lg"
onChange={(e)=>
setForm({...form,location:e.target.value})
}
/>

<textarea
placeholder="Description"
className="w-full border p-3 rounded-lg"
onChange={(e)=>
setForm({...form,description:e.target.value})
}
/>

<button
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Post Job
</button>

</form>



{/* JOBS SECTION */}
<h2 className="text-2xl font-semibold mb-5">
Your Jobs
</h2>


{jobs.map((job)=>(
<div
key={job._id}
className="bg-white shadow rounded-2xl p-6 mb-6"
>

<h3 className="text-xl font-bold">
{job.title}
</h3>

<p className="text-gray-600 mb-4">
{job.company} • {job.location}
</p>

<button
onClick={()=>viewApplicants(job._id)}
className="bg-green-600 text-white px-5 py-2 rounded-lg"
>
View Applicants
</button>

</div>
))}



{/* APPLICANTS */}
<h2 className="text-2xl font-semibold mt-10 mb-6">
Applicants
</h2>


{applicants.length===0 ? (
<p className="text-gray-500">
No applicants yet
</p>
) : (

applicants.map((app)=>(
<div
key={app._id}
className="bg-white shadow p-6 rounded-2xl mb-5"
>

<h3 className="text-xl font-bold">
{app.applicant.name}
</h3>

<p className="text-gray-600">
{app.applicant.email}
</p>

<p className="mt-3">
Status:
<span className="ml-2 text-blue-600 font-semibold">
{app.status}
</span>
</p>

</div>
))
)}

</div>
);

};

export default RecruiterDashboard;
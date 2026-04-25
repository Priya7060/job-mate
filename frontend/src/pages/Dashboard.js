import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchApps = async () => {

      try {
        const res = await API.get("/applications/me");
        setApps(res.data);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }

    };

    fetchApps();

  }, []);



  if (loading) {
    return (
      <div className="text-center mt-20 text-2xl">
        Loading Applications...
      </div>
    )
  }



  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Applications
      </h1>


      {apps.length === 0 ? (

        <div className="bg-white shadow rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            No Applications Yet
          </h2>

          <p className="text-gray-500">
            Apply to jobs from home page.
          </p>
        </div>

      ) : (

        apps.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-lg rounded-2xl p-6 mb-6"
          >

            <h2 className="text-2xl font-bold">
              {app.job.title}
            </h2>

            <p className="text-gray-600 mt-2">
              Company: {app.job.company}
            </p>

            <p className="text-gray-600">
              Location: {app.job.location}
            </p>

            <div className="mt-4">

              Status:
              <span
                className={`ml-2 px-3 py-1 rounded-full font-medium
                    ${app.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {app.status}
              </span>

            </div>

          </div>
        ))

      )}

    </div>
  )

}

export default Dashboard;
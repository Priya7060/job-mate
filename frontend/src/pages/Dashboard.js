import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const res = await API.get("/applications/me");
      setApps(res.data);
    };

    fetchApps();
  }, []);

  return (
    <div>
      <h1>My Applications</h1>

      {apps.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        apps.map((app) => (
          <div key={app._id}>
            <h3>{app.job.title}</h3>
            <p>Status: {app.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
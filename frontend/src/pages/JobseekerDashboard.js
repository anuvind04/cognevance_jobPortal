import React, { useState, useEffect } from "react";
import API from "../api";

function JobseekerDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    API.get("/my-applications/").then((res) => setApplications(res.data));
  }, []);

  const statusBadge = (status) => {
    const map = {
      applied: "badge-blue",
      reviewing: "badge-yellow",
      accepted: "badge-green",
      rejected: "badge-red",
    };
    return <span className={`badge ${map[status]}`}>{status}</span>;
  };

  return (
    <div>
      <h2>My Applications</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Track the status of jobs you've applied to
      </p>

      {applications.map((app) => (
        <div className="card" key={app.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>{app.job_title}</h3>
            {statusBadge(app.status)}
          </div>
          <p style={{ color: "#666", marginTop: "6px" }}>
            Applied on {new Date(app.applied_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      {applications.length === 0 && (
        <p>You haven't applied to any jobs yet. Go browse jobs!</p>
      )}
    </div>
  );
}

export default JobseekerDashboard;

import React, { useState, useEffect } from "react";
import API from "../api";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);

  const fetchMyJobs = async () => {
    const res = await API.get("/jobs/");
    const user = JSON.parse(localStorage.getItem("user"));
    setJobs(res.data.filter((j) => j.employer_name === user.username));
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const viewApplications = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    const res = await API.get(`/jobs/${jobId}/applications/`);
    setApplications({ ...applications, [jobId]: res.data });
    setExpandedJob(jobId);
  };

  const updateStatus = async (appId, status, jobId) => {
    await API.patch(`/applications/${appId}/`, { status });
    const res = await API.get(`/jobs/${jobId}/applications/`);
    setApplications({ ...applications, [jobId]: res.data });
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job posting?")) return;
    await API.delete(`/jobs/${jobId}/`);
    fetchMyJobs();
  };

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
      <h2>Employer Dashboard</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Manage your job postings and applicants
      </p>

      {jobs.map((job) => (
        <div className="card" key={job.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              <h3>{job.title}</h3>
              <p>
                {job.company} · {job.location}
              </p>
              <span className="badge badge-blue">{job.job_type}</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => viewApplications(job.id)}
                className="btn btn-primary"
              >
                {expandedJob === job.id ? "Hide" : "View"} Applicants
              </button>
              <button
                onClick={() => deleteJob(job.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>

          {expandedJob === job.id && (
            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid #eee",
                paddingTop: "16px",
              }}
            >
              <h4>Applicants ({applications[job.id]?.length || 0})</h4>
              {applications[job.id]?.length === 0 && (
                <p>No applications yet.</p>
              )}
              {applications[job.id]?.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: "#f9fafb",
                    padding: "12px",
                    borderRadius: "6px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{app.applicant_name}</strong>
                    {statusBadge(app.status)}
                  </div>
                  <p style={{ marginTop: "6px", color: "#666" }}>
                    {app.cover_letter}
                  </p>
                  <div
                    style={{ marginTop: "8px", display: "flex", gap: "8px" }}
                  >
                    <button
                      onClick={() => updateStatus(app.id, "reviewing", job.id)}
                      className="btn"
                      style={{
                        background: "#fef9c3",
                        color: "#854d0e",
                        padding: "6px 12px",
                        fontSize: "12px",
                      }}
                    >
                      Reviewing
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "accepted", job.id)}
                      className="btn btn-success"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected", job.id)}
                      className="btn btn-danger"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {jobs.length === 0 && (
        <p>You haven't posted any jobs yet. Click "Post Job" in the navbar!</p>
      )}
    </div>
  );
}

export default EmployerDashboard;

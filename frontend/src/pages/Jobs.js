import React, { useState, useEffect } from "react";
import API from "../api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchJobs = async () => {
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.job_type = jobType;
    const res = await API.get("/jobs/", { params });
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyToJob = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/apply/`, {
        cover_letter: "I am interested in this position.",
      });
      alert("Applied successfully!");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to apply. Make sure you are logged in as a jobseeker.",
      );
    }
  };

  return (
    <div>
      <h2>Browse Jobs</h2>
      <div
        className="card"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <input
          placeholder="Search by title/company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>
        <button onClick={fetchJobs} className="btn btn-primary">
          Search
        </button>
      </div>

      <div className="grid">
        {jobs.map((job) => (
          <div className="card" key={job.id}>
            <h3>{job.title}</h3>
            <p>
              <strong>{job.company}</strong> · {job.location}
            </p>
            <span className="badge badge-blue">{job.job_type}</span>
            {job.salary && <p style={{ marginTop: "8px" }}>💰 {job.salary}</p>}
            <p style={{ marginTop: "10px", color: "#666" }}>
              {job.description.slice(0, 100)}...
            </p>
            {user && user.role === "jobseeker" && (
              <button
                onClick={() => applyToJob(job.id)}
                className="btn btn-success"
                style={{ marginTop: "10px" }}
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
        {jobs.length === 0 && <p>No jobs found.</p>}
      </div>
    </div>
  );
}

export default Jobs;

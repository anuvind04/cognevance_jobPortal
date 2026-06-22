import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function PostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time",
    salary: "",
    description: "",
    requirements: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs/", form);
      navigate("/employer-dashboard");
    } catch (err) {
      setError(
        "Failed to post job. " + JSON.stringify(err.response?.data || ""),
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card">
        <h2>Post a New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Type</label>
            <select
              value={form.job_type}
              onChange={(e) => setForm({ ...form, job_type: e.target.value })}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Salary (optional)</label>
            <input
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="e.g. $50,000 - $70,000"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Requirements</label>
            <textarea
              rows="4"
              value={form.requirements}
              onChange={(e) =>
                setForm({ ...form, requirements: e.target.value })
              }
              required
            ></textarea>
          </div>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;

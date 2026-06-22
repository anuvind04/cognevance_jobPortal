import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#4f46e5",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
          textDecoration: "none",
        }}
      >
        🏢 JobPortal
      </Link>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Jobs
        </Link>
        {!user ? (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "employer" ? (
              <>
                <Link
                  to="/employer-dashboard"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/post-job"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Post Job
                </Link>
              </>
            ) : (
              <Link
                to="/jobseeker-dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                Dashboard
              </Link>
            )}
            <span style={{ color: "white" }}>Hi, {user.username}!</span>
            <button
              onClick={logout}
              className="btn"
              style={{ background: "white", color: "#4f46e5" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

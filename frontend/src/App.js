import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import PostJob from "./pages/PostJob";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  return localStorage.getItem("access") ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/employer-dashboard"
            element={
              <PrivateRoute>
                <EmployerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobseeker-dashboard"
            element={
              <PrivateRoute>
                <JobseekerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <PrivateRoute>
                <PostJob />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

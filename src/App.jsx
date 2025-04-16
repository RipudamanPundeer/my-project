import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppNavbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import AllResultsPage from "./pages/AllResultsPage";
import Profile from "./pages/Profile";
import CodeTest from "./components/CodeTest";
import { useContext } from "react";
import CodingProblems from "./pages/CodingProblems";
import CodingProblem from "./pages/CodingProblem";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyJobs from "./pages/CompanyJobs";
import NewJob from "./pages/NewJob";
import Applications from "./pages/Applications";
import CompanyProfile from "./pages/CompanyProfile";

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  // If a specific role is required, check for it
  if (requiredRole && user.role !== requiredRole) {
    // Redirect candidates to candidate dashboard and companies to company dashboard
    return <Navigate to={user.role === 'company' ? "/company/dashboard" : "/dashboard"} />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Candidate Routes */}
          <Route path="/home" element={<ProtectedRoute requiredRole="candidate"><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="candidate"><Dashboard /></ProtectedRoute>} />
          <Route path="/test/:id" element={<ProtectedRoute requiredRole="candidate"><TestPage /></ProtectedRoute>} />
          <Route path="/results/:id" element={<ProtectedRoute requiredRole="candidate"><ResultsPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute requiredRole="candidate"><AllResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/code-test" element={<ProtectedRoute requiredRole="candidate"><CodeTest /></ProtectedRoute>} />
          <Route path="/coding-problems" element={<ProtectedRoute requiredRole="candidate"><CodingProblems /></ProtectedRoute>} />
          <Route path="/coding-problem/:id" element={<ProtectedRoute requiredRole="candidate"><CodingProblem /></ProtectedRoute>} />

          {/* Company Routes */}
          <Route path="/company">
            <Route path="dashboard" element={<ProtectedRoute requiredRole="company"><CompanyDashboard /></ProtectedRoute>} />
            <Route path="jobs" element={<ProtectedRoute requiredRole="company"><CompanyJobs /></ProtectedRoute>} />
            <Route path="jobs/new" element={<ProtectedRoute requiredRole="company"><NewJob /></ProtectedRoute>} />
            <Route path="jobs/edit/:id" element={<ProtectedRoute requiredRole="company"><NewJob /></ProtectedRoute>} />
            <Route path="applications" element={<ProtectedRoute requiredRole="company"><Applications /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute requiredRole="company"><CompanyProfile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

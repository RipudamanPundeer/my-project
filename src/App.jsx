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
import { useContext } from "react";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; //  Wait for AuthContext to load user

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (

    <Router> {/* Wrap everything inside Router here */}
      <AuthProvider>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/test/:id" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
          <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><AllResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;

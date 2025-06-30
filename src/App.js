// Routing setup
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainApp from "./MainApp";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
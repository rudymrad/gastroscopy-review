// src/MainApp.js
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";
import aubLogo from "./assets/aub.png";
import aubmcLogo from "./assets/aubmc.png";

export default function MainApp() {
  const [user, setUser] = useState({ name: "", workplace: "", country: "", level: "" });
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4"
  ];

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setStarted(true);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      ...user,
      videoIndex: currentIndex + 1,
      hiatalHerniaPresent: form.get("hh_present"),
      hhSeverity: form.get("hh_severity"),
      erosiveEsophagitisPresent: form.get("ee_present"),
      eeSeverity: form.get("ee_severity"),
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "gastroscopy_reviews"), data);
      e.target.reset();
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  return (
    <>
      <header>
        <img src={aubLogo} alt="AUB Logo" className="logo" />
        <img src={aubmcLogo} alt="AUBMC Logo" className="logo" />
      </header>

      <div className="container">
        {!started ? (
          <>
            <h2>Enter Your Info</h2>
            <form onSubmit={handleUserSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={user.name}
                required
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Workplace"
                value={user.workplace}
                required
                onChange={(e) => setUser({ ...user, workplace: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={user.country}
                required
                onChange={(e) => setUser({ ...user, country: e.target.value })}
              />
              <select
                required
                value={user.level}
                onChange={(e) => setUser({ ...user, level: e.target.value })}
              >
                <option value="">Select Expertise Level</option>
                <option>Medical Student</option>
                <option>Resident</option>
                <option>Fellow</option>
                <option>Attending</option>
              </select>
              <button type="submit">Start Review</button>
            </form>
          </>
        ) : currentIndex < videos.length ? (
          <>
            <h2>Video {currentIndex + 1} of {videos.length}</h2>
            <video src={videos[currentIndex]} controls width="100%" />
            <form onSubmit={handleAnswerSubmit}>
              <h3>Hiatal Hernia Present?</h3>
              <select name="hh_present" required>
                <option value="">-- Select --</option>
                <option>Yes</option>
                <option>No</option>
              </select>

              <h3>HH Severity:</h3>
              <select name="hh_severity" required>
                <option value="">-- Select --</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
              </select>

              <h3>Erosive Esophagitis Present?</h3>
              <select name="ee_present" required>
                <option value="">-- Select --</option>
                <option>Yes</option>
                <option>No</option>
              </select>

              <h3>EE Severity:</h3>
              <select name="ee_severity" required>
                <option value="">-- Select --</option>
                <option>LA A</option>
                <option>LA B</option>
                <option>LA C</option>
                <option>LA D</option>
              </select>

              <button type="submit">Submit</button>
            </form>
          </>
        ) : (
          <h2>✅ All videos reviewed. Thank you!</h2>
        )}
      </div>

      {/* 🔒 Discreet Admin Button */}
      <button
        onClick={() => window.location.href = "/dashboard"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "transparent",
          border: "none",
          color: "maroon",
          opacity: 0.5,
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        Admin
      </button>
    </>
  );
}
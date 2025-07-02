import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";
import aubLogo from "./assets/aub.png";
import aubmcLogo from "./assets/aubmc.png";

export default function MainApp() {
  const [user, setUser] = useState({ name: "", workplace: "", country: "", level: "" });
  const [started, setStarted] = useState(false);
  const [formStates, setFormStates] = useState({});

  // Array of 23 video sources and titles
  const videos = [
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+1.mp4", title: "Patient 1" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+2.mp4", title: "Patient 2" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+3.mp4", title: "Patient 3" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+4.mp4", title: "Patient 4" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+5.mp4", title: "Patient 5" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+6.mp4", title: "Patient 6" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+7.mp4", title: "Patient 7" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+8.mp4", title: "Patient 8" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+9.mp4", title: "Patient 9" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+10.mp4", title: "Patient 10" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+11.mp4", title: "Patient 11" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+12.mp4", title: "Patient 12" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+13.mp4", title: "Patient 13" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+14.mp4", title: "Patient 14" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+15.mp4", title: "Patient 15" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+16.mp4", title: "Patient 16" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+17.mp4", title: "Patient 17" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+18.mp4", title: "Patient 18" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+19.mp4", title: "Patient 19" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+20.mp4", title: "Patient 20" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+21.mp4", title: "Patient 21" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+22.mp4", title: "Patient 22" },
    { src: "https://gastroscopy-videos.s3.eu-north-1.amazonaws.com/Patient+23.mp4", title: "Patient 23" },
  ];

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setStarted(true);
  };

  // Handle form changes to keep controlled dropdowns visibility per form
  const handleChange = (index, field, value) => {
    setFormStates((prev) => {
      const updated = { ...prev };
      if (!updated[index]) updated[index] = {};
      updated[index][field] = value;

      // Reset dependent fields if parent field changed
      if (field === "hh_present" && value === "No") {
        updated[index]["hh_grade"] = "";
      }
      if (field === "ee_present" && value === "No") {
        updated[index]["ee_severity"] = "";
      }

      return updated;
    });
  };

  const handleAnswerSubmit = async (e, index) => {
    e.preventDefault();
    const formData = formStates[index] || {};

    const data = {
      ...user,
      videoIndex: index + 1,
      hiatalHerniaPresent: formData.hh_present || "",
      hhGrade: formData.hh_grade || "",
      erosiveEsophagitisPresent: formData.ee_present || "",
      eeSeverity: formData.ee_severity || "",
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "gastroscopy_reviews"), data);
      setFormStates((prev) => ({ ...prev, [index]: {} }));
      e.target.reset();
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#811331",
          padding: "16px 32px",
        }}
      >
        <img src={aubLogo} alt="AUB Logo" className="logo" />
        <h1
          style={{
            color: "white",
            flexGrow: 1,
            textAlign: "center",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Concordance of assessment of hiatal hernia and erosive esophagitis on
          upper endoscopy among gastroenterology specialists
        </h1>
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
              <select
                required
                value={user.country}
                onChange={(e) => setUser({ ...user, country: e.target.value })}
              >
                <option value="">Select Country</option>
                <option>Lebanon</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>France</option>
                <option>Germany</option>
                <option>India</option>
                <option>China</option>
                <option>Japan</option>
                <option>Other</option>
              </select>
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
        ) : (
          <div>
            {videos.map((video, index) => (
              <div key={index} style={{ marginBottom: 48 }}>
                <h2 style={{ color: "#811331" }}>{video.title}</h2>
                <video
                  src={video.src}
                  controls
                  width="100%"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                    marginBottom: 16,
                  }}
                />
                <form onSubmit={(e) => handleAnswerSubmit(e, index)}>
                  <h3>Hiatal Hernia Present?</h3>
                  <select
                    name="hh_present"
                    required
                    value={formStates[index]?.hh_present || ""}
                    onChange={(e) =>
                      handleChange(index, "hh_present", e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  {formStates[index]?.hh_present === "Yes" && (
                    <>
                      <h3>Grade of Hiatal Hernia</h3>
                      <select
                        name="hh_grade"
                        required
                        value={formStates[index]?.hh_grade || ""}
                        onChange={(e) =>
                          handleChange(index, "hh_grade", e.target.value)
                        }
                      >
                        <option value="">-- Select Grade --</option>
                        <option>
                          I Sliding hernia
                        </option>
                        <option>
                          II Gastric fundus has herniated superior to gastroesophageal junction (GEJ)—GEJ remains in normal position
                        </option>
                        <option>
                          III Combination of type I and type II—GEJ herniates together with stomach
                        </option>
                        <option>
                          IV Includes type II and type III, with the addition of either colon, small bowel, pancreas or spleen in the hernia sac
                        </option>
                      </select>
                    </>
                  )}

                  <h3>Erosive Esophagitis Present?</h3>
                  <select
                    name="ee_present"
                    required
                    value={formStates[index]?.ee_present || ""}
                    onChange={(e) =>
                      handleChange(index, "ee_present", e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  {formStates[index]?.ee_present === "Yes" && (
                    <>
                      <h3>EE Severity:</h3>
                      <select
                        name="ee_severity"
                        required
                        value={formStates[index]?.ee_severity || ""}
                        onChange={(e) =>
                          handleChange(index, "ee_severity", e.target.value)
                        }
                      >
                        <option value="">-- Select --</option>
                        <option>LA A</option>
                        <option>LA B</option>
                        <option>LA C</option>
                        <option>LA D</option>
                      </select>
                    </>
                  )}

                  <button
                    type="submit"
                    style={{
                      marginTop: 12,
                      backgroundColor: "#811331",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            ))}

            <h2
              style={{ color: "#811331", textAlign: "center", marginTop: 24 }}
            >
              ✅ All videos reviewed. Thank you!
            </h2>
          </div>
        )}
      </div>

      {/* 🔒 Discreet Admin Button */}
      <button
        onClick={() => (window.location.href = "/dashboard")}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "transparent",
          border: "none",
          color: "maroon",
          opacity: 0.5,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Admin
      </button>
    </>
  );
}
// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Papa from "papaparse";
import "./Dashboard.css";

export default function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "rudy123") {
      setAuthorized(true);
    } else {
      alert("Incorrect password.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "gastroscopy_reviews"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
    };

    if (authorized) {
      fetchData();
    }
  }, [authorized]);

  const exportCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "gastroscopy_responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!authorized) {
    return (
      <div className="dashboard-login">
        <h2>Enter Password to Access Submissions</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Gastroscopy Review Submissions</h2>
      <button onClick={exportCSV} className="export-button">
        Export to CSV
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Workplace</th>
            <th>Country</th>
            <th>Level</th>
            <th>Video</th>
            <th>HH?</th>
            <th>HH Severity</th>
            <th>EE?</th>
            <th>EE Severity</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.workplace}</td>
              <td>{entry.country}</td>
              <td>{entry.level}</td>
              <td>{entry.videoIndex}</td>
              <td>{entry.hiatalHerniaPresent}</td>
              <td>{entry.hhSeverity}</td>
              <td>{entry.erosiveEsophagitisPresent}</td>
              <td>{entry.eeSeverity}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
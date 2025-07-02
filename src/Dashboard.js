import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Papa from "papaparse";
import "./Dashboard.css";

export default function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

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

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      // Handle date sorting for timestamp
      if (sortConfig.key === "timestamp") {
        return sortConfig.direction === "ascending"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      // Handle numbers vs strings
      if (!isNaN(aVal) && !isNaN(bVal)) {
        return sortConfig.direction === "ascending" ? aVal - bVal : bVal - aVal;
      }

      // Default string comparison, case insensitive
      return sortConfig.direction === "ascending"
        ? aVal.toString().localeCompare(bVal.toString(), undefined, { sensitivity: "base" })
        : bVal.toString().localeCompare(aVal.toString(), undefined, { sensitivity: "base" });
    });

    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "▲" : "▼";
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
      <button onClick={exportCSV} className="export-button" style={{ marginBottom: "12px" }}>
        Export to CSV
      </button>

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort("name")} style={{ cursor: "pointer" }}>
              Name {getSortIndicator("name")}
            </th>
            <th onClick={() => requestSort("workplace")} style={{ cursor: "pointer" }}>
              Workplace {getSortIndicator("workplace")}
            </th>
            <th onClick={() => requestSort("country")} style={{ cursor: "pointer" }}>
              Country {getSortIndicator("country")}
            </th>
            <th onClick={() => requestSort("level")} style={{ cursor: "pointer" }}>
              Level {getSortIndicator("level")}
            </th>
            <th onClick={() => requestSort("videoIndex")} style={{ cursor: "pointer" }}>
              Video {getSortIndicator("videoIndex")}
            </th>
            <th onClick={() => requestSort("hiatalHerniaPresent")} style={{ cursor: "pointer" }}>
              HH? {getSortIndicator("hiatalHerniaPresent")}
            </th>
            <th onClick={() => requestSort("hhType")} style={{ cursor: "pointer" }}>
              HH Type {getSortIndicator("hhType")}
            </th>
            <th onClick={() => requestSort("erosiveEsophagitisPresent")} style={{ cursor: "pointer" }}>
              EE? {getSortIndicator("erosiveEsophagitisPresent")}
            </th>
            <th onClick={() => requestSort("eeSeverity")} style={{ cursor: "pointer" }}>
              EE Severity {getSortIndicator("eeSeverity")}
            </th>
            <th onClick={() => requestSort("timestamp")} style={{ cursor: "pointer" }}>
              Time {getSortIndicator("timestamp")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.workplace}</td>
              <td>{entry.country}</td>
              <td>{entry.level}</td>
              <td>{entry.videoIndex}</td>
              <td>{entry.hiatalHerniaPresent}</td>
              <td>{entry.hhType}</td>
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
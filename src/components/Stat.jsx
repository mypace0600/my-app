// /src/components/Stat.jsx

import { useEffect, useState } from "react";
import { getStatistics } from "../services/api"; // 서비스 함수
import "../css/base.css";
import "../css/stat.css";

const Stat = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStatistics();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        alert("Failed to load your statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading your stats...</div>;
  if (!stats) return <div>No statistics available.</div>;

  return (
    <div className="stat-container">
      <h1>Your Statistics</h1>
      <ul className="stat-list">
        <li>
          ✅ Solved Quizzes: <strong>{stats.solvedCount}</strong>
        </li>
        <li>
          📈 Accuracy: <strong>{stats.correctRate.toFixed(1)}%</strong>
        </li>
        <li>
          🏅 You’re in the <strong>Top {stats.percentile.toFixed(1)}%</strong>{" "}
          of all players
        </li>
      </ul>
    </div>
  );
};

export default Stat;

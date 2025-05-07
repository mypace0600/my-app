// /src/components/Stat.jsx

import { useEffect, useState } from "react";
import { getStatistics } from "../services/api";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";
import "../css/base.css";
import "../css/stat.css";

const Stat = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStatistics();
        console.log(response);
        setStats(response.data.data);
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
      <CustomHeader />
      <ul className="stat-list">
        <li>
          ✅ Solved Quizzes: <strong>{stats.solvedCount}</strong>
        </li>
        <li>
          🏆 Top <strong>{stats.percentile.toFixed(1)}%</strong> of all users
        </li>
      </ul>

      <CustomFooter />
    </div>
  );
};

export default Stat;

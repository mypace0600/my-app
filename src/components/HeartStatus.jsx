// /components/HeartStatus.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  return `${m}`;
};

const HeartStatus = () => {
  const { user } = useAuth();
  const [remainingSeconds, setRemainingSeconds] = useState(
    user?.secondsUntilNextHeart || 0
  );

  console.log(user);

  useEffect(() => {
    setRemainingSeconds(user.data?.secondsUntilNextHeart || 0);
  }, [user]);

  useEffect(() => {
    if (remainingSeconds <= 0 || (user.data?.currentHearts ?? 3) >= 3) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, user]);

  if (!user) return null;

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <span>❤️ {user.data.currentHearts}/3</span>
      {user.data.currentHearts < 3 && (
        <span style={{ fontSize: "0.9em", color: "#888" }}>
          next ❤️ {formatTime(remainingSeconds)}
        </span>
      )}
    </div>
  );
};

export default HeartStatus;

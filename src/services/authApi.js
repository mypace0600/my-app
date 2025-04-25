// services/authApi.js

export const fetchCurrentUser = async () => {
  try {
    const res = await fetch("https://api.hyeonsu-side.com/api/auth/me", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함!
    });

    if (!res.ok) return null;

    const data = await res.json();
    // 현재 날짜와 시간을 "yyyy-MM-dd HH:mm:ss" 형식으로 포맷
    const formattedDate = new Date().toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24시간 형식
    });

    console.log(formattedDate, data);
    return data; // { email: "...", isAdmin: true, score: 100 }
  } catch (err) {
    console.error("유저 정보 가져오기 실패:", err);
    return null;
  }
};

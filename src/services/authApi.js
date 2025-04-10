// services/authApi.js

export const fetchCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함!
    });

    if (!res.ok) return null;

    const data = await res.json();
    console.log(data);
    return data; // { email: "...", isAdmin: true, score: 100 }
  } catch (err) {
    console.error("유저 정보 가져오기 실패:", err);
    return null;
  }
};

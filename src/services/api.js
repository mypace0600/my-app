import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request URL:", config.url);
    console.log("Request Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("401 에러 발생:", error.response);
      // 토큰 갱신 API 호출 (예시)
      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {
            token: localStorage.getItem("token"),
          }
        );
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config); // 원래 요청 재시도
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
// 기존 퀴즈 플레이 관련 API
export const startQuiz = () => api.post("/quiz/start");
export const submitAnswer = (quizId, answer) =>
  api.post("/quiz/submit", { quizId, answer });

// Admin 퀴즈 관리 API
export const getQuizList = (page = 0, size = 10) =>
  api
    .get("/admin/quiz/list", { params: { page, size } })
    .then((res) => res.data);
export const createQuiz = (quizData) =>
  api.post("/admin/quiz/create", quizData);
export const updateQuiz = (id, quizData) =>
  api.put(`/admin/quiz/update/${id}`, quizData);
export const deleteQuiz = (id) => api.delete(`/admin/quiz/delete/${id}`);
export default api;

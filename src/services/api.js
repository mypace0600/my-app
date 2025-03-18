import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 에러 발생:", error.response);
      // localStorage.removeItem("token");
      // window.location.href = "/"; // 주석 처리 또는 조건 추가
      return Promise.reject(error); // 에러를 상위로 전달
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

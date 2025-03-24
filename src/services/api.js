import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          { token: localStorage.getItem("token") }
        );
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const startQuiz = async () => {
  const response = await api.post("/quiz/start");
  console.log("startQuiz response:", response.data);
  return response.data;
};

export const fetchQuizDetails = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  console.log("fetchQuizDetails response:", response.data);
  return response.data;
};

export const submitAnswer = async (quizId, answer) => {
  const response = await api.post("/quiz/submit", { quizId, answer });
  console.log("submitAnswer response:", response.data); // 응답 로그 추가
  return response.data; // response.data 반환
};

// Admin 퀴즈 관리 API
export const getQuizList = async (page = 0, size = 10) => {
  const response = await api.get("/admin/quiz/list", {
    params: { page, size },
  });
  console.log("Response data:", response.data);
  return response.data;
};

export const createQuiz = (quizData) =>
  api.post("/admin/quiz/create", quizData);
export const updateQuiz = (id, quizData) =>
  api.put(`/admin/quiz/update/${id}`, quizData);
export const deleteQuiz = (id) => api.delete(`/admin/quiz/delete/${id}`);

export const resetAttempts = async (quizId) => {
  await api.post(`/quiz/reset/${quizId}`);
};

export default api;

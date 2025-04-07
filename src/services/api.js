import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieUtil";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
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
        const oldToken = getCookie("token");
        const response = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {
            token: oldToken,
          }
        );
        const newToken = response.data.token;
        setCookie("token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch (refreshError) {
        deleteCookie("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const startQuiz = async () => {
  const response = await api.post("/quiz/start");
  return response.data;
};

export const fetchQuizDetails = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data;
};

export const submitAnswer = async (quizId, answer) => {
  const response = await api.post("/quiz/submit", { quizId, answer });
  return response.data;
};

export const getQuizList = async (page = 0, size = 10) => {
  const response = await api.get("/admin/quiz/list", {
    params: { page, size },
  });
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

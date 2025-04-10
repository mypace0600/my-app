// service/api.js

import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieUtil";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 이거 추가!! ← 핵심
});

api.interceptors.request.use(
  (config) => {
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
    }
    return Promise.reject(error);
  }
);

export const startQuiz = async () => {
  const response = await api.post("/quiz/start");
  return response;
};

export const fetchQuizDetails = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data.data;
};

export const submitAnswer = async (quizId, answer) => {
  const response = await api.post("/quiz/submit", { quizId, answer });
  return response.data.data;
};

export const getQuizList = async (page = 0, size = 5, keyword = "") => {
  const response = await api.get(
    `/admin/quiz/list?page=${page}&size=${size}&keyword=${encodeURIComponent(
      keyword
    )}`
  );
  return response.data.data;
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

import axios from "axios";
import { useAuthStore } from "../zustand/auth";

const api = axios.create({
  baseURL: "https://api-ecommerce-shoe.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

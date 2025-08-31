import axios from "axios";

const API_URL =
 (import.meta.env.VITE_API_URL as string) || "http://localhost:8080/";

const api = axios.create({baseURL: API_URL, timeout: 10000});

api.interceptors.request.use(async (config) => {
 try {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
 } catch {
  // ignore
 }
 return config;
});

// --- Auth API ---
export const register = async (data: {
 email: string;
 password: string;
 name: string;
}) => {
 const res = await api.post("/api/auth/register", data);
 return res.data;
};

export const verifyEmail = async (data: {email: string; code: string}) => {
 const res = await api.post("/api/auth/verifyEmail", data);
 return res.data;
};

export const login = async (data: {email: string; password: string}) => {
 const res = await api.post("/api/auth/login", data);
 return res.data;
};

export default api;

// --- Notes API ---
export const getAllNotes = async () => {
 const res = await api.get("/api/notes");
 return res.data;
};

export const createNote = async (data: {content: string}) => {
 const res = await api.post("/api/notes", data);
 return res.data;
};

export const updateNote = async (id: string, data: {content: string}) => {
 const res = await api.put(`/api/notes/${id}`, data);
 return res.data;
};

export const deleteNote = async (id: string) => {
 const res = await api.delete(`/api/notes/${id}`);
 return res.data;
};

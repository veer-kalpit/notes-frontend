// src/services/api.ts
import axios from "axios";

const API_URL =
 (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

const api = axios.create({baseURL: API_URL, timeout: 10000});

api.interceptors.request.use(async (config) => {
 try {
  const token = localStorage.getItem("idToken");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
 } catch {
  // ignore
 }
 return config;
});

export default api;

export async function getNotes() {
 const res = await api.get("/notes");
 return res.data;
}

export async function createNote(text: string) {
 const res = await api.post("/notes", {text});
 return res.data;
}

export async function deleteNote(id: string) {
 const res = await api.delete(`/notes/${id}`);
 return res.data;
}

// Send Google idToken to backend for authentication
export async function loginWithGoogle(idToken: string) {
 const res = await api.post("/auth/google", {idToken});
 return res.data;
}

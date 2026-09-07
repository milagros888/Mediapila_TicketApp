// Base para hablar con el backend Express (backend/server.js).
// En desarrollo usa localhost:3000/api y en producción permite configurar VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} en ${path}`);
  }
  return res.json();
}

const API_URL = "http://localhost:3001/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("nail-gallery-token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Ocorreu um erro no servidor.");
  }

  return response.json();
}

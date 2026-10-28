
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(endpoint) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudo consultar el historial."
    );
  }

  return data;
}

export async function getMovements(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  return request(`/movements${query ? `?${query}` : ""}`);
}

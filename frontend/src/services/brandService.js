
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Error al procesar la solicitud.");
  }

  return data;
}

export async function getBrands(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.active !== undefined && filters.active !== "") {
    params.set("active", String(filters.active));
  }

  const query = params.toString();

  return request(`/brands${query ? `?${query}` : ""}`);
}

export async function getBrandById(id) {
  return request(`/brands/${id}`);
}

export async function createBrand(brand) {
  return request("/brands", {
    method: "POST",
    body: JSON.stringify(brand),
  });
}

export async function updateBrand(id, brand) {
  return request(`/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(brand),
  });
}

export async function updateBrandStatus(id, active) {
  return request(`/brands/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

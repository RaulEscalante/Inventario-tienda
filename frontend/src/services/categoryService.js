
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function requestCategory(endpoint, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}/categories${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo completar la operación.");
  }

  return data;
}

export async function getCategories(active) {
  const params = new URLSearchParams();

  if (active === true || active === false) {
    params.set("active", String(active));
  }

  const query = params.toString();
  const data = await requestCategory(query ? `?${query}` : "");

  return data.categorias;
}

export async function createCategory(name) {
  return requestCategory("", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(id, name) {
  return requestCategory(`/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategoryStatus(id, active) {
  return requestCategory(`/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

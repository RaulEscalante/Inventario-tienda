
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

export async function getWarehouses(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.active !== undefined && filters.active !== "") {
    params.set("active", String(filters.active));
  }

  const query = params.toString();
  const data = await request(
    `/warehouses${query ? `?${query}` : ""}`
  );

  return data.almacenes;
}

export async function getWarehouseById(id) {
  const data = await request(`/warehouses/${id}`);
  return data.almacen;
}

export async function createWarehouse(warehouse) {
  const data = await request("/warehouses", {
    method: "POST",
    body: JSON.stringify(warehouse),
  });

  return data.almacen;
}

export async function updateWarehouse(id, warehouse) {
  const data = await request(`/warehouses/${id}`, {
    method: "PUT",
    body: JSON.stringify(warehouse),
  });

  return data.almacen;
}

export async function updateWarehouseStatus(id, active) {
  const data = await request(`/warehouses/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });

  return data.almacen;
}

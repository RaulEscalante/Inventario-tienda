
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    throw new Error(
      data.message || "Error al procesar la solicitud."
    );
  }

  return data;
}

export async function getInventory(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, value);
    }
  });

  const query = params.toString();

  const data = await request(
    `/inventory${query ? `?${query}` : ""}`
  );

  return data.inventario;
}

export async function getInventoryProducts() {
  const data = await request("/products?active=true");
  return data.productos;
}

export async function getInventoryWarehouses() {
  const data = await request("/warehouses?active=true");
  return data.almacenes;
}

export async function createInitialStock(payload) {
  return request("/inventory/initial", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adjustStock(inventoryId, payload) {
  return request(`/inventory/${inventoryId}/adjustments`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

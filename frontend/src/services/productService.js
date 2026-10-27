
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function requestProduct(endpoint, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}/products${endpoint}`, {
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
      data.message || "No se pudo completar la operación con el producto."
    );
  }

  return data;
}

// Listar productos con filtros opcionales.
export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.buscar?.trim()) {
    params.set("buscar", filters.buscar.trim());
  }

  if (typeof filters.activo === "boolean") {
    params.set("activo", String(filters.activo));
  }

  if (filters.categoriaId !== undefined && filters.categoriaId !== "") {
    params.set("categoriaId", String(filters.categoriaId));
  }

  const query = params.toString();
  const data = await requestProduct(query ? `?${query}` : "");

  return data.productos;
}

// Obtener un producto por su ID.
export async function getProductById(id) {
  const data = await requestProduct(`/${id}`);
  return data.producto;
}

// Registrar un producto.
export async function createProduct(product) {
  return requestProduct("", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

// Editar los datos de un producto.
export async function updateProduct(id, product) {
  return requestProduct(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

// Activar o desactivar un producto.
export async function updateProductStatus(id, active) {
  return requestProduct(`/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

// Eliminar un producto cuando no tenga registros asociados.
export async function deleteProduct(id) {
  return requestProduct(`/${id}`, {
    method: "DELETE",
  });
}


import { Edit2, Power, Trash2 } from "lucide-react";

function formatPrice(value) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getTotalStock(product) {
  return (product.inventories ?? []).reduce(
    (total, inventory) => total + inventory.quantity,
    0
  );
}

export default function ProductTable({
  products,
  onEdit,
  onToggle,
  onDelete,
  busyId,
}) {
  if (products.length === 0) {
    return (
      <div className="product-empty">
        <p>No se encontraron productos.</p>
        <span>
          Prueba otra búsqueda o registra un nuevo producto.
        </span>
      </div>
    );
  }

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio de compra</th>
            <th>Precio de venta</th>
            <th>Stock total</th>
            <th>Estado</th>
            <th className="product-actions-heading">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const busy = busyId === product.id;
            const stock = getTotalStock(product);

            return (
              <tr key={product.id}>
                <td>
                  <div className="product-name-cell">
                    <span className="product-name-icon">
                      {product.name.charAt(0).toUpperCase()}
                    </span>

                    <div>
                      <strong>{product.name}</strong>
                      <span className="product-sku">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </div>
                </td>

                <td>{product.category?.name ?? "Sin categoría"}</td>

                <td>{formatPrice(product.purchasePrice)}</td>

                <td>{formatPrice(product.salePrice)}</td>

                <td>
                  <span
                    className={`product-stock ${stock === 0 ? "is-empty" : ""
                      }`}
                  >
                    {stock}
                  </span>
                </td>

                <td>
                  <span
                    className={`product-status ${product.active ? "is-active" : "is-inactive"
                      }`}
                  >
                    <span />
                    {product.active ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <div className="product-row-actions">
                    <button
                      type="button"
                      className="product-icon-button"
                      onClick={() => onEdit(product)}
                      disabled={Boolean(busyId)}
                      aria-label={`Editar ${product.name}`}
                      title="Editar producto"
                    >
                      <Edit2 size={17} />
                    </button>

                    <button
                      type="button"
                      className="product-icon-button"
                      onClick={() => onToggle(product)}
                      disabled={Boolean(busyId)}
                      aria-label={
                        product.active
                          ? `Desactivar ${product.name}`
                          : `Activar ${product.name}`
                      }
                      title={product.active ? "Desactivar" : "Activar"}
                    >
                      <Power size={17} />
                    </button>

                    <button
                      type="button"
                      className="product-icon-button product-delete-button"
                      onClick={() => onDelete(product)}
                      disabled={Boolean(busyId)}
                      aria-label={`Eliminar ${product.name}`}
                      title="Eliminar producto"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

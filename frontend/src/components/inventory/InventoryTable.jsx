
import { ClipboardCheck, PackageOpen } from "lucide-react";

function InventoryTable({ inventory, loading, onAdjust }) {
  if (loading) {
    return (
      <div className="inventory-empty-state">
        Cargando existencias...
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="inventory-empty-state">
        <PackageOpen size={34} />
        <strong>No se encontraron existencias</strong>
        <span>
          Registra un ingreso inicial o cambia los filtros de búsqueda.
        </span>
      </div>
    );
  }

  return (
    <div className="inventory-table-wrapper">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Almacén</th>
            <th>Existencias</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="inventory-product-cell">
                  <strong>{item.product.name}</strong>
                  <span>{item.product.sku}</span>
                </div>
              </td>

              <td>{item.product.brand?.name || "Sin marca"}</td>

              <td>{item.product.category?.name || "Sin categoría"}</td>

              <td>{item.warehouse.name}</td>

              <td>
                <strong className="inventory-quantity">
                  {item.quantity}
                </strong>
              </td>

              <td>
                <span
                  className={`inventory-status ${item.quantity > 0
                      ? "inventory-status-available"
                      : "inventory-status-empty"
                    }`}
                >
                  {item.quantity > 0 ? "Disponible" : "Agotado"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="inventory-action-button"
                  onClick={() => onAdjust(item)}
                  title="Ajustar existencias"
                >
                  <ClipboardCheck size={17} />
                  <span>Ajustar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;

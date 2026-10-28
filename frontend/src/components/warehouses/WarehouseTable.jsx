
import { Edit2, Power } from "lucide-react";

export default function WarehouseTable({
  warehouses,
  onEdit,
  onToggleStatus,
}) {
  if (warehouses.length === 0) {
    return (
      <div className="warehouse-table-empty">
        <p>No se encontraron almacenes.</p>
        <span>Prueba otra búsqueda o registra un nuevo almacén.</span>
      </div>
    );
  }

  return (
    <div className="warehouse-table-wrapper">
      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Almacén</th>
            <th>Registros de inventario</th>
            <th>Movimientos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>
                <div className="warehouse-name-cell">
                  <strong>{warehouse.name}</strong>
                  <span>ID: {warehouse.id}</span>
                </div>
              </td>

              <td>{warehouse._count?.inventories ?? 0}</td>
              <td>{warehouse._count?.movements ?? 0}</td>

              <td>
                <span
                  className={`warehouse-status ${warehouse.active ? "is-active" : "is-inactive"
                    }`}
                >
                  {warehouse.active ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td>
                <div className="warehouse-row-actions">
                  <button
                    type="button"
                    className="warehouse-action-button"
                    onClick={() => onEdit(warehouse)}
                    aria-label={`Editar ${warehouse.name}`}
                    title="Editar almacén"
                  >
                    <Edit2 size={17} />
                  </button>

                  <button
                    type="button"
                    className={`warehouse-action-button ${warehouse.active ? "action-deactivate" : "action-activate"
                      }`}
                    onClick={() => onToggleStatus(warehouse)}
                    aria-label={`${warehouse.active ? "Desactivar" : "Activar"
                      } ${warehouse.name}`}
                    title={warehouse.active ? "Desactivar" : "Activar"}
                  >
                    <Power size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

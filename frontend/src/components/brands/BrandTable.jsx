
import { Tag, Pencil, Power, PackageSearch } from "lucide-react";

function BrandTable({ brands, loading, onEdit, onToggleStatus }) {
  if (loading) {
    return (
      <div className="brand-table-message">
        Cargando marcas...
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="brand-table-empty">
        <div className="brand-table-empty-icon">
          <Tag size={28} />
        </div>
        <h3>No hay marcas registradas</h3>
        <p>Registra una marca para comenzar a organizar tus productos.</p>
      </div>
    );
  }

  return (
    <div className="brand-table-wrapper">
      <table className="brand-table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Productos asociados</th>
            <th>Estado</th>
            <th className="brand-table-actions-heading">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>
                <div className="brand-table-name">
                  <div className="brand-table-icon">
                    <Tag size={17} />
                  </div>

                  <div>
                    <span className="brand-table-primary">
                      {brand.name}
                    </span>
                    <span className="brand-table-secondary">
                      ID: {brand.id}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span className="brand-products-count">
                  <PackageSearch size={16} />
                  {brand._count?.products ?? 0}
                </span>
              </td>

              <td>
                <span
                  className={`brand-status ${
                    brand.active ? "brand-status-active" : "brand-status-inactive"
                  }`}
                >
                  <span className="brand-status-dot" />
                  {brand.active ? "Activa" : "Inactiva"}
                </span>
              </td>

              <td>
                <div className="brand-table-actions">
                  <button
                    type="button"
                    className="brand-action-button"
                    onClick={() => onEdit(brand)}
                    title="Editar marca"
                    aria-label={`Editar ${brand.name}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className={`brand-action-button ${
                      brand.active
                        ? "brand-action-deactivate"
                        : "brand-action-activate"
                    }`}
                    onClick={() => onToggleStatus(brand)}
                    title={brand.active ? "Desactivar marca" : "Activar marca"}
                    aria-label={`${brand.active ? "Desactivar" : "Activar"} ${brand.name}`}
                  >
                    <Power size={16} />
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

export default BrandTable;

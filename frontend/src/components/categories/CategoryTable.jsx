
import { Edit2, Power } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CategoryTable({
  categories,
  onEdit,
  onToggle,
  busyId,
}) {
  if (categories.length === 0) {
    return (
      <div className="category-empty">
        <p>No se encontraron categorías.</p>
        <span>
          Prueba otro filtro o registra una nueva categoría.
        </span>
      </div>
    );
  }

  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Productos asociados</th>
            <th>Fecha de creación</th>
            <th>Estado</th>
            <th className="category-actions-heading">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => {
            const busy = busyId === category.id;

            return (
              <tr key={category.id}>
                <td>
                  <div className="category-name-cell">
                    <span className="category-name-icon">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{category.name}</span>
                  </div>
                </td>

                <td>{category._count?.products ?? 0}</td>

                <td>{formatDate(category.createdAt)}</td>

                <td>
                  <span
                    className={`category-status ${category.active ? "is-active" : "is-inactive"
                      }`}
                  >
                    <span />
                    {category.active ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td>
                  <div className="category-row-actions">
                    <button
                      type="button"
                      className="category-icon-button"
                      onClick={() => onEdit(category)}
                      disabled={busy || Boolean(busyId)}
                      aria-label={`Editar ${category.name}`}
                      title="Editar categoría"
                    >
                      <Edit2 size={17} />
                    </button>

                    <button
                      type="button"
                      className="category-icon-button"
                      onClick={() => onToggle(category)}
                      disabled={busy || Boolean(busyId)}
                      aria-label={
                        category.active
                          ? `Desactivar ${category.name}`
                          : `Activar ${category.name}`
                      }
                      title={category.active ? "Desactivar" : "Activar"}
                    >
                      <Power size={17} />
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

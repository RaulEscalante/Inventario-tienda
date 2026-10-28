
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  RefreshCw,
  Search,
} from "lucide-react";

import { getMovements } from "../services/movementService.js";
import {
  getInventoryProducts,
  getInventoryWarehouses,
} from "../services/inventoryService.js";

import "./movements.css";

const PAGE_SIZE = 20;

const movementLabels = {
  INITIAL: "Ingreso inicial",
  ADJUSTMENT: "Ajuste",
  PURCHASE: "Compra",
  SALE: "Venta",
  RETURN: "Devolución",
};

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatQuantity(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function MovementType({ type }) {
  const className =
    type === "INITIAL" || type === "PURCHASE" || type === "RETURN"
      ? "movement-type movement-type-entry"
      : type === "SALE"
        ? "movement-type movement-type-exit"
        : "movement-type movement-type-adjustment";

  return (
    <span className={className}>
      {movementLabels[type] || type}
    </span>
  );
}

function MovementPage() {
  const [movements, setMovements] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [draftFilters, setDraftFilters] = useState({
    productId: "",
    warehouseId: "",
    type: "",
    from: "",
    to: "",
  });

  const [filters, setFilters] = useState({
    productId: "",
    warehouseId: "",
    type: "",
    from: "",
    to: "",
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [productList, warehouseList] = await Promise.all([
          getInventoryProducts(),
          getInventoryWarehouses(),
        ]);

        if (!active) return;

        setProducts(productList);
        setWarehouses(warehouseList);
      } catch (err) {
        if (active) {
          setError(
            err.message || "No se pudieron cargar los filtros."
          );
        }
      }
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadMovements() {
      setLoading(true);
      setError("");

      try {
        const data = await getMovements(filters);

        if (!active) return;

        setMovements(data.movimientos || []);
        setPagination(
          data.pagination || {
            page: filters.page,
            pageSize: filters.pageSize,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (err) {
        if (active) {
          setError(
            err.message || "No se pudo cargar el historial."
          );
          setMovements([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMovements();

    return () => {
      active = false;
    };
  }, [filters]);

  function updateDraft(field, value) {
    setDraftFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleFilterSubmit(event) {
    event.preventDefault();

    if (
      draftFilters.from &&
      draftFilters.to &&
      draftFilters.from > draftFilters.to
    ) {
      setError(
        "La fecha inicial no puede ser posterior a la fecha final."
      );
      return;
    }

    setError("");

    setFilters({
      ...draftFilters,
      page: 1,
      pageSize: PAGE_SIZE,
    });
  }

  function clearFilters() {
    const emptyFilters = {
      productId: "",
      warehouseId: "",
      type: "",
      from: "",
      to: "",
    };

    setDraftFilters(emptyFilters);
    setFilters({
      ...emptyFilters,
      page: 1,
      pageSize: PAGE_SIZE,
    });
    setError("");
  }

  function changePage(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  }

  const entries = movements.filter(
    (movement) => movement.quantityDelta > 0
  ).length;

  const exits = movements.filter(
    (movement) => movement.quantityDelta < 0
  ).length;

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 0;
  const startRecord =
    pagination.total === 0
      ? 0
      : (currentPage - 1) * pagination.pageSize + 1;
  const endRecord = Math.min(
    currentPage * pagination.pageSize,
    pagination.total
  );

  return (
    <main className="movements-page">
      <header className="movements-page-header">
        <div>
          <span className="movements-eyebrow">
            TRAZABILIDAD DE EXISTENCIAS
          </span>
          <h1>Movimientos</h1>
          <p>
            Consulta los ingresos, ajustes y demás operaciones
            registradas en el inventario.
          </p>
        </div>

        <div className="movements-header-icon">
          <ClipboardList size={25} />
        </div>
      </header>

      {error && (
        <div className="movements-alert" role="alert">
          {error}
        </div>
      )}

      <section className="movements-summary">
        <article className="movements-summary-card">
          <div className="movements-summary-icon">
            <ArrowLeftRight size={22} />
          </div>
          <div>
            <span>Movimientos encontrados</span>
            <strong>{pagination.total}</strong>
          </div>
        </article>

        <article className="movements-summary-card">
          <div className="movements-summary-icon movements-entry-icon">
            <ArrowDownLeft size={22} />
          </div>
          <div>
            <span>Ingresos en esta página</span>
            <strong>{entries}</strong>
          </div>
        </article>

        <article className="movements-summary-card">
          <div className="movements-summary-icon movements-exit-icon">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <span>Reducciones en esta página</span>
            <strong>{exits}</strong>
          </div>
        </article>
      </section>

      <section className="movements-content">
        <div className="movements-content-heading">
          <div>
            <h2>Historial de operaciones</h2>
            <p>
              Filtra los registros para encontrar una operación específica.
            </p>
          </div>
        </div>

        <form
          className="movements-filters"
          onSubmit={handleFilterSubmit}
        >
          <label className="movements-field">
            <span>Producto</span>
            <select
              value={draftFilters.productId}
              onChange={(event) =>
                updateDraft("productId", event.target.value)
              }
            >
              <option value="">Todos los productos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} — {product.name}
                </option>
              ))}
            </select>
          </label>

          <label className="movements-field">
            <span>Almacén</span>
            <select
              value={draftFilters.warehouseId}
              onChange={(event) =>
                updateDraft("warehouseId", event.target.value)
              }
            >
              <option value="">Todos los almacenes</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </label>

          <label className="movements-field">
            <span>Tipo de movimiento</span>
            <select
              value={draftFilters.type}
              onChange={(event) =>
                updateDraft("type", event.target.value)
              }
            >
              <option value="">Todos los tipos</option>
              {Object.entries(movementLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="movements-field">
            <span>Desde</span>
            <input
              type="date"
              value={draftFilters.from}
              max={draftFilters.to || undefined}
              onChange={(event) =>
                updateDraft("from", event.target.value)
              }
            />
          </label>

          <label className="movements-field">
            <span>Hasta</span>
            <input
              type="date"
              value={draftFilters.to}
              min={draftFilters.from || undefined}
              onChange={(event) =>
                updateDraft("to", event.target.value)
              }
            />
          </label>

          <div className="movements-filter-actions">
            <button
              type="submit"
              className="movements-button movements-button-primary"
            >
              <Search size={17} />
              Filtrar
            </button>

            <button
              type="button"
              className="movements-button movements-button-secondary"
              onClick={clearFilters}
            >
              <RefreshCw size={16} />
              Limpiar
            </button>
          </div>
        </form>

        <div className="movements-table-wrapper">
          <table className="movements-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Almacén</th>
                <th>Anterior</th>
                <th>Nueva</th>
                <th>Variación</th>
                <th>Usuario</th>
                <th>Motivo</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="movements-table-message">
                    Cargando movimientos...
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan="9" className="movements-table-message">
                    No se encontraron movimientos con estos filtros.
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>
                      <div className="movement-date">
                        <CalendarDays size={16} />
                        <span>{formatDate(movement.createdAt)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="movement-product">
                        <strong>{movement.product?.name || "—"}</strong>
                        <span>{movement.product?.sku || "—"}</span>
                      </div>
                    </td>

                    <td>
                      <MovementType type={movement.type} />
                    </td>

                    <td>{movement.warehouse?.name || "—"}</td>

                    <td>{movement.previousQuantity}</td>

                    <td>{movement.newQuantity}</td>

                    <td>
                      <strong
                        className={
                          movement.quantityDelta > 0
                            ? "movement-delta movement-delta-positive"
                            : movement.quantityDelta < 0
                              ? "movement-delta movement-delta-negative"
                              : "movement-delta"
                        }
                      >
                        {formatQuantity(movement.quantityDelta)}
                      </strong>
                    </td>

                    <td>
                      <div className="movement-user">
                        <strong>
                          {movement.user?.name || "Usuario no disponible"}
                        </strong>
                        <span>
                          {movement.user?.username || ""}
                        </span>
                      </div>
                    </td>

                    <td className="movement-reason">
                      {movement.reason || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="movements-pagination">
          <span>
            {pagination.total === 0
              ? "Sin registros"
              : `Mostrando ${startRecord}–${endRecord} de ${pagination.total} movimientos`}
          </span>

          <div className="movements-pagination-controls">
            <button
              type="button"
              className="movements-page-button"
              disabled={loading || currentPage <= 1}
              onClick={() => changePage(currentPage - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <span>
              Página {currentPage} de {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              className="movements-page-button"
              disabled={
                loading ||
                totalPages === 0 ||
                currentPage >= totalPages
              }
              onClick={() => changePage(currentPage + 1)}
              aria-label="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default MovementPage;

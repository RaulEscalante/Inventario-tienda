
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Warehouse } from "lucide-react";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  updateWarehouseStatus,
} from "../services/warehouseService.js";

import WarehouseForm from "../components/warehouses/WarehouseForm.jsx";
import WarehouseTable from "../components/warehouses/WarehouseTable.jsx";
import "./warehouses.css";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const loadWarehouses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los almacenes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  const filteredWarehouses = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return warehouses.filter((warehouse) => {
      const matchesSearch = warehouse.name
        .toLocaleLowerCase("es")
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && warehouse.active) ||
        (statusFilter === "inactive" && !warehouse.active);

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, search, statusFilter]);

  function openCreateForm() {
    setSelectedWarehouse(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(warehouse) {
    setSelectedWarehouse(warehouse);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setSelectedWarehouse(null);
  }

  async function handleSubmit(data) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (selectedWarehouse) {
        await updateWarehouse(selectedWarehouse.id, data);
        setNotice("Almacén actualizado correctamente.");
      } else {
        await createWarehouse(data);
        setNotice("Almacén registrado correctamente.");
      }

      setShowForm(false);
      setSelectedWarehouse(null);

      await loadWarehouses();
    } catch (err) {
      setError(err.message || "No se pudo guardar el almacén.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(warehouse) {
    const nextActive = !warehouse.active;
    const action = nextActive ? "activar" : "desactivar";

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} el almacén "${warehouse.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await updateWarehouseStatus(warehouse.id, nextActive);

      setNotice(
        nextActive
          ? "Almacén activado correctamente."
          : "Almacén desactivado correctamente."
      );

      await loadWarehouses();
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado del almacén.");
    }
  }

  const activeCount = warehouses.filter((warehouse) => warehouse.active).length;
  const inactiveCount = warehouses.length - activeCount;

  return (
    <section className="warehouses-page">
      <div className="warehouses-page-header">
        <div>
          <p className="section-eyebrow">GESTIÓN</p>
          <h1>Almacenes</h1>
          <p className="warehouses-page-description">
            Administra los almacenes donde se registran las existencias.
          </p>
        </div>

        <button
          type="button"
          className="warehouse-button warehouse-button-primary"
          onClick={openCreateForm}
          disabled={showForm}
        >
          <Plus size={18} />
          Nuevo almacén
        </button>
      </div>

      <div className="warehouses-summary">
        <article className="warehouses-summary-card">
          <span className="warehouses-summary-icon">
            <Warehouse size={20} />
          </span>
          <div>
            <p>Total de almacenes</p>
            <strong>{warehouses.length}</strong>
          </div>
        </article>

        <article className="warehouses-summary-card">
          <span className="warehouses-summary-dot active-dot" />
          <div>
            <p>Almacenes activos</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="warehouses-summary-card">
          <span className="warehouses-summary-dot inactive-dot" />
          <div>
            <p>Almacenes inactivos</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </div>

      {error && (
        <div className="warehouses-alert warehouses-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Cerrar
          </button>
        </div>
      )}

      {notice && (
        <div
          className="warehouses-alert warehouses-alert-success"
          role="status"
        >
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Cerrar
          </button>
        </div>
      )}

      {showForm && (
        <WarehouseForm
          warehouse={selectedWarehouse}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      <div className="warehouses-list-panel">
        <div className="warehouses-list-header">
          <div>
            <h2>Listado de almacenes</h2>
            <p>
              {filteredWarehouses.length}{" "}
              {filteredWarehouses.length === 1
                ? "almacén encontrado"
                : "almacenes encontrados"}
            </p>
          </div>
        </div>

        <div className="warehouses-toolbar">
          <div className="warehouses-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar almacén..."
              aria-label="Buscar almacén"
            />
          </div>

          <select
            className="warehouses-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        {loading ? (
          <div className="warehouse-table-message">
            Cargando almacenes...
          </div>
        ) : error && warehouses.length === 0 ? (
          <div className="warehouse-table-empty">
            <p>No se pudieron mostrar los almacenes.</p>
            <button
              type="button"
              className="warehouse-button warehouse-button-secondary"
              onClick={loadWarehouses}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <WarehouseTable
            warehouses={filteredWarehouses}
            onEdit={openEditForm}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </section>
  );
}

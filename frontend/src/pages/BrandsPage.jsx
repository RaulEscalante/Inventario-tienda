
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Tag } from "lucide-react";

import {
  getBrands,
  createBrand,
  updateBrand,
  updateBrandStatus,
} from "../services/brandService.js";

import BrandForm from "../components/brands/BrandForm.jsx";
import BrandTable from "../components/brands/BrandTable.jsx";
import "../components/brands/brands.css";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const loadBrands = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las marcas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const filteredBrands = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return brands.filter((brand) => {
      const matchesSearch = brand.name
        .toLocaleLowerCase("es")
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && brand.active) ||
        (statusFilter === "inactive" && !brand.active);

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, statusFilter]);

  function openCreateForm() {
    setSelectedBrand(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(brand) {
    setSelectedBrand(brand);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setSelectedBrand(null);
  }

  async function handleSubmit(data) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand.id, data);
        setNotice("Marca actualizada correctamente.");
      } else {
        await createBrand(data);
        setNotice("Marca registrada correctamente.");
      }

      setShowForm(false);
      setSelectedBrand(null);

      await loadBrands();
    } catch (err) {
      setError(err.message || "No se pudo guardar la marca.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(brand) {
    const nextActive = !brand.active;
    const action = nextActive ? "activar" : "desactivar";

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} la marca "${brand.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await updateBrandStatus(brand.id, nextActive);

      setNotice(
        nextActive
          ? "Marca activada correctamente."
          : "Marca desactivada correctamente."
      );

      await loadBrands();
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado de la marca.");
    }
  }

  const activeCount = brands.filter((brand) => brand.active).length;
  const inactiveCount = brands.length - activeCount;

  return (
    <section className="brands-page">
      <div className="brands-page-header">
        <div>
          <p className="section-eyebrow">CATÁLOGO</p>
          <h1>Marcas</h1>
          <p className="brands-page-description">
            Administra las marcas de los productos de tu tienda.
          </p>
        </div>

        <button
          type="button"
          className="brand-button brand-button-primary"
          onClick={openCreateForm}
          disabled={showForm}
        >
          <Plus size={18} />
          Nueva marca
        </button>
      </div>

      <div className="brands-summary">
        <article className="brands-summary-card">
          <span className="brands-summary-icon">
            <Tag size={20} />
          </span>
          <div>
            <p>Total de marcas</p>
            <strong>{brands.length}</strong>
          </div>
        </article>

        <article className="brands-summary-card">
          <span className="brands-summary-dot active-dot" />
          <div>
            <p>Marcas activas</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="brands-summary-card">
          <span className="brands-summary-dot inactive-dot" />
          <div>
            <p>Marcas inactivas</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </div>

      {error && (
        <div className="brands-alert brands-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Cerrar
          </button>
        </div>
      )}

      {notice && (
        <div className="brands-alert brands-alert-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Cerrar
          </button>
        </div>
      )}

      {showForm && (
        <BrandForm
          brand={selectedBrand}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      <div className="brands-list-panel">
        <div className="brands-list-header">
          <div>
            <h2>Listado de marcas</h2>
            <p>
              {filteredBrands.length}{" "}
              {filteredBrands.length === 1
                ? "marca encontrada"
                : "marcas encontradas"}
            </p>
          </div>
        </div>

        <div className="brands-toolbar">
          <div className="brands-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar marca..."
              aria-label="Buscar marca"
            />
          </div>

          <select
            className="brands-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>

        {loading ? (
          <div className="brand-table-message">Cargando marcas...</div>
        ) : error && brands.length === 0 ? (
          <div className="brand-table-empty">
            <p>No se pudieron mostrar las marcas.</p>
            <button
              type="button"
              className="brand-button brand-button-secondary"
              onClick={loadBrands}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <BrandTable
            brands={filteredBrands}
            loading={loading}
            onEdit={openEditForm}
            onToggleStatus={handleToggle}
          />
        )}
      </div>
    </section>
  );
}

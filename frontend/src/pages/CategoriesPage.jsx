
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Tags } from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../services/categoryService.js";

import CategoryForm from "../components/categories/CategoryForm.jsx";
import CategoryTable from "../components/categories/CategoryTable.jsx";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLocaleLowerCase("es")
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.active) ||
        (statusFilter === "inactive" && !category.active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  function openCreateForm() {
    setSelectedCategory(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(category) {
    setSelectedCategory(category);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setSelectedCategory(null);
  }

  async function handleSubmit(name) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, name);
        setNotice("Categoría actualizada correctamente.");
      } else {
        await createCategory(name);
        setNotice("Categoría creada correctamente.");
      }

      setShowForm(false);
      setSelectedCategory(null);
      await loadCategories();
    } catch (err) {
      setError(err.message || "No se pudo guardar la categoría.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(category) {
    const nextActive = !category.active;

    const action = nextActive ? "activar" : "desactivar";
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} la categoría "${category.name}"?`
    );

    if (!confirmed) return;

    setBusyId(category.id);
    setError("");
    setNotice("");

    try {
      await updateCategoryStatus(category.id, nextActive);

      setNotice(
        nextActive
          ? "Categoría activada correctamente."
          : "Categoría desactivada correctamente."
      );

      await loadCategories();
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado.");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = categories.filter((category) => category.active).length;
  const inactiveCount = categories.length - activeCount;

  return (
    <section className="categories-page">
      <div className="categories-page-header">
        <div>
          <p className="section-eyebrow">CATÁLOGO</p>
          <h1>Categorías</h1>
          <p className="categories-page-description">
            Organiza los productos de tu tienda para mantener tu inventario ordenado.
          </p>
        </div>

        <button
          type="button"
          className="category-button category-button-primary"
          onClick={openCreateForm}
          disabled={showForm}
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      <div className="category-summary">
        <article className="category-summary-card">
          <span className="category-summary-icon">
            <Tags size={20} />
          </span>
          <div>
            <p>Total de categorías</p>
            <strong>{categories.length}</strong>
          </div>
        </article>

        <article className="category-summary-card">
          <span className="category-summary-dot active-dot" />
          <div>
            <p>Categorías activas</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="category-summary-card">
          <span className="category-summary-dot inactive-dot" />
          <div>
            <p>Categorías inactivas</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </div>

      {error && (
        <div className="category-alert category-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Cerrar
          </button>
        </div>
      )}

      {notice && (
        <div className="category-alert category-alert-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Cerrar
          </button>
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      <div className="category-list-panel">
        <div className="category-list-header">
          <div>
            <h2>Listado de categorías</h2>
            <p>
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? "categoría encontrada"
                : "categorías encontradas"}
            </p>
          </div>
        </div>

        <div className="category-toolbar">
          <div className="category-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar categoría..."
              aria-label="Buscar categoría"
            />
          </div>

          <select
            className="category-filter"
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
          <div className="category-loading">Cargando categorías...</div>
        ) : error && categories.length === 0 ? (
          <div className="category-empty">
            <p>No se pudieron mostrar las categorías.</p>
            <button
              type="button"
              className="category-button category-button-secondary"
              onClick={loadCategories}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onEdit={openEditForm}
            onToggle={handleToggle}
            busyId={busyId}
          />
        )}
      </div>
    </section>
  );
}

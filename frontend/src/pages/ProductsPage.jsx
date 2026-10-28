
import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, Tags } from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../services/productService.js";

import { getCategories } from "../services/categoryService.js";
import { getBrands } from "../services/brandService.js";

import ProductForm from "../components/products/ProductForm.jsx";
import ProductTable from "../components/products/ProductTable.jsx";
import "./products.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLocaleLowerCase("es").includes(normalizedSearch) ||
        product.sku.toLocaleLowerCase("es").includes(normalizedSearch) ||
        (product.brand?.name ?? "")
          .toLocaleLowerCase("es")
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.active) ||
        (statusFilter === "inactive" && !product.active);

      const matchesCategory =
        categoryFilter === "all" ||
        String(product.categoryId ?? "") === categoryFilter;

      const matchesBrand =
        brandFilter === "all" ||
        String(product.brandId ?? "") === brandFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesBrand
      );
    });
  }, [products, search, statusFilter, categoryFilter, brandFilter]);


  function openCreateForm() {
    setSelectedProduct(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(product) {
    setSelectedProduct(product);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setSelectedProduct(null);
  }

  async function handleSubmit(productData) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        setNotice("Producto actualizado correctamente.");
      } else {
        await createProduct(productData);
        setNotice("Producto creado correctamente.");
      }

      setShowForm(false);
      setSelectedProduct(null);

      await loadData();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(product) {
    const nextActive = !product.active;
    const action = nextActive ? "activar" : "desactivar";

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} el producto "${product.name}"?`
    );

    if (!confirmed) return;

    setBusyId(product.id);
    setError("");
    setNotice("");

    try {
      await updateProductStatus(product.id, nextActive);

      setNotice(
        nextActive
          ? "Producto activado correctamente."
          : "Producto desactivado correctamente."
      );

      await loadData();
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado del producto.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `¿Deseas eliminar el producto "${product.name}"?\n\nEsta acción es permanente y solo será posible si no tiene registros de inventario, movimientos o códigos de barras asociados.`
    );

    if (!confirmed) return;

    setBusyId(product.id);
    setError("");
    setNotice("");

    try {
      await deleteProduct(product.id);

      setNotice("Producto eliminado correctamente.");
      await loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = products.filter((product) => product.active).length;
  const inactiveCount = products.length - activeCount;

  return (
    <section className="products-page">
      <div className="products-page-header">
        <div>
          <p className="section-eyebrow">CATÁLOGO</p>
          <h1>Productos</h1>
          <p className="products-page-description">
            Administra los artículos, sus precios y la información de tu tienda.
          </p>
        </div>

        <button
          type="button"
          className="product-button product-button-primary"
          onClick={openCreateForm}
          disabled={showForm}
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <div className="product-summary">
        <article className="product-summary-card">
          <span className="product-summary-icon">
            <Package size={20} />
          </span>
          <div>
            <p>Total de productos</p>
            <strong>{products.length}</strong>
          </div>
        </article>

        <article className="product-summary-card">
          <span className="product-summary-dot active-dot" />
          <div>
            <p>Productos activos</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="product-summary-card">
          <span className="product-summary-dot inactive-dot" />
          <div>
            <p>Productos inactivos</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </div>

      {error && (
        <div className="product-alert product-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Cerrar
          </button>
        </div>
      )}

      {notice && (
        <div className="product-alert product-alert-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Cerrar
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          categories={categories}
          brands={brands}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      <div className="product-list-panel">
        <div className="product-list-header">
          <div>
            <h2>Listado de productos</h2>
            <p>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>
          </div>
        </div>

        <div className="product-toolbar">
          <div className="product-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, SKU o marca..."
              aria-label="Buscar productos por nombre, SKU o marca"
            />
          </div>

          <select
            className="product-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            <option value="">Sin categoría</option>
            {categories
              .filter((category) => category.active)
              .map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
          </select>

          <select
            className="product-filter"
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
            aria-label="Filtrar por marca"
          >
            <option value="all">Todas las marcas</option>
            <option value="">Sin marca</option>
            {brands
              .filter((brand) => brand.active)
              .map((brand) => (
                <option key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </option>
              ))}
          </select>

          <select
            className="product-filter"
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
          <div className="product-loading">Cargando productos...</div>
        ) : error && products.length === 0 ? (
          <div className="product-empty">
            <p>No se pudieron mostrar los productos.</p>
            <button
              type="button"
              className="product-button product-button-secondary"
              onClick={loadData}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={openEditForm}
            onToggle={handleToggle}
            onDelete={handleDelete}
            busyId={busyId}
          />
        )}
      </div>
    </section>
  );
}


import { useEffect, useState } from "react";
import {
  Boxes,
  Package,
  Search,
  RefreshCw,
  Plus,
} from "lucide-react";

import {
  getInventory,
  getInventoryProducts,
  getInventoryWarehouses,
  createInitialStock,
  adjustStock,
} from "../services/inventoryService.js";

import InventoryForm from "../components/inventory/InventoryForm.jsx";
import InventoryTable from "../components/inventory/InventoryTable.jsx";

import "../components/inventory/inventory.css";
import "./inventory.css";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    warehouseId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
          setError(err.message || "No se pudieron cargar los datos.");
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

    async function loadInventory() {
      setLoading(true);
      setError("");

      try {
        const data = await getInventory(filters);

        if (active) {
          setInventory(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "No se pudo cargar el inventario.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInventory();

    return () => {
      active = false;
    };
  }, [filters, refreshKey]);

  function handleSearch(event) {
    event.preventDefault();

    setFilters((current) => ({
      ...current,
      search: searchInput.trim(),
    }));
  }

  function handleWarehouseChange(event) {
    setFilters((current) => ({
      ...current,
      warehouseId: event.target.value,
    }));
  }

  async function handleSubmit(payload) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      let response;

      if (form.mode === "initial") {
        response = await createInitialStock(payload);
      } else {
        response = await adjustStock(form.inventory.id, payload);
      }

      setNotice(
        response.message || "La operación se realizó correctamente."
      );
      setForm(null);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "No se pudo guardar la operación.");
    } finally {
      setSaving(false);
    }
  }

  const totalUnits = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const productCount = new Set(
    inventory.map((item) => item.productId)
  ).size;

  return (
    <main className="inventory-page">
      <header className="inventory-page-header">
        <div>
          <span className="inventory-eyebrow">CONTROL DE EXISTENCIAS</span>
          <h1>Inventario</h1>
          <p>
            Consulta las cantidades disponibles y administra los ingresos
            y ajustes de tus productos.
          </p>
        </div>

        <button
          type="button"
          className="inventory-button inventory-button-primary"
          onClick={() => {
            setError("");
            setNotice("");
            setForm({ mode: "initial", inventory: null });
          }}
        >
          <Plus size={19} />
          <span>Registrar ingreso</span>
        </button>
      </header>

      {notice && (
        <div className="inventory-alert inventory-alert-success" role="status">
          {notice}
        </div>
      )}

      {error && (
        <div className="inventory-alert inventory-alert-error" role="alert">
          {error}
        </div>
      )}

      <section className="inventory-summary">
        <article className="inventory-summary-card">
          <div className="inventory-summary-icon">
            <Boxes size={22} />
          </div>
          <div>
            <span>Registros de existencias</span>
            <strong>{inventory.length}</strong>
          </div>
        </article>

        <article className="inventory-summary-card">
          <div className="inventory-summary-icon">
            <Package size={22} />
          </div>
          <div>
            <span>Productos en el listado</span>
            <strong>{productCount}</strong>
          </div>
        </article>

        <article className="inventory-summary-card">
          <div className="inventory-summary-icon">
            <RefreshCw size={22} />
          </div>
          <div>
            <span>Unidades en el listado</span>
            <strong>{totalUnits.toLocaleString("es-PE")}</strong>
          </div>
        </article>
      </section>

      {form && (
        <InventoryForm
          mode={form.mode}
          inventory={form.inventory}
          products={products}
          warehouses={warehouses}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)}
        />
      )}

      <section className="inventory-content">
        <div className="inventory-content-heading">
          <div>
            <h2>Existencias registradas</h2>
            <p>Busca productos y filtra por almacén.</p>
          </div>
        </div>

        <form className="inventory-filters" onSubmit={handleSearch}>
          <label className="inventory-search-field">
            <Search size={19} />
            <input
              type="search"
              placeholder="Buscar por nombre, SKU o marca..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>

          <select
            aria-label="Filtrar por almacén"
            value={filters.warehouseId}
            onChange={handleWarehouseChange}
          >
            <option value="">Todos los almacenes</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inventory-button inventory-button-secondary"
          >
            Buscar
          </button>
        </form>

        <InventoryTable
          inventory={inventory}
          loading={loading}
          onAdjust={(item) => {
            setError("");
            setNotice("");
            setForm({ mode: "adjustment", inventory: item });
          }}
        />
      </section>
    </main>
  );
}

export default InventoryPage;

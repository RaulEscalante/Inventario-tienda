
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    purchasePrice: "0.00",
    salePrice: "0.00",
    categoryId: "",
  });

  const isEditing = Boolean(product);

  useEffect(() => {
    setForm({
      sku: product?.sku ?? "",
      name: product?.name ?? "",
      description: product?.description ?? "",
      purchasePrice: product?.purchasePrice ?? "0.00",
      salePrice: product?.salePrice ?? "0.00",
      categoryId: product?.categoryId
        ? String(product.categoryId)
        : "",
    });
  }, [product]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalized = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      purchasePrice: Number(form.purchasePrice),
      salePrice: Number(form.salePrice),
      categoryId: form.categoryId
        ? Number(form.categoryId)
        : null,
    };

    if (
      !normalized.sku ||
      !normalized.name ||
      !Number.isFinite(normalized.purchasePrice) ||
      !Number.isFinite(normalized.salePrice) ||
      normalized.purchasePrice < 0 ||
      normalized.salePrice < 0
    ) {
      return;
    }

    await onSubmit(normalized);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form-heading">
        <div>
          <h2>{isEditing ? "Editar producto" : "Nuevo producto"}</h2>
          <p>
            {isEditing
              ? "Actualiza la información del producto."
              : "Completa los datos para agregar un producto al catálogo."}
          </p>
        </div>

        <button
          className="product-icon-button"
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cerrar formulario"
        >
          <X size={19} />
        </button>
      </div>

      <div className="product-form-grid">
        <div className="product-form-field">
          <label htmlFor="product-sku">SKU</label>
          <input
            id="product-sku"
            name="sku"
            type="text"
            value={form.sku}
            onChange={handleChange}
            placeholder="Ej. LAP-001"
            maxLength={40}
            required
            autoFocus
            disabled={saving}
          />
          <span>Código único ingresado manualmente.</span>
        </div>

        <div className="product-form-field">
          <label htmlFor="product-name">Nombre del producto</label>
          <input
            id="product-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. Lapicero azul"
            maxLength={160}
            required
            disabled={saving}
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="product-category">Categoría</label>
          <select
            id="product-category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="">Sin categoría</option>
            {categories
              .filter((category) => category.active)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="product-form-field">
          <label htmlFor="product-purchase-price">
            Precio de compra (S/)
          </label>
          <input
            id="product-purchase-price"
            name="purchasePrice"
            type="number"
            value={form.purchasePrice}
            onChange={handleChange}
            min="0"
            max="99999999.99"
            step="0.01"
            required
            disabled={saving}
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="product-sale-price">
            Precio de venta (S/)
          </label>
          <input
            id="product-sale-price"
            name="salePrice"
            type="number"
            value={form.salePrice}
            onChange={handleChange}
            min="0"
            max="99999999.99"
            step="0.01"
            required
            disabled={saving}
          />
        </div>

        <div className="product-form-field product-form-field-full">
          <label htmlFor="product-description">Descripción</label>
          <textarea
            id="product-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detalles adicionales del producto (opcional)"
            rows={3}
            disabled={saving}
          />
        </div>
      </div>

      <div className="product-form-actions">
        <button
          className="product-button product-button-secondary"
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          className="product-button product-button-primary"
          type="submit"
          disabled={saving || !form.sku.trim() || !form.name.trim()}
        >
          <Save size={17} />
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

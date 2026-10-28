
import { useState } from "react";
import { X, PackagePlus, ClipboardCheck } from "lucide-react";

function InventoryForm({
  mode,
  inventory,
  products,
  warehouses,
  saving,
  onSubmit,
  onCancel,
}) {
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [newQuantity, setNewQuantity] = useState(
    inventory ? String(inventory.quantity) : ""
  );
  const [reason, setReason] = useState("");

  const isAdjustment = mode === "adjustment";

  function handleSubmit(event) {
    event.preventDefault();

    if (isAdjustment) {
      onSubmit({
        newQuantity: Number(newQuantity),
        reason: reason.trim(),
      });
      return;
    }

    onSubmit({
      productId: Number(productId),
      warehouseId: Number(warehouseId),
      quantity: Number(quantity),
      reason: reason.trim(),
    });
  }

  return (
    <section className="inventory-form-panel">
      <div className="inventory-form-heading">
        <div className="inventory-form-title">
          <span className="inventory-form-icon">
            {isAdjustment ? (
              <ClipboardCheck size={21} />
            ) : (
              <PackagePlus size={21} />
            )}
          </span>

          <div>
            <h2>
              {isAdjustment
                ? "Ajustar existencias"
                : "Registrar ingreso inicial"}
            </h2>
            <p>
              {isAdjustment
                ? "Indica la cantidad real después del conteo físico."
                : "Asigna las primeras existencias a un producto y almacén."}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inventory-icon-button"
          onClick={onCancel}
          aria-label="Cerrar formulario"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="inventory-form">
        {isAdjustment ? (
          <div className="inventory-current-stock">
            <span>Producto</span>
            <strong>
              {inventory?.product?.name}
            </strong>
            <span>
              SKU: {inventory?.product?.sku}
            </span>
            <span>
              Almacén: {inventory?.warehouse?.name}
            </span>
            <span>
              Existencias actuales: {inventory?.quantity}
            </span>
          </div>
        ) : (
          <>
            <label className="inventory-field">
              <span>Producto *</span>
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                required
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.sku} — {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="inventory-field">
              <span>Almacén *</span>
              <select
                value={warehouseId}
                onChange={(event) => setWarehouseId(event.target.value)}
                required
              >
                <option value="">Selecciona un almacén</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label className="inventory-field">
          <span>
            {isAdjustment
              ? "Nueva cantidad física *"
              : "Cantidad inicial *"}
          </span>
          <input
            type="number"
            min={isAdjustment ? "0" : "1"}
            step="1"
            required
            value={isAdjustment ? newQuantity : quantity}
            onChange={(event) =>
              isAdjustment
                ? setNewQuantity(event.target.value)
                : setQuantity(event.target.value)
            }
            placeholder="Ej. 25"
          />
        </label>

        <label className="inventory-field inventory-field-full">
          <span>Motivo {isAdjustment ? "*" : "(opcional)"}</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={250}
            rows={3}
            placeholder={
              isAdjustment
                ? "Describe el motivo del ajuste"
                : "Ej. Ingreso inicial de mercadería"
            }
            required={isAdjustment}
          />
        </label>

        <div className="inventory-form-actions">
          <button
            type="button"
            className="inventory-button inventory-button-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="inventory-button inventory-button-primary"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : isAdjustment
                ? "Guardar ajuste"
                : "Registrar ingreso"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default InventoryForm;

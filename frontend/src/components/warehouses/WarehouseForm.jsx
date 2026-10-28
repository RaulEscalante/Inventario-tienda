
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

export default function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  saving,
}) {
  const [name, setName] = useState("");

  const isEditing = Boolean(warehouse);

  useEffect(() => {
    setName(warehouse?.name ?? "");
  }, [warehouse]);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName || normalizedName.length > 100) {
      return;
    }

    await onSubmit({ name: normalizedName });
  }

  return (
    <form className="warehouse-form" onSubmit={handleSubmit}>
      <div className="warehouse-form-header">
        <div>
          <h2>{isEditing ? "Editar almacén" : "Nuevo almacén"}</h2>
          <p>
            {isEditing
              ? "Actualiza el nombre del almacén."
              : "Registra un nuevo almacén para gestionar existencias."}
          </p>
        </div>

        <button
          type="button"
          className="warehouse-icon-button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cerrar formulario"
        >
          <X size={19} />
        </button>
      </div>

      <div className="warehouse-form-field">
        <label htmlFor="warehouse-name">Nombre del almacén</label>
        <input
          id="warehouse-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Almacén Principal"
          maxLength={100}
          required
          disabled={saving}
          autoFocus
        />
        <span>Máximo 100 caracteres.</span>
      </div>

      <div className="warehouse-form-actions">
        <button
          type="button"
          className="warehouse-button warehouse-button-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="warehouse-button warehouse-button-primary"
          disabled={saving || !name.trim() || name.trim().length > 100}
        >
          <Save size={17} />
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar almacén"}
        </button>
      </div>
    </form>
  );
}

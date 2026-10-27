
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
  saving,
}) {
  const [name, setName] = useState("");

  const isEditing = Boolean(category);

  useEffect(() => {
    setName(category?.name ?? "");
  }, [category]);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) return;

    await onSubmit(normalizedName);
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form-heading">
        <div>
          <h2>{isEditing ? "Editar categoría" : "Nueva categoría"}</h2>
          <p>
            {isEditing
              ? "Modifica el nombre de la categoría."
              : "Registra una categoría para organizar tus productos."}
          </p>
        </div>

        <button
          className="category-icon-button"
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cerrar formulario"
        >
          <X size={19} />
        </button>
      </div>

      <div className="category-form-field">
        <label htmlFor="category-name">Nombre de la categoría</label>
        <input
          id="category-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Cuadernos"
          maxLength={80}
          autoFocus
          required
          disabled={saving}
        />
        <span>Máximo 80 caracteres.</span>
      </div>

      <div className="category-form-actions">
        <button
          className="category-button category-button-secondary"
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          className="category-button category-button-primary"
          type="submit"
          disabled={saving || !name.trim()}
        >
          <Save size={17} />
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}

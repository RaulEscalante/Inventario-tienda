
import { useEffect, useState } from "react";
import { Tag, X, Save } from "lucide-react";

function BrandForm({ brand, onSubmit, onCancel, saving }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(brand);

  useEffect(() => {
    setName(brand?.name ?? "");
    setError("");
  }, [brand]);

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("El nombre de la marca es obligatorio.");
      return;
    }

    if (normalizedName.length > 100) {
      setError("El nombre no puede superar los 100 caracteres.");
      return;
    }

    setError("");
    onSubmit({ name: normalizedName });
  }

  return (
    <form className="brand-form" onSubmit={handleSubmit}>
      <div className="brand-form-heading">
        <div className="brand-form-icon">
          <Tag size={20} />
        </div>

        <div>
          <h3>{isEditing ? "Editar marca" : "Nueva marca"}</h3>
          <p>
            {isEditing
              ? "Actualiza el nombre de la marca."
              : "Registra una marca para asociarla a tus productos."}
          </p>
        </div>
      </div>

      <div className="brand-form-field">
        <label htmlFor="brand-name">Nombre de la marca</label>

        <input
          id="brand-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError("");
          }}
          placeholder="Ej. Faber-Castell"
          maxLength={100}
          autoFocus
          required
          disabled={saving}
        />

        <div className="brand-form-hint">
          <span>Máximo 100 caracteres.</span>
          <span>{name.length}/100</span>
        </div>

        {error && (
          <p className="brand-form-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="brand-form-actions">
        <button
          type="button"
          className="brand-button brand-button-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          <X size={16} />
          Cancelar
        </button>

        <button
          type="submit"
          className="brand-button brand-button-primary"
          disabled={saving}
        >
          <Save size={16} />
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar marca"}
        </button>
      </div>
    </form>
  );
}

export default BrandForm;

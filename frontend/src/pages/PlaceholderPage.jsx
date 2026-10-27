
import { PackageOpen } from "lucide-react";

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="module-placeholder">
      <div className="module-placeholder-icon">
        <PackageOpen size={30} strokeWidth={1.6} />
      </div>

      <p className="section-eyebrow">MÓDULO EN PREPARACIÓN</p>
      <h1>{title}</h1>
      <p>{description}</p>

      <span className="module-status">
        <span className="status-indicator" />
        Pendiente de implementación
      </span>
    </section>
  );
}


import { Link } from "react-router-dom";
import {
  Package,
  Tags,
  Boxes,
  ArrowLeftRight,
  ArrowUpRight,
  Plus,
  ClipboardList,
  Search,
  ChartNoAxesCombined,
} from "lucide-react";

const metrics = [
  {
    label: "Total de productos",
    value: "—",
    description: "Productos registrados",
    icon: Package,
    tone: "blue",
  },
  {
    label: "Categorías",
    value: "—",
    description: "Categorías creadas",
    icon: Tags,
    tone: "violet",
  },
  {
    label: "Unidades en stock",
    value: "—",
    description: "Existencias acumuladas",
    icon: Boxes,
    tone: "green",
  },
  {
    label: "Movimientos",
    value: "—",
    description: "Registros de inventario",
    icon: ArrowLeftRight,
    tone: "orange",
  },
];

const shortcuts = [
  {
    title: "Registrar producto",
    description: "Añade un artículo al catálogo.",
    path: "/productos",
    icon: Plus,
  },
  {
    title: "Consultar inventario",
    description: "Revisa las existencias de la tienda.",
    path: "/inventario",
    icon: Search,
  },
  {
    title: "Ver movimientos",
    description: "Consulta el historial del stock.",
    path: "/movimientos",
    icon: ClipboardList,
  },
];

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <section className="page-heading">
        <div>
          <p className="section-eyebrow">VISTA GENERAL</p>
          <h1>Resumen</h1>
          <p className="page-description">
            Consulta el estado general de tu inventario desde un solo lugar.
          </p>
        </div>

        <Link className="primary-button" to="/productos">
          <Plus size={18} />
          Nuevo producto
        </Link>
      </section>

      <section className="metrics-grid" aria-label="Resumen del inventario">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="metric-card" key={metric.label}>
              <div className="metric-card-top">
                <span className={`metric-icon ${metric.tone}`}>
                  <Icon size={21} strokeWidth={1.8} />
                </span>

                <span className="metric-period">General</span>
              </div>

              <p className="metric-label">{metric.label}</p>
              <strong className="metric-value">{metric.value}</strong>
              <p className="metric-description">{metric.description}</p>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Actividad reciente</h2>
              <p>Últimos cambios realizados en el inventario.</p>
            </div>

            <Link className="text-link" to="/movimientos">
              Ver movimientos
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="empty-state">
            <div className="empty-state-icon">
              <ChartNoAxesCombined size={25} />
            </div>

            <h3>Aún no hay actividad</h3>
            <p>
              Cuando registres productos y movimientos de stock,
              aquí podrás consultar la actividad reciente.
            </p>
          </div>
        </article>

        <article className="panel shortcuts-panel">
          <div className="panel-heading">
            <div>
              <h2>Accesos rápidos</h2>
              <p>Acciones frecuentes.</p>
            </div>
          </div>

          <div className="shortcuts-list">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;

              return (
                <Link
                  className="shortcut-item"
                  to={shortcut.path}
                  key={shortcut.title}
                >
                  <span className="shortcut-icon">
                    <Icon size={19} />
                  </span>

                  <span className="shortcut-copy">
                    <strong>{shortcut.title}</strong>
                    <span>{shortcut.description}</span>
                  </span>

                  <ArrowUpRight
                    className="shortcut-arrow"
                    size={17}
                  />
                </Link>
              );
            })}
          </div>
        </article>
      </section>

      <section className="getting-started">
        <div className="getting-started-icon">
          <Package size={23} />
        </div>

        <div className="getting-started-copy">
          <h2>Comienza a organizar tu inventario</h2>
          <p>
            El primer paso será registrar las categorías y los productos
            de la tienda para después controlar sus existencias.
          </p>
        </div>

        <Link to="/categorias" className="secondary-button">
          Configurar categorías
        </Link>
      </section>
    </div>
  );
}

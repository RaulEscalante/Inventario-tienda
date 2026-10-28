
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Tag, Boxes, Warehouse, ArrowLeftRight, X, } from "lucide-react";

const navigation = [
  {
    label: "GENERAL",
    items: [
      { name: "Resumen", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "GESTIÓN",
    items: [
      { name: "Productos", path: "/productos", icon: Package },
      { name: "Categorías", path: "/categorias", icon: Tags },
      { name: "Marcas", path: "/marcas", icon: Tag },
      { name: "Almacenes", path: "/almacenes", icon: Warehouse },
      { name: "Inventario", path: "/inventario", icon: Boxes },
      {
        name: "Movimientos",
        path: "/movimientos",
        icon: ArrowLeftRight,
      },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <button
        className={`sidebar-overlay ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
      />

      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Package size={23} strokeWidth={2.2} />
          </div>

          <div className="brand-copy">
            <span className="brand-name">Sistema de</span>
            <span className="brand-name">inventario</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-navigation" aria-label="Navegación principal">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-group-label">{group.label}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={onClose}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-indicator" />
            <div>
              <strong>Sistema local</strong>
              <span>Entorno de trabajo</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

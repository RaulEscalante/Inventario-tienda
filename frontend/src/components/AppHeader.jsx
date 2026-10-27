
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const pageTitles = {
  "/": "Resumen",
  "/productos": "Productos",
  "/categorias": "Categorías",
  "/inventario": "Inventario",
  "/movimientos": "Movimientos",
};

export default function AppHeader({ pathname, onMenuClick }) {
  const { user, logout } = useAuth();
  const title = pageTitles[pathname] || "Sistema de inventario";

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="icon-button mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={21} />
        </button>

        <div className="breadcrumb">
          <span>Inicio</span>
          <span className="breadcrumb-separator">/</span>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="header-actions">
        <div className="session-indicator">
          <span className="status-indicator" />
          <span>Sesión activa</span>
        </div>

        <div className="header-divider" />

        <div className="user-menu">
          <div className="user-avatar">
            {(user?.name || user?.username || "U")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="user-details">
            <strong>{user?.name || user?.username}</strong>
            <span>Usuario</span>
          </div>

          <details className="user-dropdown">
            <summary aria-label="Opciones de usuario">
              <ChevronDown size={17} />
            </summary>

            <div className="dropdown-panel">
              <div className="dropdown-user-name">
                {user?.name || user?.username}
              </div>

              <button type="button" onClick={logout}>
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

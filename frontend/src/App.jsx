import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";

import CategoriesPage from "./pages/CategoriesPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import BrandsPage from "./pages/BrandsPage.jsx";
import WarehousesPage from "./pages/WarehousesPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import MovementsPage from "./pages/MovementsPage.jsx";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />

              <Route path="productos" element={<ProductsPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
              <Route path="/marcas" element={<BrandsPage />} />
              <Route path="almacenes" element={<WarehousesPage />} />
              <Route path="inventario" element={<InventoryPage />} />
              <Route path="movimientos" element={<MovementsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

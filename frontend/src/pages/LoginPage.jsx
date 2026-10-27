
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";

export default function LoginPage() {
  const { user, loading, login } = useAuth();

  if (loading) {
    return <p className="app-loading">Comprobando sesión...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <LoginForm onLogin={login} />
    </AuthLayout>
  );
}

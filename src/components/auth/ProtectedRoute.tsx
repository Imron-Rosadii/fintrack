import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Menunggu pemeriksaan session Supabase
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Memeriksa autentikasi...
          </p>
        </div>
      </div>
    );
  }

  // Jika belum login, arahkan ke Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman
  return <Outlet />;
}

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function GuestRoute() {
  const { user, loading } = useAuth();

  // Tunggu sampai session Supabase selesai diperiksa
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

  // Jika sudah login, arahkan ke Dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Jika belum login, tampilkan halaman Login/Register
  return <Outlet />;
}

export default GuestRoute;

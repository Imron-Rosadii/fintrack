import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";

import useAuth from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";

import Card from "../components/atoms/Card";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import FormField from "../components/molecules/FormField";

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError("");

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setAuthError(error.message);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
      {" "}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white">
            <Wallet size={28} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            FinTrack
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Masuk ke akun keuangan pribadimu
          </p>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Login
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan email dan password untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              required
              error={errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
              />
            </FormField>

            {authError && (
              <div
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
                role="alert"
              >
                {authError}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400"
            >
              Daftar sekarang
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;

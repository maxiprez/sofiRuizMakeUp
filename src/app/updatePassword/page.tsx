"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");

    if (!access_token) {
      setError("Token inválido o faltante.");
      setLoading(false);
      return;
    }

    supabase.auth
      .setSession({
        access_token,
        refresh_token: "",
      })
      .then(({ error }) => {
        if (error) {
          setError("Error al autenticar el token.");
        }
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Contraseña actualizada correctamente.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-xl font-semibold mb-4">Establecer nueva contraseña</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleUpdate} className="flex flex-col items-center gap-4 w-full max-w-xs">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="border px-4 py-2 w-full"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            Actualizar contraseña
          </button>
        </form>
      )}
    </div>
  );
}

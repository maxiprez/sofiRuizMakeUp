"use client";

import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useState } from "react";
import { useRecoverPassword } from "@/app/hooks/useRecoverPassword";


export default function RecoverPassword() {
 const [email, setEmail] = useState("");
 const { resetPassword, error, loading } = useRecoverPassword();

  return (
    <div className="flex justify-center md:items-center items-start h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96 my-4">
        <h1 className="text-xl font-bold text-black mb-2">Recuperá tu contraseña</h1>
        <p className="text-sm font-normal text-gray-500 mb-4">
          Ingresá el email asociado a tu cuenta. Te enviaremos instrucciones a esa dirección para recuperar tu contraseña.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await resetPassword(email);
          }}
        >
          <Input
            labelText="Correo Electrónico"
            inputMode="email"
            name="email"
            id="email"
            htmlType="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            button={false}
          />
          {error && <p className="my-2 text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="cursor-pointer mb-4 w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1"
            loading={loading}
            disabled={loading}
            text={loading ? "Enviando..." : "Confirmar"}
          />
        </form>
      </div>
    </div>
  );
}
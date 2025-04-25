"use client";

import Link from "next/link";

import SignInGoogle from "@/app/components/SignInGoogle";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useLogin } from "@/app/hooks/useLogin";

export default function Login() {
  const { handleSubmit, email, setEmail, password, setPassword, showPassword, isSubmitting } = useLogin();
  const primaryColor = "pink-500";
  const textColor = "gray-700";
  const backgroundColor = "gray-100";
  const cardBackgroundColor = "white";

  return (
    <div className={`flex justify-center items-center h-screen bg-${backgroundColor}`}>
      <div className={`bg-${cardBackgroundColor} p-8 rounded-md shadow-md w-96`}>
        <h1 className={`text-2xl font-bold mb-6 text-${textColor} text-center`}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <Input labelText="E-mail" inputMode="email" name="email" htmlType="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
          <Input labelText="Contraseña" name="password" htmlType={showPassword ? 'text' : 'password'} id="password" required value={password} onChange={(e) => setPassword(e.target.value)} button={true} />
          <Button
            text="Iniciar sesión"
            type="submit"
            className={`cursor-pointer w-full bg-${primaryColor} text-white px-4 py-2 rounded hover:bg-${primaryColor}-700 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-1`}
            id="loginButton"
            loading={isSubmitting}
          />
        </form>
        <SignInGoogle />
        <div className="border-t border-gray-300 my-4"></div>
        <p className={`text-sm text-center text-${textColor} mb-2`}>
          ¿No tienes una cuenta?
        </p>
        <Link href="/register" className="cursor-pointer block text-center text-blue-500 hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
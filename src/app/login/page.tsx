"use client";

import Link from "next/link";

import SignInGoogle from "@/app/components/SignInGoogle";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useLogin } from "@/app/hooks/useLogin";

export default function Login() {
  const { handleSubmit, email, setEmail, password, setPassword, showPassword, isSubmitting, error } = useLogin();
 
  return (
    <div className={`flex justify-center items-center h-screen bg-gray-100`}>
      <div className={`bg-white p-8 rounded-md shadow-md w-96`}>
        <h1 className={`text-2xl font-bold mb-6 text-gray-700 text-center`}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <Input labelText="E-mail" inputMode="email" name="email" htmlType="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
          <Input labelText="Contraseña" name="password" htmlType={showPassword ? 'text' : 'password'} id="password" required value={password} onChange={(e) => setPassword(e.target.value)} button={true} />
          {error
           && 
           <p className={`text-sm text-red-500 mb-4`}>{error}</p>
           }
           <Link href="/forgotPassword" className="cursor-pointer block text-center text-blue-500 hover:underline mb-4">
            ¿Olvidaste tu contraseña?
          </Link>
          <Button
            text="Iniciar sesión"
            type="submit"
            className={`cursor-pointer w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
            id="loginButton"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </form>
        <SignInGoogle />
        <div className="border-t border-gray-300 my-4"></div>
        <p className={`text-sm text-center text-gray-700 mb-2`}>
          ¿No tienes una cuenta?
        </p>
        <Link href="/register" className="cursor-pointer block text-center text-blue-500 hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import SignInGoogle from "@/app/components/SignInGoogle";
import Input from "@/app/components/Input";
import Button from "@/app/components/CustomBtn";
import { useLogin } from "@/app/hooks/useLogin";

const loginSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { onSubmit, isSubmitting, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="mb-4">
            <Input
              labelText="E-mail"
              inputMode="email"
              id="email"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="mb-2">
            <Input
              labelText="Contraseña"
              id="password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <Link 
            href="/forgotPassword" 
            className="cursor-pointer block text-center text-blue-500 hover:underline mb-4"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Button
            text="Iniciar sesión"
            type="submit"
            className={`cursor-pointer w-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
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
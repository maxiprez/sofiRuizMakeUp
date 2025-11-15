"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import SignInGoogle from "@/app/components/SignInGoogle";
import Input from "@/app/components/Input";
import Button from "@/app/components/CustomBtn";
import { useLogin } from "@/app/hooks/useLogin";
import { usePassword } from "@/app/hooks/usePassword";

const loginSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { onSubmit, isSubmitting, error } = useLogin();
  const { showPassword } = usePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        Iniciar Sesión
      </h1>

      <SignInGoogle />

      <div className="border-t border-gray-300 my-6"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          labelText="E-mail"
          inputMode="email"
          id="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          labelText="Contraseña"
          id="password"
          type="password"
          htmlType={showPassword ? 'text' : 'password'}
          button={true}
          {...register("password")}
          error={errors.password?.message}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Link 
          href="/forgotPassword" 
          className="block text-center text-blue-500 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>

        <Button
          text="Iniciar sesión"
          type="submit"
          className={`w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          } bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
          id="loginButton"
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </form>

      <div className="border-t border-gray-300 my-6"></div>

      <p className="text-sm text-center text-gray-700 mb-2">
        ¿No tienes una cuenta?
      </p>

      <Link href="/register" className="block text-center text-blue-500 hover:underline">
        Regístrate aquí
      </Link>
    </div>
  );
}

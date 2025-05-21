"use client";

import Link from "next/link";
import Input from "@/app/components/Input";
import { usePassword } from "@/app/hooks/usePassword";
import Button from "@/app/components/Button";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const { handleSubmit, error, name, setName, email, setEmail, tel, setTel, password, setPassword, confirmPassword, setConfirmPassword, isSubmitting } = useRegister();
  const { showPassword } = usePassword();
    
  // Aquí asumimos que tienes definidos tus colores personalizados en tu archivo tailwind.config.js
  const primaryColor = "pink-500"; // Reemplaza con tu color primario
  const textColor = "gray-700";   // Reemplaza con tu color de texto
  const backgroundColor = "gray-100"; // Reemplaza con tu color de fondo
  const cardBackgroundColor = "white"; // Reemplaza con el color de fondo de la tarjeta

  return (
    <div className={`flex justify-center items-center bg-${backgroundColor}`}>
      <div className={`bg-${cardBackgroundColor} p-8 rounded-md shadow-md w-96 my-4`}>
        <h1 className={`text-xl font-bold mb-6 text-${textColor} text-center`}>Registrarme</h1>
        <form onSubmit={handleSubmit}>
          <Input labelText="Nombre" inputMode="text" name="name" id="name" htmlType="text" required value={name} onChange={(e) => setName(e.target.value)} button={false} />
          <Input labelText="Correo Electrónico" inputMode="email" name="email" id="email" htmlType="text" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
          <Input labelText="Celular" inputMode="tel" name="tel" id="tel" htmlType="text" required value={tel} onChange={(e) => setTel(e.target.value)} button={false} />
          <Input labelText="Contraseña" name="password" htmlType="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} button={true} />
          <Input labelText="Confirmar Contraseña" name="confirmPassword" htmlType={showPassword ? 'text' : 'password'} id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} button={true} />
          <Button 
           type="submit"
           text="Confirmar"
           className={`cursor-pointer w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} bg-${primaryColor} text-white px-4 py-2 rounded hover:bg-${primaryColor}-700 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-1`}
           loading={isSubmitting}
           disabled={isSubmitting}
          />
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </form>
        <div className="border-t border-gray-300 my-4"></div>
        <p className={`text-sm text-center text-${textColor} mb-2`}>
          ¿Ya tienes una cuenta?
        </p>
        <Link href="/login" className="block text-center text-blue-500 hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
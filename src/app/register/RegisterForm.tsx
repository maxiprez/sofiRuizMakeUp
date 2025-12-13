"use client";

import Link from "next/link";
import Input from "@/app/components/Input";
import { usePassword } from "@/app/hooks/usePassword";
import Button from "@/app/components/CustomBtn";
import { useRegister } from "../hooks/useRegister";
import { formatToNumbersOnly } from "utils/utilsFormat";

export default function Register() {
  const { handleSubmit, error, name, setName, email, setEmail, tel, setTel, password, setPassword, confirmPassword, setConfirmPassword, isSubmitting } = useRegister();
  const { showPassword } = usePassword();
  
  return (
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">Registrarme</h1>
        <form onSubmit={handleSubmit}>
          <Input labelText="Nombre y apellido" placeholder="Alicia Gómez" inputMode="text" name="name" id="name" htmlType="text" required value={name} onChange={(e) => setName(e.target.value)} button={false} />
          <Input labelText="Correo Electrónico" placeholder="alicia.gomez@gmail.com" inputMode="email" name="email" id="email" htmlType="text" required value={email} onChange={(e) => setEmail(e.target.value)} button={false} />
          <Input labelText="Celular" maxLength={10} onChange={(e) => setTel(formatToNumbersOnly(e.target.value))} placeholder="1129993848" inputMode="tel" name="tel" id="tel" htmlType="text" required value={tel} button={false} />
          <Input labelText="Contraseña" name="password" htmlType="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} button={true} />
          <Input labelText="Confirmar Contraseña" name="confirmPassword" htmlType={showPassword ? 'text' : 'password'} id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} button={true} />
          <Button 
           type="submit"
           text="Confirmar"
           className={`cursor-pointer w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
           loading={isSubmitting}
           disabled={isSubmitting}
          />
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </form>
        <div className="border-t border-gray-300 my-4"></div>
        <p className={`text-sm text-center text-gray-700 mb-2`}>
          ¿Ya tienes una cuenta?
        </p>
        <Link href="/login" className="block text-center text-blue-500 hover:underline">
          Iniciar sesión
        </Link>
      </div>
  );
}
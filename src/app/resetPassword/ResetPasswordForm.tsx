"use client";

import Input from '@/app/components/Input';
import { CustomBtn as Button } from '@/app/components/CustomBtn';
import { useResetPassword } from '@/app/hooks/useResetPassword';
import Link from 'next/link';

function UpdatePasswordPage() {
  const { newPassword, confirmPassword, loading, messageError, messageSuccess, handleUpdatePassword, setNewPassword, setConfirmPassword } = useResetPassword();
  
  const isSuccess = !!messageSuccess;

  return (
      <div className='bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg'>
        <h1 className={`text-2xl font-bold mb-6 text-gray-700 text-center`}>
          {isSuccess ? '¡Contraseña Actualizada!' : 'Actualizar Contraseña'}
        </h1>
        
        {!isSuccess ? (
          <form onSubmit={handleUpdatePassword}>
            <Input 
              labelText="Nueva Contraseña" 
              inputMode="text" 
              name="newPassword" 
              htmlType="password" 
              id="newPassword" 
              required 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              button={true}
            />
            <Input 
              labelText="Confirmar Nueva Contraseña" 
              inputMode="text" 
              name="confirmPassword" 
              htmlType="password" 
              id="confirmPassword" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              button={true}
            />
            <Button
              text="Actualizar Contraseña"
              type="submit"
              className={`cursor-pointer w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
              id="updateButton"
              loading={loading}
              disabled={loading}
            />
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-500 mb-6">{messageSuccess}</p>
            <Link href="/login">
              <Button
                text="Iniciar Sesión"
                type="button"
                className="bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1"
                id="loginButton"
              />
            </Link>
          </div>
        )}
        
        {messageError && !isSuccess && (
          <p className="text-center text-red-500 mt-2">{messageError}</p>
        )}
      </div>
  );
}

export default UpdatePasswordPage;
"use client";

import Input from '@/app/components/Input';
import Button from '@/app/components/CustomBtn';
import { useResetPassword } from '@/app/hooks/useResetPassword';

function UpdatePasswordPage() {
  const { newPassword, confirmPassword, loading, message, handleUpdatePassword, setNewPassword, setConfirmPassword } = useResetPassword();
  return (
    <section className={`flex justify-center items-center h-screen bg-gray-100`}>
        <div className={`bg-white p-8 rounded-md shadow-md w-96 mx-4`}>
            <h1 className={`text-2xl font-bold mb-6 text-gray-700 text-center`}>Actualizar Contraseña</h1>
            <form onSubmit={handleUpdatePassword}>
                <Input labelText="Nueva Contraseña" inputMode="text" name="newPassword" htmlType="password" id="newPassword" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} button={true}/>
                <Input labelText="Confirmar Nueva Contraseña" inputMode="text" name="confirmPassword" htmlType="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} button={true}/>
                <Button
                    text="Actualizar Contraseña"
                    type="submit"
                    className={`cursor-pointer w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
                    id="loginButton"
                    loading={loading}
                    disabled={loading}
                />
                {message && <p className="text-center text-green-500">{message}</p>}
            </form>
        </div>
    </section>
  );
}

export default UpdatePasswordPage;
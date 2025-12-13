'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { User, Edit3, Check, X } from 'lucide-react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useSession } from 'next-auth/react';
import { useUpdatePhone } from '@/app/hooks/useUpdatePhone'; 
import { formatToNumbersOnly } from 'utils/utilsFormat';

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<{ tel?: string }>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  
  const { updateTel, loading: updating, error, success } = useUpdatePhone();

  useEffect(() => {
    setTimeout(() => {
      setUser({ tel: session?.user?.tel ?? '' });
      setLoading(false);
    }, 800);
  }, [session]);

  useEffect(() => {
    if (success) {
      setUser((prev) => ({ ...prev, tel: newPhone }));
      setEditing(false);
    } else if (error) {
      setEditing(false); 
    }
  }, [success, error, newPhone]); 

  const handleEdit = () => {
    setEditing(true);
    setNewPhone(user.tel || ''); 
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    await updateTel(session.user.id, newPhone);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-purple-100">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-4 bg-pink-100 rounded-full">
              <BeatLoader color="#ec4899" size={16} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Cargando datos del usuario</h3>
              <p className="text-gray-600">Por favor, espera un momento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xl font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Perfil</h1>
              <p className="text-gray-600 mt-1">Consulta y actualiza tu información personal</p>
            </div>
          </div>
        </div>
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <User className="h-6 w-6 text-pink-600" />
              Mis datos
            </CardTitle>
            <CardDescription>Estos datos son visibles solo para ti</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Nombre:</span>
                <span className="font-normal">{session?.user?.name || 'Sin nombre'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">E-mail:</span>
                <span className="font-normal">{session?.user?.email}</span>
              </div>
              {user.tel && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center flex-wrap gap-2"> 
                    <span className="font-semibold whitespace-nowrap">Teléfono:</span>

                    {!editing ? (
                        <>
                            <span className="font-normal">{user.tel}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleEdit}
                                className="text-pink-600 hover:text-pink-700 cursor-pointer p-1 h-auto"
                                title="Modificar Teléfono"
                            >
                                <Edit3 className="h-4 w-4" /> Modificar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Input
                                id="phone"
                                required
                                value={newPhone}
                                inputMode='tel'
                                maxLength={10}
                                onChange={(e) => setNewPhone(formatToNumbersOnly(e.target.value))}
                                className="border-pink-200 focus-visible:ring-pink-300 w-full sm:w-48"
                            />
                            
                            <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updating}
                                    className="bg-green-500 hover:bg-green-600 text-white cursor-pointer flex-1" 
                                >
                                    {updating ? (
                                        <BeatLoader size={6} color="#fff" />
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-1" /> Guardar
                                        </>
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="text-gray-600 hover:bg-gray-100 cursor-pointer flex-1"
                                >
                                    <X className="h-4 w-4 mr-1" /> Cancelar
                                </Button>
                            </div>
                        </>
                    )}
                  </div>

               {(error || success) && (
                 <div className="text-sm mt-1">
                   {error && <p className="text-red-500">{error}</p>}
                   {success && <p className="text-green-600">Teléfono actualizado correctamente.</p>}
                 </div>
               )}
                </div>
              )}  
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { confirmBooking } from '@/app/_actions/confirmBookin.action'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { CheckCircle, XCircle, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams;
  const token = params.token;
  const result = await confirmBooking(token || '');

  const isSuccess = result.status === 'confirmed'

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-purple-100 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className={`p-4 rounded-full ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
          </div>

          <CardTitle className="text-2xl text-gray-900">
            {isSuccess ? 'Turno confirmado' : 'Error al confirmar'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {isSuccess ? (
            <>
              <p className="text-gray-600">
                Tu turno fue confirmado correctamente.  
                Te esperamos en el horario reservado ✨
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="bg-pink-500 hover:bg-pink-600 md:text-base text-sm text-white py-4 px-6 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto cursor-pointer"
                >
                  <Link href="/my-account" className="flex items-center justify-center gap-2">
                    Ver mis turnos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-pink-400 text-pink-500 hover:bg-pink-50"
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Reservar otra cita
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                El enlace es inválido o el turno ya fue confirmado previamente.
              </p>

              <Button
                asChild
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Link href="/" className="flex items-center justify-center gap-2">
                  Volver al inicio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
"use client";

import { useForm } from "react-hook-form";
import { updateAvailability, Availability } from "@/app/_actions/abmAvailability.action";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { CalendarDays, Coffee, Save } from "lucide-react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const DAY_NAMES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

type FormValues = {
  availability: {
    id: string;
    day_of_week: number;
    enabled: boolean;
    start_time: string;
    end_time: string;
    break_start: string;
    break_end: string;
  }[];
};

export function SchedulesClient({ initialData }: { initialData: Availability[] }) {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      availability: initialData.map(item => ({
        id: item.id,
        day_of_week: item.day_of_week,
        enabled: item.enabled,
        start_time: item.start_time?.slice(0, 5) ?? "09:00",
        end_time: item.end_time?.slice(0, 5) ?? "18:00",
        break_start: item.break_start?.slice(0, 5) ?? "",
        break_end: item.break_end?.slice(0, 5) ?? "",
      }))
    }
  });

  const onSubmit = async (data: FormValues) => {
    for (const item of data.availability) {
      if (item.enabled && item.break_start && item.break_end) {
        const startTime = new Date(`2000-01-01T${item.start_time}`);
        const endTime = new Date(`2000-01-01T${item.end_time}`);
        const breakStart = new Date(`2000-01-01T${item.break_start}`);
        const breakEnd = new Date(`2000-01-01T${item.break_end}`);
        
        if (breakStart <= startTime) {
         Swal.fire({
            icon: 'error',
            title: '¡Error al crear horario!',
            text: 'El inicio del descanso debe ser posterior al inicio del horario de atención.',
            timer: 4000,
            showConfirmButton: false,
        });
          return;
        }
        
        if (breakEnd >= endTime) {
          Swal.fire({
            icon: 'error',
            title: '¡Error al crear horario!',
            text: 'El fin del descanso debe ser anterior al fin del horario de atención.',
            timer: 4000,
            showConfirmButton: false,
          });
          return;
        }
        
        if (breakStart >= breakEnd) {
          Swal.fire({
            icon: 'error',
            title: '¡Error al crear horario!',
            text: 'El inicio del descanso debe ser anterior al fin del descanso.',
            timer: 4000,
            showConfirmButton: false,
          });
          return;
        }
        Swal.fire({
            icon: 'success',
            title: '¡Horario creado exitosamente!',
            text: 'El horario se ha guardado correctamente.',
            timer: 3000,
            showConfirmButton: true,
        });
      }
    }
    
    const payload = data.availability.map(item => ({
      ...item,
      break_start: item.break_start || null,
      break_end: item.break_end || null,
    }));
    await updateAvailability(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md cursor-pointer"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
      <Card className="border-purple-100 shadow-sm mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-100 p-3">
              <CalendarDays className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Horario semanal</CardTitle>
              <CardDescription>Define los días y horarios en los que trabajas</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {initialData.map((_, index) => (
            <div key={index} className="rounded-2xl border border-pink-100 bg-white p-5 transition hover:border-pink-200 hover:shadow-sm">

              <input type="hidden" {...register(`availability.${index}.id`)} />
              <input type="hidden" {...register(`availability.${index}.day_of_week`, { valueAsNumber: true })} />
              <div className="grid gap-4 xl:grid-cols-[220px_repeat(3,1fr)] xl:items-center">
                <div className="flex items-center justify-between xl:justify-start xl:gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{DAY_NAMES[index]}</h3>
                    <p className="text-sm text-gray-500">Configurar disponibilidad</p>
                  </div>
                  <Switch
                    checked={watch(`availability.${index}.enabled`)}
                    onCheckedChange={(val) =>
                      setValue(`availability.${index}.enabled`, val, { shouldDirty: true })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desde</Label>
                  <Input type="time" {...register(`availability.${index}.start_time`)} className="border-pink-100 focus-visible:ring-pink-300" />
                </div>
                <div className="space-y-2">
                  <Label>Hasta</Label>
                  <Input type="time" {...register(`availability.${index}.end_time`)} className="border-pink-100 focus-visible:ring-pink-300" />
                </div>
                <div className="space-y-2">
                  <Label>Descanso</Label>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-10 w-10 text-pink-500" />
                    <Input type="time" {...register(`availability.${index}.break_start`)} className="border-pink-100 focus-visible:ring-pink-300" />
                    <Input type="time" {...register(`availability.${index}.break_end`)} className="border-pink-100 focus-visible:ring-pink-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}
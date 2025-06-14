"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createService } from "@/app/actions/abmServices";

export default function NewServiceCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={`border-dashed border-2 border-purple-300 hover:shadow-md transition-shadow cursor-pointer group bg-white hover:bg-purple-50`}>
          <CardHeader className="flex items-center justify-center text-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-600">Agregar servicio</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Crea un nuevo servicio personalizado
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
            <DialogHeader>
                <DialogTitle>Nuevo servicio</DialogTitle>
            </DialogHeader>
            <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await createService({
                    name,
                    price: Number(price),
                    duration: Number(duration),
                    status: true,
                  });
                  setOpen(false);
                  setName("");
                  setPrice("");
                  setDuration("");
                }}
                >
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Nombre</label>
                    <input className="border p-2 rounded" type="text" required name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Precio</label>
                    <input className="border p-2 rounded" type="number" required name="price" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Duración (min)</label>
                    <input className="border p-2 rounded" type="number" required name="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}/>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="cursor-pointer">
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
                        Guardar
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  );
}
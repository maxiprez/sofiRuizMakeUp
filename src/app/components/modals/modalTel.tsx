"use client";
import Input from "../Input";
import { useRegister } from "../../hooks/useRegister";
import Button from "../Button";
import { useUpdateTel } from "@/app/hooks/useUpdateTel";
import { Session } from "next-auth";

interface ModalTelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
  selectedDate: string;
  selectedTime: string;
  handleReserve: (
    service: string,
    date: string,
    selectedTime: string,
    session: Session
  ) => void;
  session: Session;
}

export default function ModalTel({ isOpen, onClose, selectedService, selectedDate, selectedTime, handleReserve, session }: ModalTelProps) {
const { tel, setTel } = useRegister();
const { updateTel } = useUpdateTel();
const userId = session?.user?.id;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      await updateTel(userId, tel);
      session.user.tel = tel;
      handleReserve(selectedService, selectedDate, selectedTime, session);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black opacity-50 z-40" onClick={onClose} />
            <div className="relative z-50 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Ingresá tu número de teléfono
                </h2>
                <form onSubmit={handleSubmit}>
                    <Input
                    labelText="Número de teléfono"
                    name="tel"
                    id="tel"
                    htmlType="tel"
                    required
                    placeholder="Ej: 1129993848"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    button={false}
                    inputMode="tel"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button 
                          type="button"
                          text="Cancelar"
                          className={`bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 cursor-pointer`}
                          onClick={onClose}
                        />
                        <Button 
                          type="submit"
                          text="Confirmar"

                          className={`bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 cursor-pointer`}
                        />
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  );
}

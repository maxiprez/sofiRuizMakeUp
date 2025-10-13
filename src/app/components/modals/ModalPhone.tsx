"use client";
import Input from "../Input";
import { useRegister } from "../../hooks/useRegister";
import Button from "../CustomBtn";
import { useUpdatePhone } from "@/app/hooks/useUpdatePhone";
import { Session } from "next-auth";
import { formatToNumbersOnly } from '@/utils/utilsFormat';

export interface ModalPhoneProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId: string;
  selectedDate: string;
  selectedTime: string;
  handleReserve: (
    service_id: string,
    date: string,
    selectedTime: string,
    session: Session
  ) => void;
  session: Session;
}

export default function ModalPhone({ isOpen, onClose, selectedServiceId, selectedDate, selectedTime, handleReserve, session }: ModalPhoneProps) {
const { tel, setTel } = useRegister();
const { updateTel } = useUpdatePhone();
const userId = session?.user?.id;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      await updateTel(userId, tel);
      session.user.tel = tel;
      handleReserve(selectedServiceId, selectedDate, selectedTime, session);
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
                      placeholder="1129993848"
                      value={tel}
                      onChange={(e) => setTel(formatToNumbersOnly(e.target.value))}
                      button={false}
                      inputMode="tel"
                      maxLength={10}
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

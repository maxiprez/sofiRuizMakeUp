import { Button } from "@/app/components/ui/button";

export function SaveModalButton ({
        selectedClient,
        selectedService,
        selectedDate,
        selectedTime,
        modalMode,
        bookingId,
        isSaving,
        handleAdminReserve,
        handleEditBooking,
        onOpenChange
    }: {
        selectedClient: string;
        selectedService: string;
        selectedDate: string;
        selectedTime: string;
        modalMode: 'new' | 'edit';
        bookingId: string | null;
        isSaving: boolean;
        handleAdminReserve: (service: string, date: string, time: string, client: { user: string }) => void;
        handleEditBooking: (bookingId: string, service: string, date: string, time: string, client: { user: string }) => void;
        onOpenChange: (open: boolean) => void;
    }) {
    const handleSubmit = () => {
    if (!selectedClient || !selectedService || !selectedDate || !selectedTime) return;
    
    if (modalMode === 'new') {
        handleAdminReserve(selectedService, selectedDate, selectedTime, { user: selectedClient });
    } else if (modalMode === 'edit' && bookingId) {
        handleEditBooking(bookingId, selectedService, selectedDate, selectedTime, { user: selectedClient });
    }
    
    onOpenChange(false);
    };

    const isDisabled = isSaving || !selectedClient || !selectedService || !selectedDate || !selectedTime || 
                  (modalMode === 'edit' && !bookingId);

    return (
        <Button
            className="bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
            onClick={handleSubmit}
            disabled={isDisabled}
        >
            {isSaving ? "Guardando..." : modalMode === 'new' ? "Guardar Cita" : "Editar Cita"}
        </Button>
    );
}

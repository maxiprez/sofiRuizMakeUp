interface ReminderEmailProps {
    userFullName: string | null | undefined;
    serviceName: string;
    date: string;
    time: string;
}

export default function ReminderEmail({ userFullName, serviceName, date, time }: ReminderEmailProps) {
  return (
   `
   <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recordatorio de tu Turno</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; margin-bottom: 20px; }
                    h1 { color: #000; margin-top: 0; margin-bottom: 10px; }
                    h2 { color: #e91e63; margin-top: 0; margin-bottom: 15px; }
                    .details-section { margin-bottom: 25px; border: 1px solid #ddd; padding: 15px; border-radius: 4px; }
                    .details-section h2 { color: #e91e63; margin-top: 0; margin-bottom: 10px; font-size: 18px; }
                    .detail-item { margin-bottom: 10px; }
                    .label { font-weight: bold; color: #555; display: inline-block; width: 80px; }
                    .value { display: inline-block; }
                    .contact-info { margin-top: 30px; text-align: center; color: #777; }
                    .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Hola, ${userFullName}</h1>
                        <h2>¡Mañana es tu turno agendado!</h2>
                    </div>
                    <div class="details-section">
                        <h2>Detalles del turno:</h2>
                        <div class="detail-item">
                            <span class="label">Servicio:</span> <span class="value">${serviceName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Día:</span> <span class="value">${date}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Hora:</span> <span class="value">${time}hs.</span>
                        </div>
                    </div>
                    <p>Te espero 💖</p>
                    <div class="contact-info">
                        <p>Si necesitás reprogramar o tenés alguna consulta, escribime:</p>
                        <p>Email: <a href="mailto:info@sofiruiz.com.ar">info@sofiruiz.com.ar</a></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Sofi Ruiz Makeup. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
   `
  );
}

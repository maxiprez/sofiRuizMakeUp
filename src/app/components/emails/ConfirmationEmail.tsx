interface ConfirmationEmailProps {
    userFullName: string | null | undefined;
    service: string;
    date: string;
    time: string;
}

export default function ConfirmationEmail({ userFullName, service, date, time }: ConfirmationEmailProps) {
  return (
   `
   <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de tu Turno</title>
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
                    .button-container { text-align: center; margin-top: 30px; }
                    .button { display: inline-block; background-color: #e91e63; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .contact-info { margin-top: 30px; text-align: center; color: #777; }
                    .social-links { margin-top: 15px; text-align: center; }
                    .social-links a { display: inline-block; margin: 0 10px; color: #e91e63; text-decoration: none; font-size: 16px; }
                    .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Hola, ${userFullName}</h1>
                        <h2>¡Tu Turno ha sido Confirmado!</h2>
                    </div>

                    <div class="details-section">
                        <h2>Detalles del turno:</h2>
                        <div class="detail-item">
                            <span class="label">Servicio:</span> <span class="value">${service}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Día:</span> <span class="value">${date}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Hora:</span> <span class="value">${time}hs.</span>
                        </div>
                        </div>

                    <p>¡Muchas gracias por seguir eligiendome!</p>

                    <div class="contact-info">
                        <p>Si tenés alguna pregunta o necesitas realizar algún cambio, no dudes en contactarnos:</p>
                        <p>Email: <a href="mailto:sofiadalilaruiz@gmail.com">sofiadalilaruiz@gmail.com</a></p>
                        </div>

                    <div class="social-links">
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

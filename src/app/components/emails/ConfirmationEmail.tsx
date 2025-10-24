export function ConfirmationEmail({
  userFullName,
  serviceName,
  date,
  time,
}: {
  userFullName: string | null | undefined;
  serviceName: string;
  date: string;
  time: string;
}) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Confirmación de Turno</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0 0 10px 0; color: #000;">Hola, ${userFullName}</h1>
          <h2 style="margin: 0 0 15px 0; color: #e91e63;">¡Tu turno ha sido confirmado!</h2>
          <p style="margin-bottom: 15px; color: #555;">Gracias por elegirnos. A continuación, los detalles de tu turno:</p>
        </div>
  
        <div style="background-color: #fdf2f8; border: 1px solid #f8bbd0; padding: 15px; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; color: #e91e63; font-size: 16px;">Detalles del turno:</h3>
          <p style="margin: 5px 0;"><strong style="color: #555;">Servicio:</strong> ${serviceName}</p>
          <p style="margin: 5px 0;"><strong style="color: #555;">Día:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong style="color: #555;">Hora:</strong> ${time} hs</p>
        </div>
  
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://sofiruiz.com.ar"
             style="display: inline-block; background-color: #e91e63; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
            Ver mis turnos / Reprogramar
          </a>
        </div>
  
        <div style="text-align: center; margin-top: 30px; color: #777; font-size: 13px;">
          <p>¿Tenés dudas o necesitás ayuda?</p>
          <p>Escribinos a <a href="mailto:info@sofiruiz.com.ar" style="color: #e91e63; text-decoration: none;">info@sofiruiz.com.ar</a></p>
        </div>
  
        <div style="text-align: center; margin-top: 30px; color: #aaa; font-size: 12px;">
          © 2025 Sofi Ruiz Makeup. Todos los derechos reservados.
        </div>
      </div>
    </body>
  </html>
  `;
}
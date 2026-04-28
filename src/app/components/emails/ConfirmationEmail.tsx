export function ConfirmationEmail({
  userFullName,
  serviceName,
  date,
  time,
}: {
  userFullName: string | null | undefined
  serviceName: string
  date: string
  time: string
}) {
  const currentYear = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Turno</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; background-color: #f9f0f5; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(219, 39, 119, 0.1); }
    .header { background-color: #db2777; padding: 28px 30px; text-align: center; }
    .header .brand { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 10px; }
    .header h1 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .header p { font-size: 14px; color: rgba(255,255,255,0.85); }
    .body { padding: 28px 30px; }
    .intro { font-size: 14px; color: #6b7280; margin-bottom: 20px; }
    .details-card { border: 1px solid #fbcfe8; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px; background-color: #fdf2f8; }
    .details-card .card-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #db2777; margin-bottom: 14px; }
    .detail-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-icon { font-size: 15px; flex-shrink: 0; }
    .detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; display: block; }
    .detail-value { font-size: 14px; font-weight: 600; color: #1f2937; }
    .btn-primary { display: block; text-align: center; text-decoration: none; background-color: #db2777; color: #ffffff; border-radius: 8px; font-weight: 700; font-size: 14px; padding: 13px 24px; margin-bottom: 22px; }
    .contact { text-align: center; color: #6b7280; font-size: 13px; }
    .contact a { color: #db2777; text-decoration: none; font-weight: 600; }
    .footer { padding: 14px 30px 20px; text-align: center; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="brand">Sofi Ruiz Makeup</p>
      <h1>Hola, ${userFullName}!</h1>
      <p>Tu turno ha sido confirmado</p>
    </div>
    <div class="body">
      <p class="intro">Gracias por elegirnos. A continuación los detalles de tu turno:</p>
      <div class="details-card">
        <p class="card-title">Detalles del turno</p>
        <div class="detail-row">
          <span class="detail-icon">💄</span>
          <div>
            <span class="detail-label">Servicio</span>
            <span class="detail-value">${serviceName}</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-icon">📅</span>
          <div>
            <span class="detail-label">Día</span>
            <span class="detail-value">${date}</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-icon">🕐</span>
          <div>
            <span class="detail-label">Hora</span>
            <span class="detail-value">${time} hs.</span>
          </div>
        </div>
      </div>
      <a href="https://sofiruiz.com.ar/my-bookings" class="btn-primary">Ver mis turnos / Reprogramar</a>
      <div class="contact">
        <p>¿Tenés dudas o necesitás ayuda?</p>
        <p>Escribinos a <a href="mailto:info@sofiruiz.com.ar">info@sofiruiz.com.ar</a></p>
      </div>
    </div>
    <div class="footer">
      <p>© ${currentYear} Sofi Ruiz Makeup. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `
}
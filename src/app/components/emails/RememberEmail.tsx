export function RememberEmail({
  userFullName,
  serviceName,
  date,
  time,
  confirmUrl,
}: {
  userFullName: string | null | undefined
  serviceName: string
  date: string
  time: string
  confirmUrl: string
}) {
  const currentYear = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio de Turno</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background-color: #f9f0f5;
      padding: 20px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #ec4899, #db2777);
      padding: 32px 30px;
      text-align: center;
      color: white;
    }
    .header .brand {
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.85;
      margin-bottom: 12px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .header p {
      font-size: 15px;
      opacity: 0.9;
    }

    .body { padding: 30px; }

    .details-card {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .details-card h2 {
      color: #db2777;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }
    .detail-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 10px;
    }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-icon { font-size: 16px; flex-shrink: 0; width: 24px; }
    .detail-info { flex: 1; }
    .detail-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      display: block;
    }
    .detail-value {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .actions { margin-bottom: 24px; }
    .btn {
      display: block;
      text-decoration: none;
      text-align: center;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 24px;
      margin-bottom: 10px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #ec4899, #db2777);
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35);
    }
    .btn-secondary {
      background: transparent;
      color: #db2777 !important;
      border: 2px solid #db2777;
    }
    .btn-ghost {
      background: transparent;
      color: #9ca3af !important;
      border: 1px solid #e5e7eb;
      font-size: 13px;
      font-weight: 400;
    }

    .closing {
      text-align: center;
      padding: 0 10px 4px;
      color: #6b7280;
      font-size: 14px;
    }

    .contact {
      border-top: 1px solid #f3f4f6;
      margin-top: 24px;
      padding-top: 20px;
      text-align: center;
    }
    .contact a {
      color: #db2777;
      text-decoration: none;
      font-weight: 600;
    }
    .contact p { color: #9ca3af; font-size: 13px; margin-bottom: 4px; }

    .footer {
      background: #fdf2f8;
      padding: 16px 30px;
      text-align: center;
      color: #d1d5db;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <p class="brand">✨ Sofi Ruiz Makeup</p>
      <h1>¡Hola, ${userFullName}!</h1>
      <p>Mañana es tu turno 🎉</p>
    </div>

    <div class="body">

      <div class="details-card">
        <h2>📋 Detalles del turno</h2>
        <div class="detail-row">
          <span class="detail-icon">💄</span>
          <div class="detail-info">
            <span class="detail-label">Servicio</span>
            <span class="detail-value">${serviceName}</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-icon">📅</span>
          <div class="detail-info">
            <span class="detail-label">Día</span>
            <span class="detail-value">${date}</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-icon">🕐</span>
          <div class="detail-info">
            <span class="detail-label">Hora</span>
            <span class="detail-value">${time} hs.</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <a href="${confirmUrl}" class="btn btn-primary">
          Confirmar mi turno
        </a>
        <a href="https://sofiruiz.com.ar/my-bookings" class="btn btn-secondary">
          Reprogramar
        </a>
      </div>

      <div class="closing">
        <p>¡Te espero! 💖</p>
      </div>

      <div class="contact">
        <p>¿Consultas? Escribime por</p>
        <p>
          <a href="https://instagram.com/sofiruizmakeup">@sofiruizmakeup</a>
          &nbsp;·&nbsp;
          <a href="https://wa.me/5491154897213">WhatsApp</a>
        </p>
      </div>

    </div>

    <div class="footer">
      © ${currentYear} Sofi Ruiz Makeup · Todos los derechos reservados
    </div>
  </div>
</body>
</html>
  `
}
export function ConfirmationEmail({
  serviceName,
  date,
  time,
}: {
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
  <title>Turno confirmado</title>

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
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.12);
    }

    .header {
      background: linear-gradient(135deg, #ec4899, #db2777);
      padding: 28px;
      text-align: center;
      color: #fff;
    }

    .brand {
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.85;
      margin-bottom: 8px;
    }

    .header h1 {
      font-size: 22px;
      margin-bottom: 4px;
    }

    .header p {
      font-size: 14px;
      opacity: 0.9;
    }

    .body {
      padding: 28px;
    }

    .card {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 10px;
      padding: 18px;
    }

    .card h2 {
      font-size: 13px;
      color: #db2777;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .icon { width: 20px; }

    .label {
      font-size: 11px;
      text-transform: uppercase;
      color: #9ca3af;
    }

    .value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .status {
      margin-top: 18px;
      padding: 12px;
      border-radius: 8px;
      background: #dcfce7;
      color: #166534;
      font-weight: 600;
      text-align: center;
      font-size: 13px;
    }

    .footer {
      text-align: center;
      padding: 16px;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #f3f4f6;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <div class="brand">Sofi Ruiz Makeup</div>
      <h1>¡Turno confirmado!</h1>
      <p>Tu reserva fue confirmada correctamente</p>
    </div>

    <div class="body">

      <div class="card">
        <h2>Detalles del turno</h2>

        <div class="row">
          <div class="icon">💄</div>
          <div>
            <div class="label">Servicio</div>
            <div class="value">${serviceName}</div>
          </div>
        </div>

        <div class="row">
          <div class="icon">📅</div>
          <div>
            <div class="label">Fecha</div>
            <div class="value">${date}</div>
          </div>
        </div>

        <div class="row">
          <div class="icon">🕐</div>
          <div>
            <div class="label">Hora</div>
            <div class="value">${time} hs</div>
          </div>
        </div>

        <div class="status">
          ✔ Este turno está confirmado
        </div>
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
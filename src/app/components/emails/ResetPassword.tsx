interface ResetPasswordEmailProps {
    userFullName: string | null | undefined;
    resetLink: string;
  }
  
  export default function ResetPasswordEmail({ userFullName, resetLink }: ResetPasswordEmailProps) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
        <style>
            body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            h1 { color: #000; margin-top: 0; margin-bottom: 10px; }
            h2 { color: #e91e63; margin-top: 0; margin-bottom: 15px; }
            p { margin-bottom: 20px; }
            .button-container { text-align: center; margin-top: 30px; }
            .button { display: inline-block; background-color: #e91e63; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Hola, ${userFullName || 'usuario'}</h1>
                <h2>¿Olvidaste tu contraseña?</h2>
            </div>
  
            <p>Recibimos una solicitud para restablecer tu contraseña. Para continuar, hacé clic en el botón de abajo:</p>
  
            <div class="button-container">
                <a href="${resetLink}" class="button" style="text-decoration: none; color: #fff;">Restablecer Contraseña</a>
            </div>
  
            <p>Si vos no solicitaste este cambio, podés ignorar este mensaje. Tu contraseña actual seguirá siendo válida.</p>
  
            <div class="footer">
                <p>© 2025 Sofi Ruiz Makeup. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
  
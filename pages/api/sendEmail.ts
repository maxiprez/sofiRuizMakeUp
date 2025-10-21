import { NextApiRequest, NextApiResponse } from 'next';

type SendEmailProps = {
  toEmail: string;
  subject: string;
  htmlContent: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { toEmail, subject, htmlContent } = req.body as SendEmailProps;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'Sofi Ruiz Turno', email: process.env.EMAIL_SENDER! },
        to: [{ email: toEmail }],
        cc: process.env.EMAIL_CC ? [{ email: process.env.EMAIL_CC! }] : [],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error al enviar correo Brevo:', error);
      return res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    }

    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error general al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
}

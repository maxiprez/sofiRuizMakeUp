export const runtime = "nodejs";
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
    const response = await resend.emails.send({
      from: `Sofi Ruiz <${process.env.EMAIL_SENDER!}>`,
      to: [toEmail],
      subject,
      html: htmlContent,
      cc: process.env.EMAIL_CC ? [process.env.EMAIL_CC!] : [],
    });

    if (response.error) {
      console.error("Error al enviar correo Resend: ", response.error);
      return res.status(500).json({ error: response.error.message });
    }

    res.status(200).json({ message: 'Correo enviado correctamente con Resend' });
  } catch (error) {
    console.error('Error general al enviar correo con Resend:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
}
import SibApiV3Sdk from "@getbrevo/brevo";
import { NextApiRequest, NextApiResponse } from 'next';

type SendEmailProps = {
  toEmail: string;
  subject: string;
  htmlContent: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { toEmail, subject, htmlContent } = req.body as SendEmailProps;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.sender = { name: 'Sofi Ruiz Turno', email: process.env.EMAIL_SENDER! };
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.htmlContent = htmlContent;

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Correo electrónico enviado:', data);
      res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string
});

export interface EmailPayload {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  templateId?: number;
  params?: Record<string, any>;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const req: any = {
    subject: payload.subject,
    htmlContent: payload.htmlContent,
    sender: {
      name: process.env.EMAIL_FROM_NAME || "Sistema UEMG",
      email: process.env.EMAIL_FROM_ADDRESS || "nao-responda@uemg.br",
    },
    to: [
      {
        email: payload.toEmail,
        name: payload.toName || payload.toEmail,
      },
    ],
  };

  if (payload.templateId) {
    req.templateId = payload.templateId;
    req.params = payload.params;
  }

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail(req);
    console.log('E-mail enviado com sucesso. Message ID:', response);
  } catch (error) {
    console.error('Falha ao enviar o e-mail via Brevo:', error);
    throw new Error('Falha no envio de e-mail');
  }
}

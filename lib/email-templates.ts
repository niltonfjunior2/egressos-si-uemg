export function getPasswordRecoveryEmailHtml(actionLink: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 40px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
      color: #475569;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .fallback-link {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      word-break: break-all;
      font-size: 13px;
      color: #64748b;
      margin-top: 24px;
    }
    .fallback-link a {
      color: #2563eb;
      text-decoration: underline;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Portal de Egressos - UEMG</h1>
    </div>
    <div class="content">
      <p>Olá,</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta no Portal de Egressos do Curso de Sistemas de Informação da UEMG Carangola. Se você fez essa solicitação, clique no botão abaixo para escolher uma nova senha.</p>
      
      <div class="button-container">
        <a href="${actionLink}" class="button">Redefinir Minha Senha</a>
      </div>
      
      <p>Este link é exclusivo para você e expirará em 24 horas por motivos de segurança.</p>
      
      <div class="fallback-link">
        Se o botão não funcionar, copie e cole este link no seu navegador:<br>
        <br>
        <a href="${actionLink}">${actionLink}</a>
      </div>
    </div>
    <div class="footer">
      <p>Se você não solicitou a redefinição de senha, ignore este e-mail. Nenhuma alteração será feita na sua conta.</p>
      <p style="margin-top: 12px;">&copy; 2024 Sistemas de Informação - UEMG Carangola</p>
    </div>
  </div>
</body>
</html>
  `;
}

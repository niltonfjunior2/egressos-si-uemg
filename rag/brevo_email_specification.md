# Especificação Técnica: Integração de Envio de E-mails com BREVO

Este documento descreve os requisitos, a arquitetura e as etapas necessárias para integrar a plataforma **Brevo** (antigo Sendinblue) para envio de e-mails transacionais e de marketing em um novo projeto.

## 1. Visão Geral e Objetivos

O objetivo desta integração é prover um serviço de envio de e-mails confiável, escalável e de fácil manutenção utilizando a infraestrutura do Brevo. Esta solução será utilizada para envio de e-mails transacionais (como recuperação de senha, confirmação de cadastro e notificações).

## 2. Pré-requisitos e Configuração da Conta

Antes de iniciar o desenvolvimento, é necessário realizar as seguintes configurações no painel do Brevo:

- **Conta Ativa:** Criar e validar uma conta no [Brevo](https://www.brevo.com/).
- **Domínio Autenticado:** Configurar e validar o domínio de envio (adicionando os registros TXT/DKIM/SPF no painel de DNS do domínio). Isso é crucial para garantir a entregabilidade e evitar que os e-mails caiam na caixa de spam.
- **Chave de API (API Key):** Gerar uma chave de API v3 no painel de configurações do Brevo (Configurações > SMTP & API).
- **Remetentes (Senders):** Cadastrar os endereços de e-mail remetentes oficiais (ex: `nao-responda@seudominio.com.br`).

## 3. Arquitetura e Integração

Existem duas formas principais de integrar o Brevo: via **SMTP Relay** ou via **API REST (SDK)**. Recomenda-se fortemente a utilização da **API via SDK oficial** por oferecer melhor performance, segurança e acesso a recursos avançados (como templates dinâmicos, tags e webhooks).

### 3.1. Variáveis de Ambiente

As seguintes chaves devem ser configuradas de forma segura no ambiente da aplicação (ex: arquivo `.env` ou gerenciador de secrets):

```env
# Chave de API gerada no painel do Brevo
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxx"

# Endereço e nome padrão do remetente
EMAIL_FROM_ADDRESS="nao-responda@seudominio.com.br"
EMAIL_FROM_NAME="Nome do Projeto"
```

> [!WARNING]
> Nunca exponha a `BREVO_API_KEY` no controle de versão (Git) ou no lado do cliente (frontend). Ela deve residir exclusivamente no backend.

### 3.2. Dependências (Exemplo: Node.js)

Para projetos baseados em Node.js / TypeScript, deve-se utilizar o SDK oficial mais recente:

```bash
npm install @getbrevo/brevo
```

> [!NOTE]
> A partir da versão 6.0.0, o pacote `@getbrevo/brevo` é o padrão oficial, substituindo o antigo `sib-api-v3-sdk`. Para outras linguagens (Python, PHP, Java, etc), consulte a [Documentação de Desenvolvedores do Brevo](https://developers.brevo.com/).

## 4. Implementação Técnica

Abaixo segue um exemplo de implementação para uma base Node.js/TypeScript. A mesma lógica se aplica a outras linguagens usando o SDK correspondente.

### 4.1. Configuração do Cliente da API

Crie um módulo ou serviço para instanciar e configurar a API do Brevo:

```typescript
import * as brevo from '@getbrevo/brevo';

// Configuração da instância da API
const apiInstance = new brevo.TransactionalEmailsApi();

// Configurando a chave de API
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

export { apiInstance };
```

### 4.2. Função de Envio de E-mail

A função de envio deve ser capaz de receber parâmetros dinâmicos, como destinatário, assunto, conteúdo (HTML ou texto) e suporte a Templates do Brevo.

```typescript
import { apiInstance } from './brevoConfig';
import * as brevo from '@getbrevo/brevo';

export interface EmailPayload {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  templateId?: number;
  params?: Record<string, any>;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = payload.subject;
  sendSmtpEmail.htmlContent = payload.htmlContent;
  sendSmtpEmail.sender = {
    name: process.env.EMAIL_FROM_NAME,
    email: process.env.EMAIL_FROM_ADDRESS
  };
  sendSmtpEmail.to = [{ 
    email: payload.toEmail, 
    name: payload.toName || payload.toEmail 
  }];

  // Se usar templates do Brevo, mesclamos os parâmetros
  if (payload.templateId) {
    sendSmtpEmail.templateId = payload.templateId;
    sendSmtpEmail.params = payload.params;
  }

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('E-mail enviado com sucesso. Message ID:', response.body.messageId);
  } catch (error) {
    console.error('Falha ao enviar o e-mail via Brevo:', error);
    throw new Error('Falha no envio de e-mail');
  }
}
```

## 5. Casos de Uso com Templates Dinâmicos

O Brevo permite criar templates visuais diretamente no painel deles. O backend apenas precisa passar o ID do template e as variáveis customizadas (`params`).

**Vantagens:**
- O time de marketing ou design pode alterar o e-mail sem precisar de deploy no backend.
- Facilita o envio de e-mails estruturalmente complexos e responsivos.

**Exemplo de uso:**
```typescript
await sendEmail({
  toEmail: 'usuario@exemplo.com',
  toName: 'João da Silva',
  subject: 'Bem-vindo ao nosso serviço!',
  htmlContent: '', // Pode ficar vazio pois o conteúdo virá do template
  templateId: 12,  // ID numérico do template configurado no painel do Brevo
  params: {
    NOME_USUARIO: 'João',
    LINK_CONFIRMACAO: 'https://seudominio.com.br/confirmar?token=xyz'
  }
});
```

## 6. Tratamento de Erros e Resiliência

Para construir um sistema robusto:
1. **Filas de Processamento (Queues):** Evite enviar e-mails de forma síncrona no fluxo de requisições web. É altamente recomendado o uso de um sistema de fila de mensagens (ex: Redis com BullMQ, RabbitMQ, ou Amazon SQS) para o processamento assíncrono. Isso evita perda de disparos caso a API do Brevo sofra instabilidade.
2. **Logs e Rastreabilidade:** Registre no seu banco de dados o `messageId` retornado pela API para cada envio importante. Isso permite rastrear e auditar problemas.

## 7. Webhooks (Opcional, porém recomendado)

Para rastrear o status real e o engajamento dos e-mails (Entregue, Aberto, Clicado, Bounced, Marcado como Spam), configure **Webhooks** no painel do Brevo.
1. Crie uma rota/endpoint público e seguro no seu projeto (ex: `POST /api/webhooks/brevo`).
2. Cadastre a URL desse endpoint nas configurações de Webhook do Brevo.
3. O Brevo enviará um payload JSON assíncrono notificando as mudanças de status de entrega para cada e-mail disparado.
4. Você poderá processar esses eventos para limpar listas de contatos (bounces) ou disparar ações baseado em cliques.

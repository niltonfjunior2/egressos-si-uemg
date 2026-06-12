import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { sendEmail } from './lib/brevo';

async function main() {
    try {
        console.log("Tentando enviar...");
        await sendEmail({
            toEmail: 'teste@example.com',
            subject: 'Teste Brevo',
            htmlContent: '<h1>Teste</h1>'
        });
        console.log("Sucesso!");
    } catch (e) {
        console.error("Erro capturado:", e);
    }
}

main();

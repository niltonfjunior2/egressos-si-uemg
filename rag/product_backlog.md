# PRODUCT BACKLOG & DÉBITOS TÉCNICOS

Documento de rastreamento de melhorias contínuas e débitos técnicos remanescentes identificados em auditorias.

## 🔴 Alta Prioridade
- [ ] **Rate Limiting em Recuperação de Senha:** Adicionar controle de taxa (ex: máximo 3 tentativas por hora por IP/e-mail) na Server Action `recoverPassword` para mitigar ataques de negação de serviço contra a cota transacional do Brevo.

## 🟡 Média Prioridade
- [ ] **Desativação de Rotas de Seed em Produção:** Garantir que o endpoint `app/api/seed-admin` seja categoricamente rejeitado em ambientes não locais, mesmo na presença do parâmetro `secret`.

## 🟢 Baixa Prioridade / Code Radar
- [ ] **Migração do Middleware para Proxy (Next.js 16):** Ajustar o arquivo `middleware.ts` para a nova convenção `proxy.ts` recomendada pelas versões recentes do Next.js.

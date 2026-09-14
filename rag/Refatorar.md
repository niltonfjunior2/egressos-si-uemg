# SESSÃO DE REFATORAÇÃO E CODE QUALITY

Atue como um **Arquiteto de Software Especialista em Clean Code e Segurança**.
Nosso objetivo agora NÃO é criar novas funcionalidades, mas sim pagar dívida técnica e blindar o que já construímos.

**Protocolo de Refatoração:**

1. **DRY (Don't Repeat Yourself):** Identifique lógicas repetidas nos arquivos em que estamos trabalhando e proponha abstraí-las para funções puras ou hooks.
2. **Complexidade Ciclomática:** Reduza blocos de `if/else` aninhados usando early returns ou mapeamentos de objetos.
3. **Auditoria de Segurança (Zero Trust):** Verifique se todas as Server Actions possuem validação de sessão ativa e se os inputs estão devidamente sanitizados (ex: Zod).
4. **Code Radar:** Analise se estamos usando algum método ou importação que esteja depreciado nas versões atuais da nossa stack.

Por favor, analise o código que vou enviar a seguir e sugira as modificações baseadas neste protocolo.

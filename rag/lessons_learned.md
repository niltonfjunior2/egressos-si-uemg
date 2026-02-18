# KNOWLEDGE BASE & LESSONS LEARNED
>
> Este arquivo é a memória evolutiva do projeto AESIS (Acompanhamento de Egressos do Curso de Sistemas de Informação da UEMG Carangola).
> Stack: Next.js, Supabase Client (Sem Prisma), TailwindCSS, Shadcn/UI.

## FORMATO DE REGISTRO

### [DATA] - [CATEGORIA] Título Curto do Problema

**Contexto:** Breve descrição do erro ou do requisito obscuro.
**Solução:** O que foi feito para resolver (snippets de código, comandos, mudança de lógica).
**Prevenção:** O que verificar no futuro para evitar reincidência.

---

## REGISTROS DE INFRA & BACKEND (SUPABASE)

### [2026-01-16] - [INFRA] Cold Starts do Supabase

**Contexto:** O banco entra em pausa após inatividade (Free Tier). A primeira requisição falha por timeout ou demora excessiva.
**Solução:** Implementar feedback visual de "Carregando sistema..." ou "Acordando banco de dados..." na UI quando a latência for alta.
**Prevenção:** Testar sempre a aplicação após 1h de inatividade para validar a UX do cold start.

### [2026-01-18] - [AUTH] Confirmação de Email vs Supabase Admin

**Contexto:** Novos cadastros manuais falham no login imediato com erro "Email not confirmed". O projeto requer que usuários criados pela coordenação já nasçam ativos.
**Solução:** Usar `supabaseAdmin.auth.admin.createUser` com `email_confirm: true`. Necessário configurar `SUPABASE_SERVICE_ROLE_KEY` no `.env` e usar cliente Admin separado.
**Prevenção:** Se precisar criar usuários "pré-aprovados" (Professores/Egressos importados), sempre use a API Admin do Supabase (Service Role), nunca a API pública `signUp`.

### [2026-01-17] - [DB] Tratamento de Erro Postgres 23505 (Unique Constraint)

**Contexto:** Ao cadastrar usuário com email ou matrícula já existentes, o Supabase retorna erro SQL code `23505`.
**Solução:** Capturar o erro retornado pelo `supabase.from().insert()`:

```ts
if (error?.code === '23505') {
  return { error: 'Este registro (email/matrícula) já existe.' }
}

```

**Prevenção:** Sempre tratar códigos de erro PG padrão em formulários de criação.

### [2026-01-21] - [DB] Restauração e Limpeza (SQL Editor)

**Contexto:** Necessidade de resetar o ambiente. O Supabase Dashboard SQL Editor é mais confiável que migrações via CLI em momentos de crise.
**Solução:** Manter um arquivo `schema.sql` atualizado na raiz do projeto. Para resetar: copiar conteúdo -> colar no SQL Editor do Supabase -> Run.
**Prevenção:** Não dependa apenas de migrações automáticas. Tenha sempre o `schema.sql` completo como backup de recuperação de desastre.

### [2026-01-24] - [DB/OPS] Limpeza Real de Produção (TRUNCATE)

**Contexto:** `DELETE FROM tabela` não reseta os IDs autoincrementais (se houver) e pode ser lento.
**Solução:** Uso de `TRUNCATE TABLE profiles RESTART IDENTITY CASCADE;`.
**Prevenção:** Em scripts de "Clean Slate" para homologação, usar sempre TRUNCATE com CASCADE para garantir limpeza total das relações.

### [2026-02-16] - [SQL/RLS] Idempotência em Scripts de Migração

**Contexto:** Erro `policy "..." already exists` ao rodar scripts de correção de RLS mais de uma vez.
**Solução:** Sempre usar `DROP POLICY IF EXISTS "NomeDaPolicy" ON tabela;` antes de `CREATE POLICY`.
**Prevenção:** Scripts de manutenção de banco devem ser re-executáveis (idempotentes) para facilitar depuração.

### [2026-02-16] - [DB/SCHEMA] Inconsistência de Nomes de Coluna (`profile_id` vs `author_id`)

**Contexto:** O banco evoluiu para usar `author_id` em `feed_posts` e `opportunities`, mas o código legado e types ainda buscavam `profile_id`, causando queries vazias silenciosas.
**Solução:** Auditoria completa no `schema.sql` vs código TypeScript. Atualizar interfaces e queries do Supabase para bater com a definição do banco.
**Prevenção:** Ao renomear colunas no banco, varrer o código procurando pelo nome antigo imediatamente.

### [2026-02-16] - [AUTH/RLS] Conteúdo Público vs RLS

**Contexto:** Feed não aparecia na Landing Page (rota pública) apesar da query estar certa.
**Solução:** As policies RLS estavam `TO authenticated`. Para páginas públicas, é necessário criar policies específicas `TO public` para `SELECT`.
**Prevenção:** Se o dado deve aparecer na Home (deslogado), o RLS deve permitir explicitamente o role `public` ou `anon`.

---

## REGISTROS DE FRONTEND & NEXT.JS

### [2026-01-16] - [NEXTJS] Middleware e Rotas Públicas

**Contexto:** Loop de redirecionamento infinito na Landing Page (`/`).
**Solução:** Explicitar exceção para `req.nextUrl.pathname !== '/'` no middleware de proteção de rotas.
**Prevenção:** Ao criar páginas públicas (Login, Sobre, Termos), adicionar imediatamente à whitelist do middleware.

### [2026-01-16] - [UX] Skeletons e Feedback Visual

**Contexto:** "Piscada" de conteúdo ou tela branca enquanto dados carregam via Client Component.
**Solução:** Criação de `loading.tsx` com Skeletons (Shadcn UI) replicando o layout final.
**Prevenção:** Sempre criar `loading.tsx` para rotas que fazem fetch de dados assíncronos.

### [2026-01-17] - [NEXTJS] Importação de Zod em Server Actions

**Contexto:** Erro ao importar schema Zod de um arquivo `'use server'` para um Client Component.
**Solução:** Mover schemas de validação para arquivos "puros" (ex: `src/schemas/login-schema.ts`) sem diretiva `'use server'`.

### [2026-01-20] - [NEXTJS] Interatividade em Páginas Server-Side

**Contexto:** Necessidade de adicionar botões com confirmação (Dialogs) em página Server-Side.
**Solução:** Criar um "Client Component wrapper" (ex: `<DeleteButton />`) que contém a lógica de UI e invoca a Server Action.
**Prevenção:** Segregar: Página (Fetch) -> Componente Cliente (Interatividade) -> Server Action (Mutação).

### [2026-01-21] - [REACT] Erro `TypeError... useContext` após Wipe

**Contexto:** Após limpar cookies/banco, usuários veem erro de contexto null.
**Solução:** Garantir que `<Toaster />` e `AuthProvider` estejam no nível mais alto do `RootLayout`.
**Prevenção:** Providers globais devem sempre envolver o `children` no layout raiz.

### [2026-02-02] - [UX/AUTH] Feedback de Erro de Login Persistente

**Contexto:** Mensagem de erro estática não some ou não pisca ao tentar logar novamente com senha errada.
**Solução:** Usar `useToast` para erros efêmeros ou adicionar timestamp ao estado do erro para forçar re-render do React.

### [2026-02-16] - [NEXTJS/REACT] Erro de Hidratação com Datas Relativas

**Contexto:** `formatDistanceToNow` gera strings diferentes no Server ("há 4 min") e Client ("há 5 min"), quebrando a hidratação.
**Solução:** Adicionar `suppressHydrationWarning` no elemento `<span>` que renderiza o tempo relativo.
**Prevenção:** Qualquer dado dependente de `Date.now()` na renderização precisa de tratamento para evitar mismatch de hidratação.

---

## REGISTROS DE UX & LÓGICA DE NEGÓCIO

### [2026-01-20] - [JS/DATE] Tratamento de Datas e Timezones

**Contexto:** Datas salvas como `YYYY-MM-DD` (UTC) aparecem como dia anterior no Brasil (-3h).
**Solução:** Ao exibir datas "burocráticas" (Data de Formatura, Data de Início), usar formatação UTC explícita ou string split: `dateString.split('T')[0]`. Não instanciar `new Date()` sem tratar o fuso.
**Prevenção:** Evite `new Date()` no frontend para datas que não possuem componente de hora relevante.

### [2026-01-23] - [UX] Consistência de Botões de Ação

**Contexto:** Botões de ações críticas passavam despercebidos.
**Solução:** A ação principal da tela (ex: "Responder Pesquisa") deve ser sempre `variant="default"` (cor sólida institucional). Ações secundárias usam `variant="outline"`.
**Prevenção:** A hierarquia visual deve seguir a prioridade da tarefa do usuário.

### [2026-01-24] - [SECURITY] Cadastro de Professores/Coordenadores

**Contexto:** Risco de alunos se cadastrarem como professores se a rota for pública.
**Solução:** Remover rotas públicas de cadastro para roles elevadas. Criação deve ser via Admin Panel ou Seed Script.
**Prevenção:** Roles de confiança (`professor`, `coordinator`, `root`) nunca devem ter auto-cadastro (Self-Service Sign Up).

### [2026-01-24] - [LOGIC] Reversão de Status (Undo)

**Contexto:** Ao voltar um status de "Concluído" para "Em Análise", dados antigos (data de conclusão) persistiam.
**Solução:** A Action de reversão deve limpar explicitamente os campos de metadados (`data_conclusao = null`).
**Prevenção:** "Desfazer" exige limpar efeitos colaterais no banco, não apenas mudar a flag de status.

### [2026-02-16] - [UX/FORMS] Tipagem de Vagas: Contrato vs Modelo

**Contexto:** Confusão semântica entre "Tipo" (Estágio, Emprego) e "Modelo" (Presencial, Remoto) num único campo. O banco esperava um enum e o form enviava outro.
**Solução:** Separar em duas colunas no banco (`type` e `work_mode`) e dois campos no formulário.
**Prevenção:** Modelar o banco refletindo a realidade do negócio. Se são dois conceitos ortogonais, devem ser dois campos.

---

## BIBLIOTECAS ESPECÍFICAS (PDF & GRÁFICOS)

### [2026-01-23] - [REACT-PDF] Compatibilidade Next.js App Router

**Contexto:** Erro `Component is not a constructor` ao gerar PDF no servidor.
**Solução:** Configurar `serverComponentsExternalPackages: ['@react-pdf/renderer']` no `next.config.mjs`.
**Prevenção:** Bibliotecas pesadas de manipulação de arquivo geralmente precisam ser excluídas do bundle do Webpack no Next.js.

### [2026-01-23] - [REACT-PDF] Layout e Quebra de Linha

**Contexto:** Tabelas quebram em layouts PDF complexos.
**Solução:** Definir larguras fixas (%) e reduzir tamanho da fonte preventivamente.Não confiar no auto-layout do PDF.

### [2026-02-16] - [AUTH/EMAIL] Erro de Cadastro com Email Hifenizado

**Contexto:** Ao tentar cadastrar manualmente o usuário `admin-egressos@uemg.br` no Dashboard do Supabase o sistema rejeitou o email. Ao trocar para `adminegressos@uemg.br`, o cadastro funcionou imediatamente.
**Solução:** Evitar caracteres especiais ou hífens em emails de sistema/admin se houver relatos de instabilidade, e investigar configurações de validação de email do provedor SMTP/Auth.

### [2026-02-16] - [NEXTJS/ROUTING] Route Groups vs URL Segments

**Contexto:** Erro 404 ao acessar `/admin`. A pasta do projeto estava nomeada como `(admin)`. Em Next.js, pastas entre parênteses são "Route Groups" e não criam caminhos na URL.
**Solução:** Renomear a pasta de `app/(admin)` para `app/admin` se a intenção for criar uma rota acessível via `/admin`.
**Prevenção:** Usar `(folder)` apenas para agrupar arquivos logicamente ou compartilhar layouts sem afetar a URL. Para criar rotas, usar nomes de pasta simples.

### [2026-02-16] - [AUTH/DB] Usuários "Zumbis" (Auth Sem Profile)

**Contexto:** Admin redirecionado para `/feed` infinitamente. O usuário existia em `auth.users` (criado via dashboard) mas não tinha registro correspondente em `public.profiles` com a role `administrador`.
**Solução:** Script SQL de correção inserindo o profile manualmente.
**Prevenção:** Ao criar usuários manualmente no dashboard do Supabase, lembrar que triggers de criação de profile podem falhar ou não existir. Sempre verificar se o registro existe nas duas tabelas (`auth.users` e `public.profiles`).

### [2026-02-16] - [SECURITY] Admin RBAC Implementation

**Contexto:** Implementação do controle de acesso para o Painel Administrativo.
**Solução:**

1. **Middleware/Layout:** Verificação de `profile.role` no `layout.tsx` para redirecionar usuários não autorizados.
2. **Server Actions:** Verificação de `role` e `author_id` dentro das Server Actions (`createJob`, `updateJob`, `deleteJob`) para garantir que usuários comuns só possam editar seus próprios registros.
3. **UI:** Ocultação de links e botões na interface (`admin-sidebar.tsx`, `page.tsx`) baseada na role do usuário (passada via props ou fetch server-side).

### [2026-02-16] - [DATABASE] SQL Migration Robustness

**Contexto:** Adição de colunas e alteração de constraints em tabelas existentes (`opportunities`).
**Solução:** Uso de scripts SQL idempotentes (`ADD COLUMN IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS`) para evitar erros em múltiplas execuções.

### [2026-02-17] - [NEXTJS/AUTH] Sessão "Stale" no Middleware Após Signout

**Contexto:** Após `signOut()` na Server Action, o `redirect('/login')` é interceptado pelo middleware, que ainda lê cookies de sessão antigos e redireciona o usuário de volta para `/profile` (ou `/`). O resultado é que o usuário nunca chega à tela de login.
**Solução:** Adicionar query parameter `?signedout=true` na URL de redirect e verificar no middleware para pular o check de "usuário logado tentando acessar login".
**Prevenção:** Em fluxos de logout com `redirect` server-side, considerar que os cookies podem não estar sincronizados entre a Server Action e o Middleware na mesma request. Usar flags/query params para sinalizar transições de estado de autenticação.

### [2026-02-17] - [ARCH] Filtragem por Role no Diretório Público

**Contexto:** O Diretório de Egressos exibia todos os perfis do banco, incluindo Professores, Coordenadores e Administradores.
**Solução:** Adicionar `.in('role', ['aluno', 'egresso'])` na query do Supabase em `searchProfiles`.
**Prevenção:** Queries de listagem pública devem sempre filtrar por role para evitar exposição de dados de usuários administrativos. Nunca confiar no RLS sozinho para separação de conteúdo exibido — filtrar explicitamente no código.

### [2026-02-17] - [ARCH/DB] Evolução Incremental do Schema de Perfil

**Contexto:** O `profiles` evoluiu ao longo de várias sessões com adição de novos campos (`mobile_phone`, `social_media_url`, `lattes_url`) e remoção de outros (`avatar_url`). Cada alteração exigiu atualização sincronizada em: 1) SQL migration, 2) Zod schema, 3) Server Action, 4) UI (Wizard + View).
**Solução:** Seguir sempre o fluxo: `SQL → Schema/Types → Action → UI`. Manter `sql/schema.sql` como fonte de verdade e atualizá-lo a cada mudança.

### [2026-02-18] - [AUTH/MIDDLEWARE] Loop de Login com Sessão Morta (Stale Session)

**Contexto:** Após resetar o banco de dados, o cookie de sessão do navegador permanece válido (JWT), mas o usuário não existe mais na tabela `profiles`. O middleware detectava o usuário logado e redirecionava para `/`, mas a página `/` falhava ou o layout redirecionava de volta para login, criando um loop.
**Solução:** No middleware, além de checar `user`, verificar se o perfil existe no banco. Se não existir (mesmo com token válido), forçar logout ou permitir acesso à rota de login.
**Prevenção:** Middleware de autenticação deve ser resiliente a inconsistências entre Auth (JWT) e Dados (Banco).

### [2026-02-18] - [NEXTJS] Parâmetros Assíncronos em Next.js 15+

**Contexto:** Erro ao acessar `params.id` diretamente em Page Components (`app/admin/users/[id]/page.tsx`). No Next.js 15/16, `params` e `searchParams` tornaram-se Promises.
**Solução:** Aguardar a resolução dos parâmetros: `const { id } = await params`.
**Prevenção:** Em rotas dinâmicas recentes do Next.js, sempre tratar `params` como assíncrono.

### [2026-02-18] - [SEC/RLS] Bypass de RLS para Admin

**Contexto:** O painel administrativo precisa listar dados de todos os usuários, mas as políticas RLS (`current_user`) impedem isso por padrão.
**Solução:** Utilizar um cliente Supabase específico com `service_role` key (`createAdminClient`) apenas em rotas administrativas protegidas, explicitamente ignorando o RLS.
**Prevenção:** Segregar claramente clientes "Pessoais" (cookies, RLS ativo) de clientes "Admin" (service key, RLS bypass) para evitar vazamento acidental de dados.

### [2026-02-18] - [SEC/RLS] Update Silencioso (Policy Missing)

**Contexto:** Ao tentar atualizar o status de uma postagem, a operação `update` retornava sucesso, mas nada mudava no banco.
**Solução:** Habilitar policies explícitas para `UPDATE` no role de Admins/Coordenadores. O padrão do RLS é "deny all" para writes.
**Prevenção:** Sempre testar operações de escrita com usuários de diferentes roles. Verificar o atributo `count` ou `data` retornado pelo Supabase para confirmar a persistência.

### [2026-02-18] - [DB/SCHEMA] Colunas Fantasmas em Queries

**Contexto:** Erro 500 no Feed. O código TypeScript solicitava `avatar_url` na query, mas a coluna não existia mais no banco `profiles`.
**Solução:** Remover a coluna da query.
**Prevenção:** Manter interfaces TypeScript geradas automaticamente a partir do schema do banco (Introspection) ou validar queries manualmente após migrações de schema.

### [2026-02-18] - [UX/FORMS] Redimensionamento de Textarea

**Contexto:** Usuários reclamaram da dificuldade de escrever textos longos em inputs de altura fixa.
**Solução:** Habilitar `resize-y` e definir `min-height` generoso.
**Prevenção:** Em campos de texto livre (posts, descrições), nunca bloquear o redimensionamento vertical (`resize-none`) a menos que estritamente necessário pelo design.

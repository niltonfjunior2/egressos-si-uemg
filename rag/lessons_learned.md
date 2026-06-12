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

### [2026-05-29] - [DB/SECURITY] Explicit GRANTs for Data API Access

**Contexto:** O Supabase alterou o comportamento padrão da Data API (PostgREST) a partir de Maio/2026. Novas tabelas criadas no schema `public` não são mais expostas pela API se não tiverem declarações de `GRANT` explícitas, retornando erro `42501` do PostgREST.
**Solução:** Adicionar comandos de `GRANT SELECT` para `anon`, e `GRANT SELECT, INSERT, UPDATE, DELETE` para `authenticated` e `service_role` (juntamente com `ENABLE ROW LEVEL SECURITY`) logo após a criação da tabela.
**Prevenção:** Nunca criar tabelas no Supabase apenas com `CREATE TABLE`. Sempre inclua as cláusulas de ativação de RLS e os `GRANT`s explícitos para garantir que a aplicação React/Next.js consiga se comunicar com a tabela usando `supabase-js`.

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

### [2026-02-19] - [UX/ROUTING] Manutenção de Contexto em Sidebar Admin

**Contexto:** Ao clicar em um link "Comunidade" na sidebar do Admin, o usuário era redirecionado para a rota `/feed` (layout do portal), perdendo a navegação administrativa.
**Solução:** Criar uma rota dedicada `/admin/community` que reutiliza o componente de Feed (`FeedList`), mas renderizada dentro do layout `admin`.
**Prevenção:** Se uma funcionalidade deve existir em dois contextos (Portal e Admin), não linkar para a mesma rota. Criar rotas distintas que importam o mesmo componente, preservando o layout de cada área.

### [2026-03-08] - [EXT-WIDGET] Injeção Segura de Widgets de Terceiros (Elfsight CDN)

**Contexto:** O encerramento da API "Basic Display" do Instagram em Dez. 2024 forçou a substituição de desenvolvimentos nativos complexos pelo uso do Iframe da **Elfsight**.
**Solução:** Injetar bibliotecas como o `platform.js` da plataforma externa utilizando o componente otimizado do framework: `<Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />`.
**Prevenção (Armadilha):** Um widget visualmente denso do Instagram puxará inúmeras imagens do servidor externo e bloqueará o First Input Delay (FID) se for executado como Javascript síncrono no fim da página de pouso. O uso obrigatório do `strategy="lazyOnload"` garante que os rastreadores leiam a página rápido sem esperar pelas imagens sociais da plataforma alheia.

### [2026-03-08] - [ARCH/REFACTOR] Rotas Órfãs em Redirecionamentos de Punição

**Contexto:** Ao remover a funcionalidade nativa do Feed, a pasta global `app/feed` foi excluída. Imediatamente após, o build e o servidor (`npm run dev`) começaram a apontar falhas de 404 e tela em branco escondidas no painel Administrativo.
**Solução:** A pasta apagada estava sendo silenciosamente invocada por lógicas de RBAC (Role-Based Access Control) dentro de arquivos cruciais de layout (ex. se o aluno tentar entrar no Admin Panel, o script dava `redirect('/feed')`). A rota de escape foi corrigida para `/directory`.
**Prevenção:** Em aplicações Next.js grandes, não basta remover os sidebars ou links visíveis de um diretório recém-apagado. Devemos sempre fazer uma busca textual (`grep`) pelo caminho raiz (ex: `/feed`) para estancar redirects de segurança codificados em Middlewares e Server Actions antes de deletar as pastas.

### [2026-02-20] - [ARCH/DASHBOARD] Métricas de Empregabilidade Segmentadas por Role

**Contexto:** O dashboard exibia uma única "Taxa de Empregabilidade" calculada sobre os formados. Isso obscurecia a realidade: Alunos (ainda cursando) e Egressos (formados) têm contextos de carreira distintos e devem ser medidos separadamente.
**Solução:** Buscar profiles separados por role (`.eq('role', 'egresso')` e `.eq('role', 'aluno')`), cruzar com `professional_history` onde `is_current = true`, e exibir dois indicadores distintos com seus denominadores corretos.
**Prevenção:** Em dashboards acadêmicos, nunca agregar métricas de carreira entre roles diferentes. Uma taxa geral pode mascarar discrepâncias importantes entre grupos.

### [2026-02-20] - [ARCH/DATA] Agregação de Colunas ARRAY no Servidor (Server Component)

**Contexto:** Colunas `ARRAY` do Postgres (ex: `most_useful_areas`, `soft_skills_desired`, `methodology_priority`) chegam ao TypeScript como `string[] | null`. Para exibir frequência de itens no dashboard, é necessário agregar todas as respostas.
**Solução:** Criar um helper `aggregateArrayField(arrays: (string[] | null)[]): [string, number][]` que conta ocorrências e retorna pares `[item, count]` ordenados. Executar no Server Component, passando apenas os dados finais para o JSX.
**Prevenção:** Nunca trazer dados brutos para o cliente só para agrupar. Toda agregação de survey data deve ser feita server-side. O padrão `aggregateArrayField` é reutilizável para qualquer coluna ARRAY do schema.

### [2026-02-20] - [ARCH/DATA] Tokenização de Texto Livre para Tag Cloud de Insights

**Contexto:** O campo `missing_technologies` é texto livre (ex: "Faltou Docker, Kubernetes e mais práticas de DevOps"). Para exibir uma nuvem de tags com as tecnologias mais citadas, é necessário tokenizar e contar frequência de palavras.
**Solução:** Fazer `.toLowerCase().split(/[\s,;./\-\n]+/)`, filtrar termos com menos de 3 caracteres e aplicar uma lista de stopwords (`de`, `do`, `da`, `e`, `com` etc.). O peso visual de cada tag (tamanho/opacidade) é proporcional a `count / maxCount`.
**Prevenção:** Campos de texto livre nunca devem ser exibidos brutos em dashboards. Sempre pré-processar com tokenização + stopwords antes de calcular frequência. Definir stopwords explícitas no código — não depender de bibliotecas externas para esse caso simples.

### [2026-05-23] - [ARCH/COMPLIANCE] Componentes em Modos de Restrição (Vedação Eleitoral)

**Contexto:** O componente `FeedSection` exibia Vagas, Mentores e o feed do Instagram. Durante o Modo de Vedação Eleitoral, precisávamos exibir as Vagas e Mentores, mas a exibição do Instagram violaria as leis eleitorais sobre publicidade institucional.
**Solução:** Em vez de duplicar componentes ou criar um `FeedSectionElection`, foi adicionada a prop `hideInstagramFeed?: boolean` ao `FeedSectionProps`. Na renderização em `isElectionMode`, o componente é chamado com a prop `true`.
**Prevenção:** Ao reaproveitar componentes "agregadores" em páginas com rigoroso compliance legal ou restrição de acesso, isole seções sensíveis (widgets de terceiros, redes sociais) atrás de flags condicionais de visibilidade explícitas.

### [2026-05-23] - [SECURITY/NEXTJS] Broken Access Control em Server Actions

**Contexto:** Funções administrativas em `app/admin/users/actions.ts` utilizavam `createAdminClient()` (bypassing RLS) assumindo que estavam protegidas pelas rotas. O Next.js expõe Server Actions como endpoints públicos que podem ser ativados diretamente por requisições HTTP (POST) independentemente da proteção de layout/middleware da página.
**Solução:** Criação de um utilitário interno `checkAdminAccess()` e injeção do mesmo na primeira linha de toda Server Action, barrando imediatamente requisições que não possuam autenticação e a role RBAC apropriada (administrador ou coordenador). Adição de segredos (`?secret=`) em rotas de API destrutivas (Seed).
**Prevenção:** O Middleware protege o roteamento de páginas (Views), mas NÃO protege as mutações isoladas (Server Actions). Toda Server Action sensível deve validar Autenticação e Autorização em seu escopo local antes de qualquer execução.

### [2026-05-29] - [SECURITY/DB] Efeito 'Deny All' Silencioso do RLS no Schema SQL

**Contexto:** Ao revisar o `schema.sql` (Fonte da Verdade), constatou-se que havia a cláusula `ENABLE ROW LEVEL SECURITY` acompanhada de `GRANT`s explícitos para acesso à API, mas as declarações de `CREATE POLICY` haviam sido omitidas do script. No PostgreSQL, ativar o RLS em uma tabela sem definir pelo menos uma política resulta num comportamento padrão de **"Deny All"** (bloqueio total de leitura/escrita).
**Solução:** Todas as políticas fundamentais de CRUD que estão ativas no banco de produção foram recriadas e documentadas no final do `schema.sql`, respeitando limites rígidos (ex: LGPD em `profile_surveys`).
**Prevenção:** Scripts de migração ou schemas de *Disaster Recovery* nunca devem ativar o RLS sem as suas respectivas *Policies*. Do contrário, o sistema recriado impedirá a leitura/escrita para todos os perfis `authenticated` imediatamente.

### [2026-05-29] - [ARCH/DEBT] Attack Surface e Ghost Routes (Código Morto)

**Contexto:** Após a migração do Feed (Fase 9), a tabela `feed_posts` foi excluída do banco de dados, porém, os antigos diretórios com Server Actions (`app/feed/actions.ts` e `app/admin/feed/actions.ts`) permaneceram intactos na base de código.
**Solução:** Deleção completa desses diretórios. Embora eles não fossem renderizados em tela, o Next.js os compilava como "API Endpoints". 
**Prevenção:** Em grandes refatorações ou *Deprecations*, não basta excluir componentes de tela (Views) ou tabelas do DB; as Server Actions (Controllers) ligadas às features extintas devem ser rigorosamente excluídas, não só para enxugar o bundle de compilação do Webpack, mas para zerar vetores potenciais de ataques onde um form malicioso poderia bater em rotas órfãs.

### [2026-06-12] - [AUTH/EMAIL] Bypass do Motor de E-mail Nativo do Supabase

**Contexto:** Necessidade de usar provedores robustos (Brevo) com templates HTML ricos para recuperação de senha, substituindo os templates textuais limitados do Supabase.
**Solução:** Não usar `resetPasswordForEmail`. Em vez disso, usar `supabaseAdmin.auth.admin.generateLink({ type: 'recovery', email })` para gerar o token e a URL nos bastidores, e então disparar o e-mail manualmente utilizando a SDK do Brevo (`@getbrevo/brevo`).
**Prevenção:** Em integrações profissionais, desacople a geração de tokens de segurança (Supabase) da entrega da mensagem (Brevo, Resend, SendGrid).

### [2026-06-12] - [UX/SECURITY] Desacoplamento do Identificador de Login vs Destino de E-mail

**Contexto:** O servidor institucional da UEMG bloqueia recebimento de e-mails externos, impedindo alunos de receberem o link de recuperação de senha no e-mail principal do cadastro.
**Solução:** Adição de um `alternative_email` na tabela `profiles`. Na recuperação, o sistema busca o usuário por qualquer um dos dois e-mails, gera o link de recuperação baseado no `email` (login institucional obrigatório pelo Supabase Auth), mas envia o link via SMTP para o `alternative_email`.
**Prevenção:** Sistemas educacionais e corporativos frequentemente sofrem bloqueios rígidos de firewall/spam. Sempre preveja um e-mail pessoal alternativo para rotas críticas de recuperação de acesso.

### [2026-06-12] - [ADMIN/DB] Sincronização de E-mail de Login (Auth) e Perfil (Data)

**Contexto:** Permitir que o Administrador altere o e-mail de um usuário pelo painel requeria atualizar não apenas a tabela pública, mas o registro real de autenticação.
**Solução:** Usar `supabaseAdmin.auth.admin.updateUserById(id, { email: novoEmail })`. O Supabase Auth lida com as validações de unicidade automaticamente. Em seguida, aplicar o `UPDATE` na tabela `profiles`.
**Prevenção:** Alterações no e-mail de login feitas por Admins precisam sempre atualizar a tabela `auth.users` diretamente via Service Role (Admin Client), não bastando atualizar os registros visuais do schema `public`.

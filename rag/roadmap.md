# ROADMAP.md: EGRESSOS SI UEMG - Sistema de Acompanhamento de Egressos (UEMG)
>
> **Versão:** 3.1 (Refinado)
> **Status:** Em Execução (Fase 7)
> **Baseado em:** `PROJECT_DNA.md` (v2.0) e `lessons_learned.md`

Este documento guia o desenvolvimento incremental do sistema, unindo os requisitos regulatórios (CEE/MG) com os requisitos sociais (Vagas/Feed).

---

## FASE 0: FUNDAÇÃO (Infra & Setup) [CONCLUÍDO]

**DoD:** Projeto rodando na Vercel com login funcional e banco conectado.

---

## FASE 1: IDENTIDADE & CARREIRA (Single Player) [CONCLUÍDO]

**DoD:** Aluno loga e cadastra onde trabalha. Dados persistem com RLS.

---

## FASE 2: REDE SOCIAL ACADÊMICA (Multiplayer) [CONCLUÍDO]

**DoD:** Aluno vê postagens no Feed (Público e Autenticado) e encontra outros egressos.
*Notas:* Feed e Diretório implementados. RLS ajustado para permitir leitura pública na home.

---

## FASE 3: MERCADO DE OPORTUNIDADES (Value Loop) [CONCLUÍDO]

**DoD:** Aluno vê vaga, marca interesse e professor vê quem se interessou.
*Notas:* Mural de vagas funcional com distinção entre 'Tipo de Vaga' e 'Modelo de Trabalho'.

---

## FASE 4: GESTÃO & COMPLIANCE (The Boss) [CONCLUÍDO]

**Objetivo:** Ferramentas para a Coordenação (NDE).

- [x] **Painel Administrativo (Básico)**
  - [x] Layout & Sidebar (RBAC)
  - [x] Dashboard (Widgets + Gráficos)
- [x] **Gerenciamento de Usuários**
  - [x] Listagem, Filtros e Ações (CRUD)
  - [x] Controle de Acesso (RBAC)
- [x] **Gerenciamento de Vagas**
  - [x] CRUD completo com RBAC (Admin/Coord vs Auth)
  - [x] Campos Extras (Contato, PJ)
- [x] **Moderação**
  - [x] Admin pode apagar posts ou vagas impróprias.
  - [x] Fluxo de Aprovação de Postagens (Server Actions + UI).

- [x] **Relatórios CEE/MG**
  - [x] Exportação de dados para conformidade com a Resolução 502/2025.
- [x] **Melhorias de Navegação & UX**
  - [x] Sidebar Admin: "Comunidade" acessível para admins/coords/professores (sem sair do layout).
  - [x] Sidebar Admin: "Relatórios" restrito para admins/coords.

---

## FASE 6: LANDING PAGE REDESIGN [CONCLUÍDO]

**Objetivo:** Nova identidade visual moderna e responsiva.
**DoD:** Homepage com Hero, Stats, Feed integrado e novo Layout.

---

## FASE 7: INTERNAL PORTAL REFINEMENT [EM PROGRESSO]

**Objetivo:** Alinhar o portal interno com a nova identidade visual.

- [x] **Hero/Glass Styles**: Aplicado ao layout interno (`app/(portal)/layout.tsx`).
- [x] **Correções de UI/UX**:
  - [x] Feed: Correção de hidratação, visibilidade pública e aprovação.
  - [x] Vagas: Correção de campos, Adição de 'Monitoria' e 'Data de Expiração'.
  - [x] Diretório: Correção de busca.
- [x] **Profile Wizard & Survey**:
  - [x] Implementação do fluxo de 6 passos (Dados → Carreira → Educação → Pesquisa → Mentoria → Finalização).
  - [x] Coleta de dados estatísticos (LGPD + Pesquisa).
  - [x] Campos adicionados: Social Name, Mobile Phone, GitHub URL, Social Media URL, Lattes URL.
  - [x] Remoção de `avatar_url`, substituição por Social Media URL.
  - [x] Tech Stack no histórico profissional.
- [x] **Portal Sidebar & Navigation**:
  - [x] Sidebar com navegação: Perfil, Diretório, Vagas, Coordenação, Configurações.
  - [x] Remoção do Feed do portal.
  - [x] Redirecionamento pós-login para `/profile`.
- [x] **Profile View (Modo Leitura)**:
  - [x] Visualização completa do perfil em modo somente leitura.
  - [x] Edição via botão "Atualizar Cadastro" (redireciona para Wizard).
- [x] **Configurações de Segurança**:
  - [x] Alteração de senha.
- [x] **Diretório de Egressos (Aprimorado)**:
  - [x] Botão "Ver informações de contato" com Dialog.
  - [x] Exibição de e-mail, telefone/WhatsApp, links sociais e Lattes.
  - [x] Informações de Mentoria (cargo e tecnologias) para mentores.
  - [x] Filtragem por role: apenas Alunos e Egressos visíveis.
- [x] **Página do Coordenador**:
  - [x] Sidebar link "Coordenação".
  - [x] Exibição de dados do coordenador (exceto telefone).
- [x] **Correção de Logout**:
  - [x] Redirect para `/login` após signout (bypass de middleware stale session).

---

## FASE 5: FINALIZAÇÃO (Pendente)

**Objetivo:** Polimento para produção.

- [ ] **Testes & Segurança**
  - [ ] Verificar todas as políticas RLS (revisão final).
  - [ ] Otimizar imagens (Next/Image).
  - [ ] Documentação final (`README.md`).

---

### LEGENDAS DE LIÇÕES APRENDIDAS (L)

*Consultar `lessons_learned.md` para detalhes técnicos.*

- **[L11]**: Idempotência SQL.
- **[L12]**: Schema vs Types Audit.
- **[L13]**: Public RLS.
- **[L14]**: Hydration Mismatch.
- **[L15]**: Form vs DB Types.
- **[L16]**: Stale Session no Middleware após Signout.
- **[L17]**: Filtragem por Role em Listagens Públicas.
- **[L18]**: Evolução Incremental do Schema de Perfil.

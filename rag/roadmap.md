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

## FASE 4: GESTÃO & COMPLIANCE (The Boss) [EM PROGRESSO]

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
- [ ] **Moderação**
  - [ ] Admin pode apagar posts ou vagas impróprias.

- [ ] **Relatórios CEE/MG**
  - [ ] Exportação de dados para conformidade com a Resolução 502/2025.

---

## FASE 6: LANDING PAGE REDESIGN [CONCLUÍDO]

**Objetivo:** Nova identidade visual moderna e responsiva.
**DoD:** Homepage com Hero, Stats, Feed integrado e novo Layout.

---

## FASE 7: INTERNAL PORTAL REFINEMENT [EM PROGRESSO]

**Objetivo:** Alinhar o portal interno com a nova identidade visual.

- [x] **Hero/Glass Styles**: Aplicado ao layout interno (`app/(portal)/layout.tsx`).
- [x] **Correções de UI/UX**:
  - [x] Feed: Correção de hidratação e visibilidade pública.
  - [x] Vagas: Correção de campos (Remoto/Híbrido) e formulários.
  - [x] Diretório: Correção de busca.

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

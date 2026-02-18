# Instruções de Desenvolvimento: Painel Administrativo #

**Contexto:**
O objetivo é transformar os dados brutos do banco em **informações estratégicas** para o NDE (Núcleo Docente Estruturante) e para o cumprimento da Resolução CEE/MG 502/2025.

**Base de Dados:** Utilize o `schema.sql` existente.
**Permissões:** Acesso restrito a usuários com `role` = `'coordenador'` ou `'administrador'`.

---

## 1. Dashboard de Visão Geral (Landing do Admin) ##

**Objetivo:** Monitoramento rápido da saúde do curso e sucesso dos egressos.

* **KPIs (Cards de Métricas):**

1.**Total de Egressos Formados:**

* *Query:* `COUNT` em `academic_records` onde `status = 'formado'`.

2.**Taxa de Empregabilidade Aparente:**

* *Lógica:* % de egressos formados que possuem registro em `professional_history` com `is_current = true`.

3.**Salário Médio (Estimado):**

* *Lógica:* Distribuição dos valores da coluna `salary_range` (exibir gráfico de barras: "<2k", "2k-5k", etc.).

4.**Egressos em Educação Continuada:**

* *Query:* `COUNT` em `education_history` onde `status = 'em_andamento'`.

* **Gráfico Principal:** "Evolução de Formandos por Ano" (Eixo X: `graduation_year`, Eixo Y: Quantidade).

## 2. Módulo de Gestão de Egressos (O "Censo") ##

**Objetivo:** Listagem auditável para identificar onde está cada ex-aluno.

* **Interface:** `DataTable` (Shadcn/UI) com paginação server-side.
* **Colunas Obrigatórias:**
* Nome Completo (`profiles.full_name`)
* Ano de Formatura (`academic_records.graduation_year`)
* Empresa Atual (Último registro de `professional_history` onde `is_current = true`)
* Cargo Atual (`role_title`)
* Status (`academic_records.status`)

* **Filtros Avançados:**
* Por Ano de Formatura.
* Por "Empregado" vs "Sem registro profissional".
* Por "Disponível para Mentoria" (`is_open_to_mentoring`).

* **Ação:** Botão "Ver Detalhes" que abre a **Ficha Completa do Egresso**.

## 3. Ficha Completa do Egresso (View Detalhada) ##

**Objetivo:** Visão 360º de um aluno específico para análise qualitativa do NDE.

* **Header:** Nome, Links (LinkedIn/GitHub/Lattes/Redes Sociais) e Badges (ex: "Mentor", "Empregado").

* **Timeline de Carreira (Rastreabilidade):**
* Renderizar uma linha do tempo vertical combinando:
* Eventos Acadêmicos (`academic_records`: Entrada, Formatura).
* Eventos Profissionais (`professional_history`: Cargos, Promoções).
* Eventos Educacionais (`education_history`: Pós-graduação).

* *Insight Regulatório:* Calcular visualmente o "Tempo até o primeiro emprego" (Diferença entre `graduation_year` e a primeira `start_date` profissional).

* **Interesses:**
* Listar vagas que o aluno marcou interesse (`opportunity_interests`), permitindo ao coordenador ver se o aluno está ativo na busca.

## 4. Relatórios de Conformidade (Exportação) ##

**Objetivo:** Gerar evidências para o CEE/MG (Art. 94 e 96).

* **Botão "Exportar Relatório PDI":**
* Gerar CSV/PDF contendo:
* Lista de empresas parceiras (agrupadas por `company_name` mais frequentes).
* Lista de tecnologias mais utilizadas (agregação de `tech_stack`).
* *Justificativa:* Isso atende ao Art. 21 (Perfil do Egresso) mostrando a aderência tecnológica do curso ao mercado.

## 5. Moderação (Controle Institucional) ##

**Objetivo:** Garantir a qualidade do "Mural de Vagas" e "Feed".

* **Aprovação de Vagas:**
* Lista de `opportunities` recentes.
* Ações: Editar (corrigir erros), Fechar (se preenchida) ou Excluir (se imprópria).

* **Gestão do Feed:**
* Capacidade de "Pinar" (`is_pinned = true`) notícias oficiais da coordenação no topo do feed dos alunos.

---

## Diretrizes Técnicas para o Agente (Antigravity) ##

1. **Segurança de Dados (LGPD):**

* No frontend (`client-side`), **jamais** exponha o objeto completo do perfil. Crie DTOs (Data Transfer Objects) específicos para o Admin que filtrem dados sensíveis se necessário.
* As queries de agregação (Gráficos) devem ser feitas no banco (SQL `COUNT`, `GROUP BY`) e retornar apenas números, nunca listas de nomes.

2.**Performance:**

* Utilize `Supabase RPC` (Remote Procedure Calls) ou Views SQL se as queries de agregação ficarem complexas, em vez de processar arrays gigantes no Javascript.

3.**UX Administrativa:**

* Use "Badges" coloridas para status (Verde = Formado/Empregado, Amarelo = Cursando/Buscando).
* A navegação deve ser lateral (Sidebar) separando "Estratégico" (Dashboard) de "Operacional" (Listas).

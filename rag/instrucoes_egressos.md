# INSTRUÇÕES PARA O CADASTRO DE DADOS DE EGRESSOS #

## Com base no seu `schema.sql` atual e na necessidade de garantir dados para análise (conformidade com o CEE/MG), aqui estão as **Diretrizes de Implementação** para o Google Antigravity ##

## Estas instruções transformam a exigência de "100% de cadastro" em uma regra de negócio lógica e visual ##

---

### Instruções para o Agente: Módulo de Onboarding e Completude de Perfil ###

**Objetivo:** Garantir que o egresso, após o cadastro simples (Login/Senha), seja guiado visualmente até fornecer todos os dados necessários para os indicadores do curso.

#### 1. Definição de "Perfil 100%" (O Algoritmo de Score) ####

O sistema deve calcular a completude baseado no preenchimento das tabelas do `schema.sql`. O cálculo deve ser dinâmico.

**Fórmula Sugerida:**

* **30% - Identidade (Tabela `profiles`)**
* +10% se tiver `avatar_url` (Foto é vital para humanizar a plataforma).
* +10% se tiver `linkedin_url` (Conectividade profissional).
* +10% se definiu `is_open_to_mentoring` (Engajamento: True ou False, não pode ser Null).

* **30% - Vínculo Acadêmico (Tabela `academic_records`)**
* +30% se existir ao menos um registro com `status = 'formado'` e `graduation_year` preenchido. (Essencial para as coortes de análise).

* **40% - Situação Profissional (Tabela `professional_history`)**
* +40% se existir ao menos **UM** registro na tabela (seja estágio passado ou emprego atual).
* *Nota:* Se o aluno nunca trabalhou, o sistema deve oferecer um botão "Ainda não possuo experiência", que grava um registro de sistema ou uma flag para validar esses 40% sem forçar dados falsos.

#### 2. Fluxo de Usuário (UX/UI) ####

**A. O "Check" no Primeiro Acesso (Middleware/Layout):**

* Ao logar, o sistema verifica o `completion_score`.
* **Se Score < 100%:**
* Exibir um **"Card de Pendências"** fixo no topo do Dashboard.
* Mensagem: *"Olá, [Nome]! Para acessar vagas exclusivas e conectar-se com colegas, precisamos completar seu perfil acadêmico."*
* Botão de Ação: "Completar meu Perfil agora".

**B. O Componente Visual (Barra de Progresso):**

* Implementar o componente `ProfileCompletion.tsx` usando a biblioteca **Shadcn/UI Progress**.
* **Feedback Visual:**
* 0-40%: Cor Vermelha (Crítico - Faltam dados acadêmicos).
* 50-90%: Cor Amarela (Atenção - Falta foto ou LinkedIn).
* 100%: Cor Verde (Sucesso - Exibir badge "Perfil Verificado").

**C. Bloqueio de Funcionalidades (Gatilho de Motivação):**

* Para motivar o preenchimento, certas ações devem exigir perfil completo:
* *Candidatar-se a Vagas* (`opportunity_interests`): **Bloqueado** se Score < 70%.
* *Postar no Feed* (`feed_posts`): **Bloqueado** se Score < 100%.

#### 3. Instruções Técnicas para o Código ####

Diga ao Antigravity para criar um **Hook React** que centraliza essa lógica, evitando repetição.

```typescript
// src/hooks/use-profile-completion.ts

export function useProfileCompletion(profile, academic, professional) {
  let score = 0;
  const missingFields = [];

  // 1. Check Identidade
  if (profile?.avatar_url) score += 10; 
  else missingFields.push("Foto de Perfil");

  if (profile?.linkedin_url) score += 10;
  else missingFields.push("LinkedIn");

  // 2. Check Acadêmico
  if (academic?.length > 0) score += 30;
  else missingFields.push("Dados da Graduação");

  // 3. Check Profissional
  if (professional?.length > 0) score += 40;
  else missingFields.push("Histórico Profissional");

  return { 
    score, 
    isComplete: score === 100, 
    missingFields 
  };
}
```

#### 4. Adaptação no Painel Administrativo ####

No Painel do Coordenador (solicitado anteriormente), adicione uma coluna na listagem de egressos chamada **"Status do Cadastro"**  

* Permite filtrar quem são os "Egressos Fantasmas" (cadastrados mas sem dados) para envio de e-mails de cobrança (Nudge)

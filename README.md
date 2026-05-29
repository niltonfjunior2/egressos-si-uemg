# Egressos SI UEMG - Plataforma de Conexão e Carreira

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database/Auth-47C28A?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

Plataforma oficial de Rastreamento de Egressos e Rede Social Acadêmica do curso de **Sistemas de Informação da Universidade do Estado de Minas Gerais - Unidade Carangola**.

## 🎯 Objetivo

Desenvolver uma plataforma híbrida para:
1. **Rastreamento de Egressos (Compliance Regulatório):** Atendimento à Resolução CEE/MG 502/2025 para acompanhamento da trajetória profissional dos formandos.
2. **Rede Social Acadêmica (Engajamento):** Promover networking, troca de conhecimentos e divulgação de vagas de emprego entre alunos, egressos e professores.

## 🚀 Tecnologias

- **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com componentes [Shadcn/UI](https://ui.shadcn.com/)
- **Backend / Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura baseada em features, isolando as áreas de acesso:

- `/app/(public)`: Landing Page e áreas abertas.
- `/app/(portal)`: Área logada do Aluno/Egresso (Vagas, Feed, Diretório, Perfil).
- `/app/admin`: Área da Coordenação (Dashboards, Relatórios, Gestão de Usuários).
- `/components`: Componentes reutilizáveis de UI (Shadcn) e blocos das páginas.
- `/sql`: Scripts SQL, esquema principal do banco de dados e migrações (Supabase).
- `/rag`: Documentação interna, arquitetura do projeto e base de conhecimento.

## ⚙️ Pré-requisitos

Para rodar este projeto localmente, você precisará de:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Um projeto criado no [Supabase](https://supabase.com/)

## 🛠️ Configuração e Execução Local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd egressos-si-uemg
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione suas credenciais públicas do Supabase:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-do-supabase
     ```

4. **Configure o Banco de Dados:**
   - Acesse o SQL Editor no painel web do Supabase.
   - Copie e execute o script localizado em `sql/schema.sql` para gerar o schema (tabelas, funções, triggers e políticas RLS).
   - *Atenção:* O arquivo `sql/schema.sql` é a Fonte da Verdade do esquema de dados.

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔒 Segurança e Privacidade

- A plataforma segue os preceitos da LGPD. Dados como pretensões salariais e telefones não públicos ficam restritos ao próprio usuário e à administração do curso para fins exclusivamente acadêmicos e analíticos.
- Todo acesso aos dados é governado no nível do banco por **Row Level Security (RLS)**, garantindo integridade e impossibilitando exposição acidental de dados sensíveis da API (Supabase Data API).

## 📖 Documentação Adicional

A lógica de negócios detalhada, histórico de bugs conhecidos e a "DNA" do projeto estão presentes no diretório `/rag`. Recomendamos a leitura de `rag/project_dna.md` para entender as restrições invioláveis de arquitetura antes de qualquer grande refatoração.

---

Desenvolvido para a comunidade acadêmica de **Sistemas de Informação - UEMG Carangola**.

# 📋 TaskFlow (TarefasFlow)

> Aplicativo web moderno, ágil e intuitivo para gestão e acompanhamento de tarefas diárias, com foco em alta produtividade, design elegante e experiência de usuário (UX) fluida.

[![Deploy to GitHub Pages](https://github.com/soujlam/TaskFlow/actions/workflows/deploy.yml/badge.svg)](https://github.com/soujlam/TaskFlow/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-22c55e?style=flat&logo=github)](https://soujlam.github.io/TaskFlow/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=flat&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌐 Demonstração Online

Acesse o aplicativo em produção diretamente no GitHub Pages:  
👉 **[https://soujlam.github.io/TaskFlow/](https://soujlam.github.io/TaskFlow/)**

---

## ✨ Funcionalidades e Diferenciais de UX

- **⚡ Entrada Rápida de Tarefas**:
  - Cadastro ágil com suporte à tecla <kbd>Enter</kbd> ou atalho global <kbd>N</kbd>.
  - Seleção prévia de prioridades (**Alta**, **Média** ou **Baixa**) com paleta de cores semântica.
- **🏷️ Categorias & Etiquetas (Tags)**:
  - Organização por categorias (*Trabalho*, *Pessoal*, *Estudos*, *Finanças*, *Saúde*, *Outros*).
  - Filtro dedicado por categoria na barra de busca e visualização com tags coloridas e elegantes.
- **📅 Prazos e Datas de Vencimento**:
  - Seletor rápido de prazos (*Hoje*, *Amanhã* ou data específica).
  - Alertas contextuais com contagem regressiva e aviso pulsante em vermelho para tarefas **Atrasadas**.
  - Ordenação automática por data de vencimento.
- **📊 Cartão de Progresso em Tempo Real**:
  - Barra de progresso dinâmica com percentual de conclusão.
  - Mensagens motivacionais baseadas no seu ritmo de conclusão.
- **🔍 Filtros e Busca Inteligente**:
  - Filtro por status: *Todas*, *Pendentes* e *Concluídas* (com contadores em tempo real).
  - Filtro por prioridade e por categoria.
  - Campo de busca instantânea com suporte ao atalho global <kbd>/</kbd> e botão de limpeza rápida.
  - Ordenação por *Mais recente*, *Mais antiga*, *Maior prioridade* ou *Data de vencimento*.
- **✏️ Edição Direta (Inline)**:
  - Duplo clique no texto de qualquer tarefa ou clique no ícone de lápis para editar na hora.
  - Salvamento automático ao pressionar <kbd>Enter</kbd> ou ao clicar fora (<kbd>blur</kbd>).
- **🛡️ Recuperação de Exclusão (Undo Toast)**:
  - Notificação flutuante com temporizador de 6 segundos permitindo **Desfazer** exclusões acidentais com um único clique.
- **💾 Backup & Restauração (Exportar / Importar)**:
  - Exporte e importe suas tarefas em arquivos `.json` com um clique no cabeçalho.
- **⌨️ Atalhos de Teclado**:
  - Pressione <kbd>N</kbd> para ir direto ao campo de criação de tarefa.
  - Pressione <kbd>/</kbd> para buscar rapidamente entre suas tarefas.
- **🌓 Modo Claro e Escuro (Dark/Light)**:
  - Alternância de tema com um clique e detecção automática da preferência do sistema operacional.
  - Persistência das preferências visuais no navegador.
- **🔒 100% Offline e Seguro**:
  - Todos os dados são sincronizados no `localStorage` do seu navegador. Seus dados nunca saem do seu dispositivo.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** — Biblioteca reativa moderna com hooks otimizados.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática robusta para código seguro.
- **[Vite 8](https://vite.dev/)** — Bundler ultrarrápido para desenvolvimento e build de produção.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Framework utilitário de estilização de última geração.
- **[Lucide React](https://lucide.dev/)** — Ícones leves, consistentes e modernos.
- **[GitHub Actions](https://github.com/features/actions)** — Pipeline de Integração e Entrega Contínua (CI/CD) para deploy automático no GitHub Pages.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
- Gerenciador de pacotes `npm` ou `pnpm`

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:soujlam/TaskFlow.git
   cd TaskFlow
   ```

2. **Instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O aplicativo estará disponível em: `http://localhost:3000`

4. **Gerar versão de produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais serão compilados na pasta `dist/` e espelhados em `docs/`.

---

## 🚢 Deploy Contínuo no GitHub Pages

O projeto já conta com o fluxo de automação configurado em `.github/workflows/deploy.yml`:
- Toda alteração enviada para a branch `main` dispara automaticamente o build e atualiza o GitHub Pages.
- O caminho base de assets (`base: './'`) está configurado no `vite.config.ts`, garantindo compatibilidade total com subcaminhos de repositório.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE).

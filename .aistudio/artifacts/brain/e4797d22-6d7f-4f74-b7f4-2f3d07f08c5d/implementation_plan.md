# TarefasFlow — Gestão Inteligente e Ágil de Tarefas

Aplicação web leve, fluida e vibrante para gerenciamento diário de tarefas, com adição ágil, marcação de conclusão interativa, remoção com confirmação/desfazer, prioridades personalizadas, filtros dinâmicos e persistência local via LocalStorage.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões de produto a seguir foram confirmadas com base nas suas preferências:
> - **Estilo Visual**: Visual descontraído e vibrante com cores suaves (tons pastéis modernos, bordas limpas e suporte completo a modo claro e escuro).
> - **Recursos de Organização**: Filtros rápidos (Todas, Ativas/Pendentes e Concluídas), prioridades (Baixa, Média, Alta) com indicadores visuais sutis e barra de progresso.
> - **Armazenamento**: Persistência automática no navegador via `localStorage`, mantendo todas as atividades salvas após fechar ou recarregar a página.

---

### 1. Overview & Core Concept

- **O que a aplicação faz**: Permite que o usuário organize suas atividades diárias com máxima rapidez. Possui entrada rápida de texto com tecla `Enter`, seleção opcional de prioridade, alternância intuitiva de conclusão com animação e exclusão com segurança (opção de desfazer).
- **Público-Alvo**: Estudantes, profissionais e qualquer pessoa que busque foco diário sem fricção, burocracia ou sobrecarga de configurações.
- **Proposta de Valor**: Uma ferramenta direta, elegante, livre de distrações e totalmente responsiva (funciona com excelência tanto em computadores quanto em smartphones e tablets).

---

### 2. User Experience & Visual Design

#### Fluxos Principais do Usuário
1. **Adicionar Tarefas**:
   - Campo de entrada com foco automático e atalho rápido (`Enter`).
   - Seletor de prioridade discreto (Baixa, Média, Alta).
   - Botão de envio com feedback tátil e validação que impede itens vazios.
2. **Visualizar e Filtrar**:
   - Segmented control intuitivo com abas: **Todas** (total), **Pendentes** (em aberto) e **Concluídas**.
   - Barra de busca instantânea para encontrar tarefas por palavra-chave.
   - Indicador de progresso com contagem tabular (`X de Y tarefas concluídas`) e barra percentual dinâmica.
3. **Marcar como Concluída**:
   - Checkbox estilizado com transição suave, texto riscado e redução de opacidade elegante.
   - Atualização imediata dos contadores e da barra de progresso.
4. **Remover Tarefas**:
   - Ação de exclusão rápida em cada item.
   - Notificação tipo toast com botão "Desfazer" (Undo) por alguns segundos caso o usuário tenha excluído por engano.
   - Botão opcional "Limpar concluídas" quando houver itens finalizados.

#### Identidade Visual & Design System
- **Paleta de Cores & Atmosfera**:
  - *Modo Claro*: Fundo neutro suave (`#F8FAFC` / `#F1F5F9`), superfície dos cartões branca pura com bordas ultrafinas (`#E2E8F0`).
  - *Modo Escuro*: Fundo ardósia profundo (`#0F172A`), cartões com superfície contrastante (`#1E293B`) e bordas discretas (`#334155`).
  - *Acentos Vibrantes e Suaves*:
    - Coral / Rosa vibrante suave para ações primárias e destaque (`#F43F5E` / `#FB7185`).
    - Verde Esmeralda para tarefas concluídas e conquistas (`#10B981`).
    - Âmbar suave para prioridade média e alertas (`#F59E0B`).
    - Violeta / Indigo para categorias e foco (`#6366F1`).
- **Tipografia**:
  - Fonte display e interface: `Plus Jakarta Sans` para máxima legibilidade e ar moderno.
  - Alinhamento numérico: `font-variant-numeric: tabular-nums` para contadores e percentuais estáveis sem saltos de layout.
- **Micro-interações**:
  - Suporte a animações suaves com a biblioteca `motion` e CSS transitions.
  - Efeito de conclusão satisfatório e transições suaves de remoção.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Armazenamento em LocalStorage com Inicialização Robusta**:
  - *Abordagem*: Salvar o estado do array de tarefas no `localStorage` com tratamento para parsing de JSON e fallback limpo caso o armazenamento esteja indisponível.
  - *Por que*: Não depende de infraestrutura externa, funciona 100% offline e não exige criação de contas.
- **Decisão 2: Níveis de Prioridade Não-Intrusivos**:
  - *Abordagem*: Tags tipográficas elegantes sem badges estilo pílula artificial (Zero-Pill Discipline), com marcadores coloridos sutis.
  - *Por que*: Permite ordenar e categorizar sem poluir visualmente a lista.
- **Decisão 3: Confirmação Amigável de Exclusão (Undo Toast)**:
  - *Abordagem*: Em vez de bloquear o usuário com diálogos modais lentos, a exclusão remove o item com animação e oferece um toast com botão "Desfazer".
  - *Por que*: Mantém a velocidade da experiência enquanto protege contra toques acidentais.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Navegador Web                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    App Container                      │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Header: Título "TarefasFlow" + Theme Toggle     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ TaskProgressCard: Métricas e Barra de Progresso │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ TaskInput: Input de Texto + Prioridade + Add    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ TaskFilters: Abas (Todas/Pendentes/Concluídas)  │  │  │
│  │  │              + Busca por texto                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ TaskList: Renderização de Itens ou Empty State  │  │  │
│  │  │   ├── TaskItem: Checkbox, Texto, Tag, Excluir   │  │  │
│  │  │   └── TaskItem: ...                             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ UndoToast / Feedback Notification               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │ sync                         │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              LocalStorage (Browser Storage)           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Estrutura de Dados da Tarefa (TypeScript)
```typescript
export type PriorityLevel = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: PriorityLevel;
  createdAt: number;
  completedAt?: number;
}

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';
```

---

### 5. Plano de Implementação Passo a Passo

1. **Configuração de Estilo e Tema**:
   - Atualizar `src/index.css` com a declaração `@custom-variant dark` para Tailwind v4.
   - Carregar a fonte `Plus Jakarta Sans` via Google Fonts no `index.html`.
   - Atualizar `<title>` e metatags no `index.html` e `metadata.json`.
2. **Estado e Lógica de Persistência**:
   - Implementar hook ou utilitário com `localStorage` com seed inicial amigável (3 tarefas de exemplo demonstrando funcionalidades).
   - Ações atômicas: adicionar tarefa, alternar conclusão, excluir tarefa, editar título, restaurar tarefa (desfazer) e limpar concluídas.
3. **Componentes da Interface**:
   - **Header**: Marca visual única com seletor de tema claro/escuro.
   - **Progress Card**: Contador numérico (`tabular-nums`) e barra de progresso suave com feedback de conclusão.
   - **Input Bar**: Caixa de criação de atividade com suporte a tecla Enter e botões de prioridade (Baixa, Média, Alta).
   - **Filtros e Busca**: Abas funcionais para filtrar por status e campo de busca instantâneo.
   - **Lista e Itens**: Itens individuais com checkbox animado, texto com transição de riscado, data/prioridade com separadores sutis (sem pills artificiais) e botão de remoção.
   - **Toast de Desfazer**: Barra de notificação flutuante temporária para recuperar tarefas apagadas.
4. **Verificação e Testes**:
   - Compilação com `compile_applet`.
   - Garantir que todos os botões e atalhos de teclado funcionam perfeitamente sem falhas.

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { ProgressCard } from './components/ProgressCard';
import { TaskInput } from './components/TaskInput';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskItem } from './components/TaskItem';
import { UndoToast } from './components/UndoToast';
import { FilterStatus, PriorityLevel, SortOrder, Task, TaskCategory } from './types';
import { CheckSquare2, Inbox, PlusCircle, SearchX } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    restoreLastDeleted,
    dismissUndo,
    lastDeleted,
    clearCompleted,
    editTaskTitle,
    updateTaskPriority,
    importTasks,
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todas');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'todas'>('todas');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recente');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts (Press '/' for search, 'n' for new task)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (!isInputFocused) {
        if (e.key === '/') {
          e.preventDefault();
          searchInputRef.current?.focus();
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          const taskInput = document.querySelector<HTMLInputElement>('input[placeholder*="O que você precisa"]');
          taskInput?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Counts
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Filtering & Sorting
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pendentes' && task.completed) return false;
        if (statusFilter === 'concluidas' && !task.completed) return false;

        // Priority filter
        if (priorityFilter !== 'todas' && task.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== 'todas' && task.category !== categoryFilter) return false;

        // Search query
        if (query && !task.title.toLowerCase().includes(query)) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by Due Date
        if (sortOrder === 'vencimento') {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.localeCompare(b.dueDate);
          }
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
          return b.createdAt - a.createdAt;
        }

        // Primary sort
        if (sortOrder === 'recente') {
          return b.createdAt - a.createdAt;
        }
        if (sortOrder === 'antiga') {
          return a.createdAt - b.createdAt;
        }
        if (sortOrder === 'prioridade') {
          const weight: Record<PriorityLevel, number> = { alta: 3, media: 2, baixa: 1 };
          const diff = weight[b.priority] - weight[a.priority];
          if (diff !== 0) return diff;
          return b.createdAt - a.createdAt;
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500 w-full" />

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
        {/* Header Contract */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          pendingCount={counts.pending}
          tasks={tasks}
          onImportTasks={importTasks}
        />

        {/* Content Body */}
        <main className="mt-6 sm:mt-8 space-y-6 flex-1">
          {/* Progress Card */}
          <ProgressCard
            total={counts.total}
            completed={counts.completed}
            pending={counts.pending}
          />

          {/* Core Feature 1: Add Task Form */}
          <section aria-labelledby="add-task-heading">
            <h2 id="add-task-heading" className="sr-only">
              Adicionar nova tarefa
            </h2>
            <TaskInput onAddTask={addTask} />
          </section>

          {/* Filters, Search & Sorting Controls */}
          <section aria-labelledby="filter-tasks-heading">
            <h2 id="filter-tasks-heading" className="sr-only">
              Filtros e busca de tarefas
            </h2>
            <TaskFilterBar
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              onChangePriorityFilter={setPriorityFilter}
              categoryFilter={categoryFilter}
              onChangeCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOrder={sortOrder}
              onChangeSortOrder={setSortOrder}
              counts={counts}
              onClearCompleted={clearCompleted}
              searchInputRef={searchInputRef}
            />
          </section>

          {/* Core Features: Task List */}
          <section aria-labelledby="task-list-heading" className="pt-2">
            <h2 id="task-list-heading" className="sr-only">
              Lista de tarefas
            </h2>

            {filteredTasks.length > 0 ? (
              <div className="space-y-2.5">
                {filteredTasks.map((task: Task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onRemove={removeTask}
                    onEditTitle={editTaskTitle}
                    onUpdatePriority={updateTaskPriority}
                  />
                ))}
              </div>
            ) : (
              /* Empty States */
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 sm:p-12 text-center transition-all">
                {counts.total === 0 ? (
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      Sua lista está limpa
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Você ainda não possui nenhuma atividade cadastrada. Digite algo no campo acima para começar a organizar suas tarefas.
                    </p>
                  </div>
                ) : statusFilter === 'pendentes' && counts.pending === 0 ? (
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center">
                      <CheckSquare2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      Tudo zerado!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Não há pendências em aberto no momento. Aproveite seu tempo ou adicione um novo objetivo.
                    </p>
                  </div>
                ) : statusFilter === 'concluidas' && counts.completed === 0 ? (
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      Nenhuma tarefa concluída ainda
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Marque as caixas de seleção à esquerda de cada item para registrá-lo como concluído.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
                      <SearchX className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      Nenhuma tarefa encontrada
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Não encontramos atividades correspondentes aos filtros selecionados.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setPriorityFilter('todas');
                        setCategoryFilter('todas');
                        setStatusFilter('todas');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors cursor-pointer"
                    >
                      Redefinir filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        {/* Quiet Footer with Shortcuts and Metadata */}
        <footer className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span>TarefasFlow</span>
            <span aria-hidden="true">·</span>
            <span>Armazenado localmente</span>
            <span aria-hidden="true">·</span>
            <span>100% Offline &amp; Privado</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Atalhos: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">N</kbd> nova tarefa · <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">/</kbd> busca</span>
          </div>
        </footer>
      </div>

      {/* Floating Undo Toast */}
      <UndoToast
        deletedSnapshot={lastDeleted}
        onUndo={restoreLastDeleted}
        onDismiss={dismissUndo}
      />
    </div>
  );
}

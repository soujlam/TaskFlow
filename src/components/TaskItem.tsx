import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit2, CheckCheck, Calendar, AlertCircle } from 'lucide-react';
import { Task, PriorityLevel, TaskCategory } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onUpdatePriority: (id: string, newPriority: PriorityLevel) => void;
}

const PRIORITY_META: Record<PriorityLevel, { label: string; textClass: string; dotClass: string }> = {
  alta: {
    label: 'Alta',
    textClass: 'text-rose-600 dark:text-rose-400 font-medium',
    dotClass: 'bg-rose-500',
  },
  media: {
    label: 'Média',
    textClass: 'text-amber-600 dark:text-amber-400',
    dotClass: 'bg-amber-400',
  },
  baixa: {
    label: 'Baixa',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    dotClass: 'bg-emerald-400',
  },
};

const CATEGORY_STYLES: Record<TaskCategory, { bg: string; text: string; border: string }> = {
  Trabalho: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  Pessoal: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  Estudos: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  Finanças: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  Saúde: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  Outros: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
};

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `Há ${diffMins}m`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  return `Há ${diffDays}d`;
}

function getDueDateStatus(dueDateStr?: string, completed?: boolean) {
  if (!dueDateStr) return null;

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return {
      text: 'Hoje',
      isOverdue: false,
      badgeClass: completed
        ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        : 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/80 font-semibold',
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Amanhã',
      isOverdue: false,
      badgeClass: completed
        ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        : 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-300/80 dark:border-indigo-700/80 font-medium',
    };
  }

  if (diffDays < 0) {
    return {
      text: completed ? `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}` : `Atrasada (${Math.abs(diffDays)}d)`,
      isOverdue: !completed,
      badgeClass: completed
        ? 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        : 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300/80 dark:border-rose-700/80 font-semibold animate-pulse',
    };
  }

  return {
    text: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`,
    isOverdue: false,
    badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 font-medium',
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onRemove,
  onEditTitle,
  onUpdatePriority,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onEditTitle(task.id, trimmed);
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const priorityInfo = PRIORITY_META[task.priority];
  const dueDateInfo = getDueDateStatus(task.dueDate, task.completed);
  const categoryStyle = task.category ? CATEGORY_STYLES[task.category] : null;

  // Cycle priority on click for convenience
  const handleCyclePriority = () => {
    const cycleMap: Record<PriorityLevel, PriorityLevel> = {
      baixa: 'media',
      media: 'alta',
      alta: 'baixa',
    };
    onUpdatePriority(task.id, cycleMap[task.priority]);
  };

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-75'
          : dueDateInfo?.isOverdue
          ? 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Custom Accessible Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Marcar "${task.title}" como pendente` : `Marcar "${task.title}" como concluída`}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
          task.completed
            ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/25 ring-2 ring-emerald-500/30'
            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-rose-400 dark:hover:border-rose-500 bg-white dark:bg-slate-950'
        }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-rose-400 dark:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              onClick={handleSaveEdit}
              className="p-1.5 text-xs text-emerald-600 hover:text-emerald-700 rounded-md cursor-pointer"
              title="Salvar alteração"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            className="cursor-text select-text"
            title="Dê um duplo clique para editar"
          >
            <p
              className={`text-sm sm:text-base font-medium leading-snug break-words transition-all ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </p>
          </div>
        )}

        {/* Metadata Bar */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500 mt-2">
          {/* Priority indicator */}
          <button
            type="button"
            onClick={handleCyclePriority}
            title="Clique para alternar prioridade"
            className={`inline-flex items-center gap-1.5 transition-colors hover:opacity-80 cursor-pointer ${priorityInfo.textClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotClass}`} />
            <span>{priorityInfo.label}</span>
          </button>

          {/* Category Pill */}
          {task.category && categoryStyle && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {task.category}
              </span>
            </>
          )}

          {/* Due date indicator */}
          {dueDateInfo && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${dueDateInfo.badgeClass}`}
                title={`Vencimento: ${task.dueDate}`}
              >
                {dueDateInfo.isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                ) : (
                  <Calendar className="w-3 h-3 opacity-75" />
                )}
                <span>{dueDateInfo.text}</span>
              </span>
            </>
          )}

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

          <span>{formatRelativeTime(task.createdAt)}</span>

          {task.completed && task.completedAt && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Finalizada</span>
            </>
          )}
        </div>
      </div>

      {/* Actions (Edit and Delete) */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Editar tarefa "${task.title}"`}
          title="Editar tarefa"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onRemove(task.id)}
          aria-label={`Excluir tarefa "${task.title}"`}
          title="Excluir tarefa"
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

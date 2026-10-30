import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit2, CheckCheck } from 'lucide-react';
import { Task, PriorityLevel } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onUpdatePriority: (id: string, newPriority: PriorityLevel) => void;
}

const PRIORITY_META: Record<PriorityLevel, { label: string; textClass: string; dotClass: string }> = {
  alta: {
    label: 'Alta prioridade',
    textClass: 'text-rose-600 dark:text-rose-400 font-medium',
    dotClass: 'bg-rose-500',
  },
  media: {
    label: 'Prioridade média',
    textClass: 'text-amber-600 dark:text-amber-400',
    dotClass: 'bg-amber-400',
  },
  baixa: {
    label: 'Baixa prioridade',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    dotClass: 'bg-emerald-400',
  },
};

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Criada agora';
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  return `Há ${diffDays} dias`;
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
              className="p-1.5 text-xs text-emerald-600 hover:text-emerald-700 rounded-md"
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

        {/* Clean Unboxed Metadata with Typographic Separators (Zero-Pill Discipline) */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1.5">
          {/* Priority indicator as clean text with subtle dot */}
          <button
            type="button"
            onClick={handleCyclePriority}
            title="Clique para alternar prioridade"
            className={`flex items-center gap-1.5 transition-colors hover:opacity-80 cursor-pointer ${priorityInfo.textClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotClass}`} />
            <span>{priorityInfo.label}</span>
          </button>

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

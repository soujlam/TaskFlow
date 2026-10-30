import React, { useState, useRef } from 'react';
import { Plus, CornerDownLeft, Flag, Calendar, Tag, X } from 'lucide-react';
import { PriorityLevel, TaskCategory } from '../types';

interface TaskInputProps {
  onAddTask: (
    title: string,
    priority: PriorityLevel,
    category?: TaskCategory,
    dueDate?: string
  ) => boolean;
}

const PRIORITIES: { level: PriorityLevel; label: string; activeClass: string; dotColor: string }[] = [
  {
    level: 'baixa',
    label: 'Baixa',
    activeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold',
    dotColor: 'bg-emerald-400',
  },
  {
    level: 'media',
    label: 'Média',
    activeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold',
    dotColor: 'bg-amber-400',
  },
  {
    level: 'alta',
    label: 'Alta',
    activeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-semibold',
    dotColor: 'bg-rose-500',
  },
];

const CATEGORIES: TaskCategory[] = ['Trabalho', 'Pessoal', 'Estudos', 'Finanças', 'Saúde', 'Outros'];

function getTodayString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('media');
  const [category, setCategory] = useState<TaskCategory | ''>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [showExtras, setShowExtras] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const success = onAddTask(
      title,
      priority,
      category ? (category as TaskCategory) : undefined,
      dueDate || undefined
    );

    if (success) {
      setTitle('');
      setCategory('');
      setDueDate('');
      setShowExtras(false);
      inputRef.current?.focus();
    }
  };

  const handleSetQuickDate = (offset: number) => {
    const formatted = getTodayString(offset);
    setDueDate(dueDate === formatted ? '' : formatted);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Main Text Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que você precisa realizar hoje? (Pressione 'N' para focar)"
            className="w-full bg-slate-50/70 dark:bg-slate-950/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
          />
        </div>

        {/* Add Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-sm shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar</span>
          <kbd className="hidden sm:inline-flex items-center text-[10px] bg-rose-700/50 text-rose-100 rounded px-1.5 py-0.5 ml-0.5 border border-rose-400/30">
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
        </button>
      </div>

      {/* Control Bar: Priority, Category, Due Date */}
      <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          {/* Priority selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>Prioridade:</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-lg">
              {PRIORITIES.map((p) => {
                const isActive = priority === p.level;
                return (
                  <button
                    key={p.level}
                    type="button"
                    onClick={() => setPriority(p.level)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                      isActive
                        ? p.activeClass
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dotColor}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle button for extra metadata (Category & Due Date) */}
          <button
            type="button"
            onClick={() => setShowExtras(!showExtras)}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium py-1 px-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{showExtras ? 'Ocultar detalhes' : 'Data & Categoria'}</span>
            {(category || dueDate) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Expandable Extra Controls: Category and Due Date */}
        {showExtras && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory | '')}
                className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">Sem categoria</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick date pills and date picker */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => handleSetQuickDate(0)}
                className={`text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  dueDate === getTodayString(0)
                    ? 'bg-amber-500 text-white border-amber-500 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(1)}
                className={`text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  dueDate === getTodayString(1)
                    ? 'bg-indigo-500 text-white border-indigo-500 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                Amanhã
              </button>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  title="Limpar data"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

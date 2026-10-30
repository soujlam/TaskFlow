import React from 'react';
import { Search, X, Trash2, ArrowUpDown } from 'lucide-react';
import { FilterStatus, PriorityLevel, SortOrder } from '../types';

interface TaskFilterBarProps {
  statusFilter: FilterStatus;
  onChangeStatusFilter: (status: FilterStatus) => void;
  priorityFilter: PriorityLevel | 'todas';
  onChangePriorityFilter: (priority: PriorityLevel | 'todas') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: SortOrder;
  onChangeSortOrder: (order: SortOrder) => void;
  counts: {
    total: number;
    pending: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  statusFilter,
  onChangeStatusFilter,
  priorityFilter,
  onChangePriorityFilter,
  searchQuery,
  onSearchChange,
  sortOrder,
  onChangeSortOrder,
  counts,
  onClearCompleted,
}) => {
  return (
    <div className="space-y-3">
      {/* Search and Secondary Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar nas suas tarefas..."
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Priority dropdowns */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => onChangePriorityFilter(e.target.value as PriorityLevel | 'todas')}
            className="bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer shadow-2xs"
          >
            <option value="todas">Todas prioridades</option>
            <option value="alta">Apenas Alta</option>
            <option value="media">Apenas Média</option>
            <option value="baixa">Apenas Baixa</option>
          </select>

          {/* Sort order */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => onChangeSortOrder(e.target.value as SortOrder)}
              className="bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer appearance-none shadow-2xs"
            >
              <option value="recente">Mais recentes</option>
              <option value="antiga">Mais antigas</option>
              <option value="prioridade">Maior prioridade</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Primary Segmented Tabs for Status */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
          <button
            onClick={() => onChangeStatusFilter('todas')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              statusFilter === 'todas'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Todas</span>
            <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => onChangeStatusFilter('pendentes')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              statusFilter === 'pendentes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pendentes</span>
            <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => onChangeStatusFilter('concluidas')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              statusFilter === 'concluidas'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Concluídas</span>
            <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              {counts.completed}
            </span>
          </button>
        </div>

        {counts.completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar concluídas ({counts.completed})</span>
          </button>
        )}
      </div>
    </div>
  );
};

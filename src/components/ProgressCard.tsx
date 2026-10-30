import React from 'react';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

interface ProgressCardProps {
  total: number;
  completed: number;
  pending: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ total, completed, pending }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getMotivationalMessage = () => {
    if (total === 0) return 'Sua lista está limpa. Adicione uma atividade para começar.';
    if (percentage === 100) return 'Parabéns! Todas as tarefas foram concluídas com sucesso.';
    if (percentage >= 60) return 'Reta final! Mais da metade concluída com sucesso.';
    if (percentage > 0) return 'Bom ritmo! Continue avançando para finalizar suas atividades.';
    return 'Dê o primeiro passo marcando sua primeira atividade concluída.';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/60 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
            Progresso das Tarefas
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {getMotivationalMessage()}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-3xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
              {percentage}%
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">concluído</span>
          </div>

          {percentage === 100 && total > 0 && (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Numeric breakdown with tabular numerals and quiet typography */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{completed}</strong>{' '}
            {completed === 1 ? 'concluída' : 'concluídas'}
          </span>
        </div>

        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>
            <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{pending}</strong>{' '}
            {pending === 1 ? 'pendente' : 'pendentes'}
          </span>
        </div>

        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

        <div>
          <span>
            Total: <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{total}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

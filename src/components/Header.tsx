import React from 'react';
import { Sun, Moon, CheckCircle2, Sparkles } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, pendingCount }) => {
  return (
    <header className="flex items-center justify-between gap-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            TarefasFlow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão pessoal ágil e sem fricção
          </p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-3">
        {pendingCount > 0 ? (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              <strong className="font-mono tabular-nums text-slate-900 dark:text-white">{pendingCount}</strong> {pendingCount === 1 ? 'pendência ativa' : 'pendências ativas'}
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dia livre de pendências</span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};

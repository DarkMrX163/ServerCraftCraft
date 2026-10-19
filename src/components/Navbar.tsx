import React, { useState } from 'react';
import { Server, Download, Play, Square, RotateCw, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import type { ServerStatus } from '../types/server.ts';

interface NavbarProps {
  status: ServerStatus;
  onAction: (action: 'start' | 'stop' | 'restart') => void;
  onOpenGitHubExport: () => void;
  onOpenAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  onAction,
  onOpenGitHubExport,
  onOpenAIAssistant,
}) => {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText(`${status.ipAddress}:${status.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRunning = status.state === 'running';

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Zone 1: Brand title and bound Game badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <a href="#" className="text-base font-extrabold tracking-tight text-white whitespace-nowrap flex items-center gap-2">
            <span>AetherCraft Server</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Привязан к MineCraft_Qantum
            </span>
          </a>
        </div>
      </div>

      {/* Zone 2: Bound Web Game Link & Stats */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300">
        {/* Game Link Badge */}
        <a
          href="https://darkmrx163.github.io/MineCraft_Qantum/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 px-3 py-1.5 rounded-lg border border-cyan-800/60 text-cyan-300 transition-colors font-semibold"
        >
          <span>https://darkmrx163.github.io/MineCraft_Qantum/</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>

        {/* Live Slot Counter */}
        <div className="flex items-center gap-1.5 font-mono-tabular bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
          <span className="text-slate-400">Игроки:</span>
          <span className="font-bold text-white">{status.onlinePlayersCount}</span>
          <span className="text-slate-500">/</span>
          <span className="font-bold text-cyan-400">15</span>
        </div>

        {/* TPS */}
        <div className="flex items-center gap-1.5 font-mono-tabular bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
          <span className="text-slate-400">TPS:</span>
          <span className="font-bold text-emerald-400">20.00</span>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Power Controls */}
        <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
          {isRunning ? (
            <>
              <button
                onClick={() => onAction('restart')}
                title="Перезапустить"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-950/50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Перезапуск</span>
              </button>
              <button
                onClick={() => onAction('stop')}
                title="Остановить"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Стоп</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onAction('start')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Запустить</span>
            </button>
          )}
        </div>

        {/* AI Assistant */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI Помощник</span>
        </button>

        {/* GitHub Exporter CTA */}
        <button
          onClick={onOpenGitHubExport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg transition-all shadow-md shadow-cyan-900/20 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Код для Игры & GitHub</span>
        </button>
      </div>
    </header>
  );
};

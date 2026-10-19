import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Sparkles, Trash2, Filter, CornerDownLeft, Play, AlertCircle } from 'lucide-react';
import type { ConsoleLogEntry } from '../../types/server.ts';

interface ConsoleTabProps {
  logs: ConsoleLogEntry[];
  onSendCommand: (cmd: string) => Promise<void>;
  onAnalyzeLogs: () => Promise<{ text: string }>;
}

export const ConsoleTab: React.FC<ConsoleTabProps> = ({
  logs,
  onSendCommand,
  onAnalyzeLogs,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [analyzingLogs, setAnalyzingLogs] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput;
    setCommandInput('');
    await onSendCommand(cmd);
  };

  const handleRunAiLogAnalysis = async () => {
    setAnalyzingLogs(true);
    try {
      const res = await onAnalyzeLogs();
      setAiAnalysisResult(res.text);
    } finally {
      setAnalyzingLogs(false);
    }
  };

  const filteredLogs = logs.filter((l) => filterLevel === 'ALL' || l.level === filterLevel);

  const quickCommands = [
    { label: '/list игроки', cmd: '/list' },
    { label: '/tps нагрузка', cmd: '/tps' },
    { label: '/save-all бэкап', cmd: '/save-all' },
    { label: '/time set day день', cmd: '/time set day' },
    { label: '/weather clear', cmd: '/weather clear' },
    { label: '/reload конфиг', cmd: '/reload' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Интерактивная Живая Консоль Сервера</span>
          </h2>
          <p className="text-xs text-slate-400">
            Прямое управление командами, поток логов реального времени и расшифровка ошибок через Gemini AI
          </p>
        </div>

        <button
          onClick={handleRunAiLogAnalysis}
          disabled={analyzingLogs}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{analyzingLogs ? 'Расшифровка...' : 'AI Анализ Логов и Ошибок'}</span>
        </button>
      </div>

      {/* AI Analysis Result Callout */}
      {aiAnalysisResult && (
        <div className="bg-slate-950 border border-cyan-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Заключение AI-Администратора по логам</span>
            </div>
            <button onClick={() => setAiAnalysisResult(null)} className="text-xs text-slate-500 hover:text-white">
              ✕
            </button>
          </div>
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{aiAnalysisResult}</div>
        </div>
      )}

      {/* Quick Commands Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <span className="text-slate-500 font-bold px-2 shrink-0">Быстрый вызов:</span>
        {quickCommands.map((qc, idx) => (
          <button
            key={idx}
            onClick={() => onSendCommand(qc.cmd)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors font-mono-tabular shrink-0 cursor-pointer"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Console Output Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono-tabular shadow-inner">
        {/* Level Filters */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-semibold">Фильтр логов:</span>
            {['ALL', 'INFO', 'WARN', 'ERROR', 'CHAT'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500">{filteredLogs.length} строк</span>
        </div>

        {/* Terminal Text Scroll View */}
        <div className="h-96 overflow-y-auto space-y-1.5 pr-2 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 p-1 rounded transition-colors">
              <span className="text-slate-600 select-none shrink-0">[{log.timestamp}]</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                  log.level === 'INFO'
                    ? 'bg-blue-950/80 text-blue-400 border border-blue-900/60'
                    : log.level === 'WARN'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-900/60'
                    : log.level === 'ERROR'
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-900/60'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/60'
                }`}
              >
                {log.level}
              </span>
              <span className="text-slate-400 font-semibold shrink-0">[{log.source}]:</span>
              <span
                className={`break-all ${
                  log.level === 'ERROR'
                    ? 'text-rose-300 font-semibold'
                    : log.level === 'WARN'
                    ? 'text-amber-200'
                    : log.level === 'CHAT'
                    ? 'text-emerald-300'
                    : 'text-slate-200'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Command Input Box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-cyan-400 font-bold select-none pl-2">&gt;_</span>
          <input
            type="text"
            placeholder="Введите команду сервера (например: /op Steve или /weather clear)..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-slate-600 font-mono-tabular"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Отправить</span>
          </button>
        </form>
      </div>
    </div>
  );
};
